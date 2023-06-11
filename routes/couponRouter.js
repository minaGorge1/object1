const router = require('express').Router();
const couponController = require('../controller/couponController.js');


router.get("/",couponController.list);
router.post("/createCoupon",couponController.createCoupon);
router.put("/updateCoupon/:couponId",couponController.updateCoupon);
router.delete("/deleteCoupon/:couponId",couponController.deleteCoupon);

module.exports = router;
