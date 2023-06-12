
const couponModel = require("../models/couponModel.js");
const orderModel = require("../models/orderModel.js");
const serviceModel = require("../models/serviceModel.js");

const createOrder = async (req, res, next) => {
    try {
        const { userId, services, phone, couponName, paymentType } = req.body
        if (couponName) {
            const coupon = await couponModel.findOne({ name: couponName, usedBy: userId, isDeleted: false })
            if (!coupon /* ||
                (parseInt(Date.now() / 1000) > parseInt((coupon?.expire?.getTime() / 1000))) */) {
                return res.status(400).send({ message: "in-valid coupon .." });
            }
            req.body.coupon = coupon
        }
        let sumTotal = 0;
        let finalServiceList = []
        for (let i = 0; i < services.length; i++) {
            const service = services[i];
            const checkedService = await serviceModel.findOne({
                _id: service.serviceId,
            })
            if (!checkedService) {
                return res.status(400).json({ message: `Fail  service ` });
            }
            service.name = checkedService.offerTitle
            finalServiceList.push(service)
            sumTotal += parseInt(checkedService.price)

        }
        const dummyOrder = {
            userId: userId,
            services: finalServiceList,
            couponId: req.body.coupon._id,
            finalPrice: Number.parseFloat(sumTotal - (sumTotal * ((req.body.coupon.amount || 0) / 100))).toFixed(2),
            phone,
            paymentType: paymentType
        }
        const order = await orderModel.create(dummyOrder)
        return res.status(201).json({ message: "Dona", order })
    } catch (error) {
        res.status(400).send({ success: false }, error.message);
    }

}

const cancelOrder = async (req, res, next) => {
    try {
        const { userId , orderId } = req.params
        const order = await orderModel.findOneAndDelete({_id:orderId ,userId:userId} )
        return res.status(201).json({ message: "Dona", order })
    } catch (error) {
        res.status(400).send({ success: false }, error.message);
    }
}





module.exports = {
    createOrder,
    cancelOrder
}