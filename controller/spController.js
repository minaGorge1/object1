const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const nodemailer = require("nodemailer")

const config = require("../config/config")
const sendMail = require("../utils/sendEmail")
const ServiceProvider = require('../models/spModel')
const createToken = require("../utils/createToken");

const sendResetPasswordMail = async(email,token) =>{
    try {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword,
            }
        });
        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'For reset password',
            html:"<p> hii "+',Please copy the link <a href ="http://localhost:3000/reset-password?token='+token+'"> and reset your password</a>'
        }
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
            }
            else{
                console.log("Mail has been sent :",info.response);
            }

        })
    } 
    catch (error) {
        res.status(400).send({success:false, msg:error.message})
        
    }

}

//bycrpt password
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
        const user = new ServiceProvider({
            _id: new mongoose.Types.ObjectId(),
            serviceName:req.body.serviceName,
            email : req.body.email,
            Address: req.body.Address,
            password : hashPassword,
            category:req.body.category,
        });
        const userData = await user.save();
        if(userData){
            sendMail.sendSPVerificationMail(req.body.email,userData._id);
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
        const updateinfo = await ServiceProvider.updateOne({_id:req.params.id},{$set:{is_varified :1}});
        console.log(req.params.id)
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

        const userData = await ServiceProvider.findOne({email:email})
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
        const user_id = req.body.serviceProvider_id;
        const password = req.body.password;
    
        const data = await ServiceProvider.findOne({_id:user_id})
            if(data)
            {
            const newpassword = securePassword(password);
            const userData = await ServiceProvider.findByIdAndUpdate(
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
        const userData = await ServiceProvider.findOne({ email:email })
        console.log(userData.email)
        if(userData){
            const randomString = randomstring.generate();
            const Data = await ServiceProvider.updateOne({email:email},{$set:{token:randomString}});
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
        const tokenData = await ServiceProvider.findOne({token:token})
        if(tokenData){
            const password = req.body.password;
            const  newPassword = securePassword(password)
            const UserData = await ServiceProvider.findByIdAndUpdate({ _id:tokenData._id},{$set:{ password:newPassword}},
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
            const user = await ServiceProvider.findById(req.params.id)
            return res.status(200).json(user)
        } 
        catch (error) {
            return res.status(400).json('user id is required');
    }
}
}
const editUserProfile = async(req,res,next)=>{
    try {
        
        const userData = await ServiceProvider.findById({_id:req.params.id})
        if(userData){
            const data = await ServiceProvider.findByIdAndUpdate({_id:req.params.id},{$set:req.body})
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
    if(req.body.serviceProvider_id === req.params.id){
        try {
            const user = await ServiceProvider.findByIdAndDelete(req.body.serviceProvider_id)
            res.status(200).send({success:true, msg:"Account has been deleted"});
        } catch (error) {
            res.status(400).send({success:false, msg:error.message});
        }

    }
    else{
        res.status(400).json("you can only delete your account")
    }
}
const sendVerificationLink = async (req,res,next)=>{
    try {
        const email = req.body.email;
        const userData = await ServiceProvider.findOne({email:email});
        console.log(userData.email)
        if(userData){
            sendMail.sendSPVerificationMail(userData.email,userData._id);
            res.status(200).send({success:true, message:"Reset verification Mail"});
        }
        else{
            res.status(400).send({success:false,message:"this mail is not exist"})
        }
    } 
    catch (error) {
        console.log(error.message);
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
    deleteUserAccount,
    sendVerificationLink
}