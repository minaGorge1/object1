const express = require('express')
const router = require('express').Router();
const multer = require("multer");
const path = require('path');


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/userImages"));
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname + '-' + Date.now()) 
        
    }
})
const upload = multer({storage:storage});


const spController = require('../controller/spController');
const {
    signupValidator,
    loginValidator,
} = require('../utils/validators/authSPValidator');
const auth = require("../middlewares/auth");

router.post("/SPsignup",signupValidator,spController.createNewUser);
router.get("/SPverify",spController.verifyMail);
router.post("/SPsignin",loginValidator,spController.postSignin);
router.put("/SPlogout",spController.logout);
router.post("/SPupdatePassword",spController.changepassword);
router.post("/SPforgetPassword",spController.forget_password);
router.post("/SPresetPassword",spController.reset_password);
router.get("/SPProfile",auth,spController.getUserProfile);
router.put("/updateSPProfile",spController.editUserProfile);
router.delete("/SPdelete",spController.deleteUserAccount);
router.post("/SPemailVerification",spController.sendVerificationLink);
router.post("/createPost",auth,upload.single('image'),spController.spCreatePost);
router.get("/hotel",spController.Hotel);
router.get("/cinema",spController.Cinema);
router.get("/bazaar",spController.Bazaar);
router.get("/resortAndVillage",spController.ResortAndVillage);
router.get("/naturalPreserves",spController.NaturalPreserves);
router.get("/tourismCompany",spController.TourismCompany);
router.get("/archaeologicalSites",spController.ArchaeologicalSites);
router.get("/restaurantAndCafe",spController.RestaurantAndCafe);
router.get("/transportationCompany",spController.TransportationCompany);
router.get("/profile",auth,spController.getSP_forClient);
router.post("/searchFast/:letter",spController.searchFast);




module.exports = router;


