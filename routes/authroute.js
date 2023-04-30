
const express = require('express')
const router = require('express').Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const bcrypt = require('bcrypt');


const authController = require('../controller/authcontroller');
const {
    signupValidator,
    loginValidator,
} = require('../utils/validators/authValidator');

router.post("/signup",signupValidator, authController.postSignup);
router.get("/verfiy",authController.verifyMail);
router.post("/signin",loginValidator,authController.postSignin);
router.post("/forget-password",authController.Postforget_password);
router.post("/reset-password",authController.reset_password)
router.get("/:id",authController.getUserProfile);
router.post("/change_password",authController.changepassword);
router.put('/logout',authController.logout);


/*
router.post ("/forgotPassword",authController.forgotPassword)
router.post('/verifyResetCode',authController.verifyPassResetCode)
router.put('/resetPassword',authController.resetPassword)
*/

module.exports = router;


