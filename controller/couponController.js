const mongoose = require("mongoose");
const couponModel = require("../models/couponModel.js");


const list = async (req, res, next) => {
    const coupon = await couponModel.find({ isDeleted: false})
    res.json(coupon)
}

const createCoupon = async (req, res, next) => {
    try {
        if (await couponModel.findOne({ name: req.body.name })) {
            return res.status(409).json({ success: false, message: "Duplicated coupon name" });
        }
        const coupon = await couponModel.create(req.body)
        return res.status(201).json({ message: "Done", coupon })
    } catch (error) {
        res.status(400).send({ success: false }, error.message);
    }
}

const updateCoupon = async (req, res, next) => {
    try {
        const coupon = await couponModel.findById(req.params.couponId)

        if (await !coupon || coupon.isDeleted == true ) {
            return res.status(404).send({ success: false, message: "In-valid ID" });
        }

        // duplicated new Name
        if (req.body.name) {
            if (await couponModel.findOne({ name: req.body.name })) {
                return res.status(409).json({ success: false, message: "Duplicated coupon name" });
            }
            coupon.name = req.body.name
        }

        if (req.body.amount) {
            coupon.amount = req.body.amount
        }

        await coupon.save()
        return res.status(201).json({ message: "Done", coupon })
    } catch (error) {
        res.status(400).send({ success: false }, error.message);
    }
}


const deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await couponModel.findById(req.params.couponId)
        if (await !coupon || coupon.isDeleted == true ) {
            return res.status(404).send({ success: false, message: "In-valid ID" });
        }
        coupon.isDeleted = true
        await coupon.save()
        return res.status(201).json({ message: "Done", coupon })
    } catch (error) {
        res.status(400).send({ success: false }, error.message);
    }
}


module.exports = {
    list,
    createCoupon,
    updateCoupon,
    deleteCoupon
}