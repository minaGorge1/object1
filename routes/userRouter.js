const express = require('express')
const router = require('express').Router();
const bodyParser = require('body-parser');
const multer = require("multer");
const path = require('path');


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/payment"));
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname + '-' + Date.now()) 
        
    }
})
const upload = multer({storage:storage});

router.use(bodyParser.urlencoded({extended:true}))


const userController = require("../controller/userController");
const {
    signupValidator,
    loginValidator,
} = require('../utils/validators/authValidator');
const auth = require("../middlewares/auth");

router.post("/signup",signupValidator,userController.createNewUser);
router.get("/verify",userController.verifyMail);
router.post("/signin",loginValidator,userController.postSignin);
router.get("/signout",auth,userController.logout);
router.post("/updatePassword",userController.changepassword);
router.post("/forgetPassword",userController.forget_password);
router.post("/resetPassword",userController.reset_password);
router.get("/userProfile",userController.getUserProfile);
router.put("/updateUserProfile",userController.editUserProfile);
router.delete("/delete",userController.deleteUserAccount);
router.post("/emailVerification",userController.sendVerificationLink);
router.post("/pay",upload.single('image'),userController.postPayment);

module.exports = router;