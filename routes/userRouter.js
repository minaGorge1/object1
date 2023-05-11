const express = require('express')
const router = require('express').Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:true}))


const userController = require("../controller/userController");
const {
    signupValidator,
    loginValidator,
} = require('../utils/validators/authValidator');

router.post("/signup",signupValidator,userController.createNewUser);
router.get("/verify",userController.verifyMail);
router.post("/signin",loginValidator,userController.postSignin);
router.put("/signout",userController.logout);
router.post("/updatePassword",userController.changepassword);
router.post("/forgetPassword",userController.forget_password);
router.post("/resetPassword",userController.reset_password);
router.get("/userProfile",userController.getUserProfile);
router.put("/updateUserProfile",userController.editUserProfile);
router.delete("/delete",userController.deleteUserAccount);
router.post("/verification",userController.sendVerificationLink);

module.exports = router;