const router = require('express').Router();
const couponController = require('../controller/couponController.js');
const validation = require("../middlewares/validation.js");
const validators = require("../utils/validators/Validatiors.js");

router.get("/",couponController.list);
router.post("/createCoupon",validation.validation(validators.createCoupon),couponController.createCoupon);
router.put("/updateCoupon/:couponId",validation.validation(validators.updateCoupon),couponController.updateCoupon);
router.delete("/deleteCoupon/:couponId",validation.validation(validators.deleteCoupon),couponController.deleteCoupon);

module.exports = router;
