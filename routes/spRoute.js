
const express = require('express')
const router = require('express').Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const bcrypt = require('bcrypt');


const spController = require('../controller/spController');
const {
    signupValidator,
    loginValidator,
} = require('../utils/validators/authSPValidator');

router.post("/SPsignup",signupValidator,spController.createNewUser);
router.get("/verify",spController.verifyMail);
router.post("/SPsignin",loginValidator,spController.postSignin);
router.put("/SPlogout",spController.logout);
router.post("/SPupdatePassword",spController.changepassword);
router.post("/SPforgetPassword",spController.forget_password);
router.post("/SPresetPassword",spController.reset_password);
router.get("/SP/:id",spController.getUserProfile);
router.put("/SP/:id",spController.editUserProfile);
router.delete("/SP/:id/delete",spController.deleteUserAccount);


module.exports = router;


