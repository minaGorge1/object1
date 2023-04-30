const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const randomstring = require('randomstring')

const User = require('../models/userModel');
const sendMail = require("../utils/sendEmail");
const config = require("../config/config")
const createToken = require("../utils/createToken");


const sendResetPasswordMail = (email,token)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
            const mailOptions = {
                from: config.emailUser,
                to: email,
                subject: 'password Reset',
                html:'<p>Hi please copy the link to <a href="http://localhost:3000/resetPassword?token='+token+'">Reset</a> your password.</p>'
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })

    } catch (error) {
        console.log(error)
    }

}
// bycrpt password
const securePassword = (password)=>{
    try {
        const hashedPassword = bcrypt.hash(password,10);
        return hashedPassword;
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const createNewUser = async(req,res,next) =>{
    try {
        const hashPassword = await securePassword (req.body.password);
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email : req.body.email,
            phoneNumber: req.body.phoneNumber,
            password : hashPassword,
            is_admin: 0
        });
        const userData = await user.save();
        if(userData){
            sendMail.sendVerificationEmail(req.body.email,userData._id);
            res.status(200).send({success:true,data:userData,msg:"your registration has been successfully Please verify your email"});
        }
        else{
            res.status(200).send({success:false,msg:"your register has been failed"})
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const verifyMail = async(req,res,next)=>{
    try {
        const updateinfo = await User.updateOne({_id:req.query.id},{$set:{is_varified :1}});
        res.status(201).json({
            data:updateinfo,
            message: "Email verified"
        });
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }
}
const postSignin = async(req,res,next)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email})
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if (passwordMatch){
                const tokenData = await createToken(userData._id);
                    res.status(201).json({
                        message: "Auth successful",
                        token:tokenData
                    });
            }
            else{
                res.status(201).json({message: "password is incorrect"});
            }
        }
        else{
            res.status(200).send({success:false,message:"Login details are incorrect"});
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}
// signout
const logout = (req,res, next) =>{
    const authHeader = req.headers["authorization"];
    jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
    if (logout) {
        res.send({msg : 'You have been Logged Out' });
    } else {
    res.send({msg:'Error'});
    }
    });
} 
// update password

const changepassword = async(req,res,next)=>
{
    try {
        const user_id = req.body.user_id;
        const password = req.body.password;
    
        const data = await User.findOne({_id:user_id})
            if(data)
            {
            const newpassword = securePassword(password);
            const userData = await User.findByIdAndUpdate(
                        {
                            _id:user_id
                        },
                        {
                            $set:{
                                password: newpassword
                            }
                        }).then(
                            res.status(200).send({success:true,msg:"password has been updated"})
                        )
    }
        else{
            res.status(400).send({success:false, msg:"you can not update your password"});
        }
    
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const forget_password = async(req,res,next)=>{
    try{
        const email = req.body.email
        const userData = await User.findOne({ email:email })
        console.log(userData.email)
        if(userData){
            const randomString = randomstring.generate();
            const Data = await User.updateOne({email:email},{$set:{token:randomString}});
            sendResetPasswordMail(userData.email,randomString);
            res.status(200).send({success:true, msg:"Please check your email inbox"})

        }
        else{
            res.status(200).send({success:true, msg:"this email does not exists"})
        }
    }
    catch(error)
    {
        res.status(400).send({success:false, msg:error.message});
    }

}
const reset_password = async(req,res,next)=>{
    try {
        const token = req.query.token;
        const tokenData = await User.findOne({token:token})
        if(tokenData){
            const password = req.body.password;
            const  newPassword = securePassword(password)
            const UserData = await User.findByIdAndUpdate({ _id:tokenData._id},{$set:{ password:newPassword,token:""}},
                {
                    new:true
                }).then(
                    res.status(200).send({success:true, msg:"password has been reset"})
                )
        }
        else{
            res.status(200).send({success:false, msg:"This link has been expired"})
        }
        
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }

}
//profile
const getUserProfile = async(req,res,next)=>{
    if(req.params.id){
        try {
            const user = await User.findById(req.params.id)
            return res.status(200).json(user)
        } 
        catch (error) {
            return res.status(400).json('user id is required');
    }
}
}
const editUserProfile = async(req,res,next)=>{
    try {
        
        const userData = await User.findById({_id:req.params.id})
        if(userData){
            const data = await User.findByIdAndUpdate({_id:req.params.id},{$set:req.body})
            res.status(200).json("user profile has been updated");
        }
        else{
            res.status(500).json(err)
        }
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}

const deleteUserAccount = async(req,res,next)=>{
    if(req.body.user_id === req.params.id){
        try {
            const user = await User.findByIdAndDelete(req.body.user_id)
            res.status(200).send({success:true, msg:"Account has been deleted"});
        } catch (error) {
            res.status(400).send({success:false, msg:error.message});
        }

    }
    else{
        res.status(400).json("you can only delete your account")
    }
}


module.exports = {
    createNewUser,
    verifyMail,
    postSignin,
    logout,
    changepassword,
    forget_password,
    reset_password,
    getUserProfile,
    editUserProfile,
    deleteUserAccount
}