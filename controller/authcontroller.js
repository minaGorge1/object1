const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring')


const User = require('../models/userModel');
const config = require('../config/config')
const sendMail = require("../utils/sendEmail");
const { error } = require('console');
const sendResetPasswordMail = async(email,token) =>{
    try {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            //port:443,
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



exports.postSignup = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length >= 1) {
        return res.status(409).json({
            message: "Mail exists"
        });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
            return res.status(500).json({
                error: err
            });
            } else {
                const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                phoneNumber:req.body.phoneNumber,
                password: hash,
                is_admin: 0
            });
            user.save()
                .then(result => {
                    sendMail.sendVerificationEmail(req.body.email,result.user_id)
                    console.log(result);
                    res.status(201).json({
                    message: "User created"
                });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                    error: err
                });
                });
            }
        });
        }
    });
};
exports.verifyMail = async(req,res,next)=>{
    try {
        const updateinfo = await User.updateOne({_id:req.query.id},{$set:{is_varified:1 }});
        console.log(updateinfo);
        res.status(201).json({
            message: "Email verified"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: error
        });
    }
}

exports.postSignin =  (req,res,next)=>{
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
            message: "Auth failed"
        });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
            return res.status(401).json({
                message: "incorrect password"
            });
        }
        if (result) {
            const token = jwt.sign(
            {
                email:user[0].email,
                userId:user[0]._id
            },
            process.env.JWT_KEY,
            {
                expiresIn:"1h"
            }
            )
            return res.status(200).json({
                message: "Auth successful",
                token:token
            });
        }
        res.status(401).json({
            message: "Auth failed"
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
// signout
exports.logout = (req,res, next) =>{
    const authHeader = req.headers["authorization"];
    jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
    if (logout) {
        res.send({msg : 'You have been Logged Out' });
    } else {
    res.send({msg:'Error'});
}
});
}  

exports.Postforget_password = async(req,res,next)=>{
    try{
        const email = req.body.email
        const userData = await User.findOne({ email:email })
        console.log(userData.email)
        if(userData){
            const randomString = randomstring.generate();
            const Data = await User.updateOne({email:email},{$set:{token:randomString}});
            sendResetPasswordMail(userData.email,randomString)
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
exports.reset_password = async(req,res,next)=>{
    try {
        const token = req.query.token;
        const tokenData = await User.findOne({token:token});
        if(tokenData){
            const password = req.body.password;
            const  newPassword = bcrypt.hash(password,10,(err)=>{
                if (err) {
                    return res.status(500).json({
                    error: err
                    });
                }
            })
            const UserData = await User.findByIdAndUpdate({ _id:tokenData._id},{$set:{ password:newPassword,token:""}},
                {
                    new:true
                });
                res.status(200).send({success:true, msg:"password has been reset",data:UserData})
        }
        else{
            res.status(200).send({success:false, msg:"This link has been expired"})
        }
        
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }

}

//profile
exports.getUserProfile = async(req,res,next)=>{
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

// changepassword
exports.changepassword = async(req,res,next)=>
{
    try {
        const user_id = req.body.userId;
        const password = req.body.password;
    
        const data = await User.findOne({_id:user_id})
        console.log(data)
        if(data)
        {
            const newpassword = bcrypt.hash(password,10,(err)=>{
                if (err) {
                    return res.status(500).json({
                    error: err
                    });
                }
            })
                    const userData = await User.findByIdAndUpdate(
                        {
                            _id:user_id
                        },
                        {
                            $set:{
                                password: newpassword
                            }
                        });
                    res.status(200).send({success:true, msg:"password has been updated"})
        }
        else{
            res.status(400).send({success:false, msg:"you can not update your password"});
        }
    } catch (error) {
        res.status(400).send({success:false, msg:"user id not found"});
    }
}