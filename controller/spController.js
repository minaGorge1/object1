
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient
const bcrypt = require('bcryptjs');
const randomstring = require("randomstring");

const sendMail = require("../utils/sendEmail")
const ServiceProvider = require('../models/spModel');
const Services = require("../models/serviceModel");
const createToken = require("../utils/createToken");
const auth = require("../middlewares/auth");

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
            username:req.body.username,
            Address: req.body.Address,
            password : hashPassword,
            category:req.body.category,
        });
        const userData = await user.save();
        if(userData){
            user.token = await createToken(userData._id);
            sendMail.sendSPVerificationMail(req.body.email,userData._id);
            res.status(200).send({success:true,data:userData,msg:"your registration has been successfully Please verify your email"});
        }
        else{
            res.status(400).send({success:false,msg:"your register has been failed"})
        }
    } catch (error) {
        res.status(400).send({success:false},error.message);
    }
}
const verifyMail = async(req,res,next)=>{
    try {
        const id = req.query.user_id;
        const tokenData = await ServiceProvider.findOne({_id:id});
        const updateinfo = await ServiceProvider.findByIdAndUpdate({_id:tokenData._id},{$set:{is_varified:1}},{new:true});
        res.status(201).json({
            success:true,
            data:updateinfo,
            message: "Email verified"
        });
    } catch (error) {
        console.log(error.message);
        res.status(400).send({success:false},error.message);
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
                if(userData.is_varified === 0){
                    res.status(200).send({success:false,msg:"please verify your Email"});
                }
                else{
                const tokenData = await createToken(userData._id);
                    res.status(201).json({
                        success:true,
                        message: "Signin successfully",
                        token:tokenData
                    });
                }
            }
            else{
                res.status(201).json({success:false,message: "password is incorrect"});
            }
        }
        else{
            res.status(200).send({success:false,message:"Signin details are incorrect"});
        }
    } catch (error) {
        res.status(400).send({success:false},error.message);
    }
}
// verfiy login 
const verfiyLogin = async(req,res,next) =>{
    try {
        res.setHeader('X-Foo', 'bar')
        res.status(200).send({success:true ,msg:"Authenticated"});
    } catch (error) {
        res.status(401).send({success:false},error.message);
    }
}
// signout
const logout = (req,res, next) =>{
    const id = req.userId;
    const data = ServiceProvider.findByIdAndUpdate({_id:id},{token:""},(err)=>{
        if(err) return res.status(400).send({success:false},err);
        res.status(200).send({success:true,msg:"You have been Logged Out"});
    });
    // const authHeader = req.headers["authorization"];
    // jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
    // if (logout) {
    //     res.send({msg : 'You have been Logged Out' });
    // } else {
    // res.send({msg:'Error'});
    // }
    // });
} 
// update password

