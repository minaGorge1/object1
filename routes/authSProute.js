
const express = require('express')
const router = require('express').Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const bcrypt = require('bcrypt');


const authSPcontroller = require('../controller/authSPcontroller');
const {
    signupValidator,
    loginValidator,
} = require('../utils/validators/authSPValidator');

router.post("/SPsignup",signupValidator,authSPcontroller.PostSPsignup);
router.post("/SPsignin",loginValidator,authSPcontroller.PostSPsignin);
//router.get("/:id",authSPcontroller.getSPProfile);
router.post("/SPforget-password",authSPcontroller.Postforget_password);
router.put("/reset-password",authSPcontroller.reset_password)
router.post("/changePassword",authSPcontroller.changepassword)
router.put("/SPlogout",authSPcontroller.SPlogout);

module.exports = router;


