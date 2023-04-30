const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const nodemailer = require("nodemailer")

const config = require("../config/config")
const ServiceProvider = require('../models/authSPmodel')

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

exports.PostSPsignup =  (req, res, next) => {
    ServiceProvider.find({ email: req.body.email })
        .exec()
        .then(serviceProvider => {
        if (serviceProvider.length >= 1) {
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
                const serviceProvider = new ServiceProvider({
                _id: new mongoose.Types.ObjectId(),
                serviceName:req.body.serviceName,
                email: req.body.email,
                Address:req.body.Address,
                password: hash,
                category:req.body.category
                });
                serviceProvider
                .save()
                .then(result => {
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

exports.PostSPsignin = (req,res,next)=>{
    ServiceProvider.find({ email: req.body.email })
    .exec()
    .then(serviceProvider => {
        if (serviceProvider.length < 1) {
        return res.status(401).json({
            message: "Auth failed"
        });
    }
    bcrypt.compare(req.body.password, serviceProvider[0].password, (err, result) => {
        if (err) {
            return res.status(401).json({
            message: "Auth failed"
        });
        }
        if (result) {
        const token = jwt.sign(
        {
            email:serviceProvider[0].email,
            serviceProviderId:serviceProvider[0]._id
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
//profile
/*
exports.getSPProfile = async(req,res,next)=>{
    if(req.params.id){
        try {
            const SPdata = ServiceProvider.findById(req.params.id)
            return res.status(200).json(SPdata)
        } 
        catch (error) {
            return res.status(400).json('user id is required');
    }
}
}*/
//forget password
exports.Postforget_password = async(req,res,next)=>{
    try{
        const email = req.body.email
        const userData = await ServiceProvider.findOne({ email:email })
        console.log(userData.email)
        if(userData){
            const randomString = randomstring.generate();
            const Data = await ServiceProvider.updateOne({email:email},{$set:{token:randomString}});
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
        const tokenData = await ServiceProvider.findOne({token:token});
        console.log(tokenData)
        if(tokenData){
            const password = req.body.password;
            const  newPassword = bcrypt.hash(password,10,(err)=>{
                if (err) {
                    return res.status(500).json({
                    error: err
                    });
                }
            })
            const UserData = await ServiceProvider.findByIdAndUpdate({ _id:tokenData._id},{$set:{ password:newPassword,token:""}},
                {
                    new:true
                });
                res.status(200).send({success:true, msg:"password has been reset",data:UserData})
        }
        else{
            res.status(200).send({success:false, msg:"This link has been expired"})
        }
        
    } catch (error) {
        res.status(403).send({success:false, msg:error.message});
    }

}

// changepassword
exports.changepassword = async(req,res,next)=>
{
    try {
        const user_id = req.body.serviceProviderId;
        const password = req.body.password;
    
        const data = await ServiceProvider.findOne({_id:user_id})
        console.log(data)
        if(data)
        {
            const newpassword = bcrypt.hash(password,10,(err) => {
                if (err) {
                    return res.status(500).json({
                    error: err
                    });
                }
            })
                    const userData = await ServiceProvider.findByIdAndUpdate(
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
//logout
exports.SPlogout = (req,res, next) =>{
    const authHeader = req.headers["authorization"];
    jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
    if (logout) {
        res.send({msg : 'You have been Logged Out' });
    } else {
    res.send({msg:'Error'});}
});
} 