const changepassword = async(req,res,next)=>
{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await ServiceProvider.findOne({email:email})
        const data = await ServiceProvider.findOne({_id:user._id})
            if(data)
            {
            const newpassword = securePassword(password);
            const userData = await ServiceProvider.findByIdAndUpdate(
                        {
                            _id:user._id
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
        res.status(400).send({success:false},error.message);
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
            sendMail.sendSPResetPasswordMail(userData.email,randomString);
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
    const email = req.body.email
        try {
            const userData = await ServiceProvider.findOne({email:email})
            const user = await ServiceProvider.findById({_id:userData._id})
            return res.status(200).json({success:true},user)
        } 
        catch (error) {
            return res.status(400).json({success:false},'user email is required');
    }

}
const editUserProfile = async(req,res,next)=>{
    const email = req.body.email
    try {
        const user = await ServiceProvider.findOne({email:email})
        const userData = await ServiceProvider.findById({_id:user._id})
        if(userData){
            const data = await ServiceProvider.findByIdAndUpdate({_id:user._id},{$set:req.body})
            res.status(200).json({success:true},"user profile has been updated");
        }
        else{
            res.status(500).json({success:false},err)
        }
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}

const deleteUserAccount = async(req,res,next)=>{
    const email = req.body.email;
    if(email){
        try {
            const userData = await ServiceProvider.findOne({email:email})
            const user = await ServiceProvider.findByIdAndDelete({_id:userData._id})
            res.status(200).send({success:true, msg:"Account has been deleted"});
        } catch (error) {
            res.status(400).send({success:false, msg:error.message});
        }

    }
    else{
        res.status(400).json({success:false},"your email not exit and can not delete your account")
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
//create post
// const createPost = async(req,res,next)=>{
//     try {
//         const category = req.body.category
//         const user = await ServiceProvider.findOne({category:category})

//         MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
//             var database = client.db("mydatabase");
//             database.collection(user.category).insertOne({
//             serviceName:user.serviceName,
//             postDetails:req.body.postDetails,
//             image:req.file.filename
//         }).then(post =>{
//             console.log(post);
//         })
//         })
//         res.status(200).send({success:true, message:"created post successful"});
        
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const spCreatePost = async(req,res,next)=>{
    try {
        // const id = req.session.serviceProvider_id
        const id = req.userId;
        console.log(id)
        const userData = await ServiceProvider.findById({_id:id})
        console.log(userData.category);
            const service = new Services({
                offerTitle:req.body.offerTitle,
                postDetails:req.body.postDetails,
                price:req.body.price,
                category:userData.category,
                serviceName:userData.serviceName,
                image:req.file.filename
            });
            const post = await service.save();
            if(post){
                res.status(200).send({success:true,data:post,msg:"your offer has been successfully posted"});
            }
            else{
                res.status(200).send({success:false,msg:"your offer has been failed"})
            }
        
    } catch (error) {
        console.log(error.message);
    }
}
// get services
const Hotel = async(req,res,next)=>{
    try {
        const users = await Services.find({category:"Hotel"});
        res.status(200).send({success:true, data:users});
        
    } catch (error) {
        console.log(error.message);
    }
}
const Cinema = async(req,res,next)=>{
    try {
        const users = await Services.find({category:"Cinema"});
        res.status(200).send({success:true, data:users});
    } catch (error) {
        console.log(error.message);
    }
}
const Bazaar = async(req,res,next)=>{
    try {
        const users = await Services.find({category:"Bazaar"});
        res.status(200).send({success:true, data:users});
    } catch (error) {
        console.log(error.message);
    }
}
const ResortAndVillage = async(req,res,next)=>{
    try {
        const users = await Services.find({category:"Resort & Village"});
        res.status(200).send({success:true, data:users});
    } catch (error) {
        console.log(error.message);
    }
}
const NaturalPreserves = async(req,res,next)=>{
    try {
        const users = await Services.find({category:"Natural Preserves"});
        res.status(200).send({success:true, data:users});
    } catch (error) {
        console.log(error.message);
    }
}
const TourismCompany = async(req,res,next)=>{
    try {
        const users = await Services.find({category:"Tourism Company"});
        res.status(200).send({success:true, data:users});
    } catch (error) {
        console.log(error.message);
    }
}
const ArchaeologicalSites = async(req,res,next)=>{
    try {
        const users = await Services.find({category:"Archaeological Sites"});
        res.status(200).send({success:true, data:users});
    } catch (error) {
        console.log(error.message);
    }
}
const RestaurantAndCafe = async(req,res,next)=>{
    try {
        const users = await Services.find({category:"Restaurant & Cafe"});
        res.status(200).send({success:true, data:users});
    } catch (error) {
        console.log(error.message);
    }
}
const TransportationCompany = async(req,res,next)=>{
    try {
        const users = await Services.find({category:"Transportation Company"});
        res.status(200).send({success:true, data:users});
    } catch (error) {
        console.log(error.message);
    }
}
//get sp profile for user
const getSP_forClient = async (req,res,next)=>{
    try {
        // const id = req.userId;
        // const userData = await ServiceProvider.findById({_id:id})
        // const category = userData.category;
        if ("Hotel"){
            const userData = await Services.findOne({category:"Hotel"});
            console.log(userData.serviceName);
            const data = await ServiceProvider.findOne({serviceName:userData.serviceName});
            console.log(data);
            res.status(200).send({success:true,Partner_Profile:data});
        }
        else if (" Cinema"){
            const userData = await Services.findOne({category:"Cinema"});
            console.log(userData.serviceName);
            const data = await ServiceProvider.findOne({serviceName:userData.serviceName});
            console.log(data);
            res.status(200).send({success:true,Partner_Profile:data});
        }
        else if ("Bazaar"){
            const userData = await Services.findOne({category:"Bazaar"});
            console.log(userData.serviceName);
            const data = await ServiceProvider.findOne({serviceName:userData.serviceName});
            console.log(data);
            res.status(200).send({success:true,Partner_Profile:data});
        }
        else if ("Resort & Village"){
            const userData = await Services.findOne({category:"Resort & Village"});
            console.log(userData.serviceName);
            const data = await ServiceProvider.findOne({serviceName:userData.serviceName});
            console.log(data);
            res.status(200).send({success:true,Partner_Profile:data});
        }
        else if ("Natural Preserve"){
            const userData = await Services.findOne({category:"Natural Preserve"});
            console.log(userData.serviceName);
            const data = await ServiceProvider.findOne({serviceName:userData.serviceName});
            console.log(data);
            res.status(200).send({success:true,Partner_Profile:data});
        }
        else if ("Tourism Company"){
            const userData = await Services.findOne({category:"Tourism Company"});
            console.log(userData.serviceName);
            const data = await ServiceProvider.findOne({serviceName:userData.serviceName});
            console.log(data);
            res.status(200).send({success:true,Partner_Profile:data});
        }
        else if ("Archaeological Site"){
            const userData = await Services.findOne({category:"Archaeological Site"});
            console.log(userData.serviceName);
            const data = await ServiceProvider.findOne({serviceName:userData.serviceName});
            console.log(data);
            res.status(200).send({success:true,Partner_Profile:data});
        }
        else if ("Restaurant & Cafe"){
            const userData = await Services.findOne({category:"Restaurant & Cafe"});
            console.log(userData.serviceName);
            const data = await ServiceProvider.findOne({serviceName:userData.serviceName});
            console.log(data);
            res.status(200).send({success:true,Partner_Profile:data});
        }
        else if ("Transportation Company"){
            const userData = await Services.findOne({category:"Transportation Company"});
            console.log(userData.serviceName);
            const data = await ServiceProvider.findOne({serviceName:userData.serviceName});
            console.log(data);
            res.status(200).send({success:true,Partner_Profile:data});
        }
        else{
            console.log("category not exit")
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    createNewUser,
    verifyMail,
    postSignin,
    verfiyLogin,
    logout,
    changepassword,
    forget_password,
    reset_password,
    getUserProfile,
    editUserProfile,
    deleteUserAccount,
    sendVerificationLink,
    spCreatePost,
    Hotel,
    Cinema,
    Bazaar,
    ResortAndVillage,
    NaturalPreserves,
    TourismCompany,
    ArchaeologicalSites,
    RestaurantAndCafe,
    TransportationCompany,
    getSP_forClient
}