const joi = require('joi');
const valid = require("../../middlewares/validation.js");

const createCoupon = joi.object({
    name: joi.string().min(2).max(25).required(),
    amount: joi.number().positive().min(1).max(100).required(),
    expire: joi.date().required().greater(Date.now()),
    usedBy: valid.generalFields.id
}).required()

const updateCoupon = joi.object({
    couponId: valid.generalFields.id,
    name: joi.string().min(2).max(25).required(),
    amount: joi.number().positive().min(1).max(100).required(),
    expire: joi.date().greater(Date.now()),
}).required()

const deleteCoupon = joi.object({
    couponId: valid.generalFields.id.required(),
}).required()
//----------------------------------cart------------------------------------------------
const addToCart = joi.object({
    serviceId: valid.generalFields.id.required(),
    createdBy: valid.generalFields.id.required(),
}).required()

const clearCart = joi.object({
    createdBy: valid.generalFields.id.required(),
}).required()

//------------------------------------------------------------------------------------
//comment
const createComment = joi.object({
    text: joi.string().required(),
    postId: valid.generalFields.id,
}).required()


//replyComment
const replyComment = joi.object({
    text: joi.string().required(),
    postId: valid.generalFields.id,
    commentId: valid.generalFields.id,
})

//updateComment
const updateComment = joi.object({
    text: joi.string().required(),
    commentId: valid.generalFields.id,
})

//deleteComment
const deleteComment = joi.object({
    commentId: valid.generalFields.id,
})

const likeOrDislikeComment = joi.object({
    commentId: valid.generalFields.id
}).required()
//------------------------------------------order { userId, services, phone, couponName, paymentType }
const createOrder = joi.object({
    userId: valid.generalFields.id.required(),
    phone: joi.string().length(11).required(),
    paymentType: joi.string().valid("cash", "card"),
    couponName: joi.string().min(2).max(50),
    services: joi.array().items(
        joi.object({
            serviceId: valid.generalFields.id.required()
        }).required()
    )
}).required()

const cancelOrder = joi.object({
    userId: valid.generalFields.id.required(),
    orderId: valid.generalFields.id.required()
}).required()
//----------------------------------------------------
const numStars = joi.object({
    num: joi.string().max(5),
    serviceId: valid.generalFields.id.required(),
    userId: valid.generalFields.id.required()
}).required()

const showRiting = joi.object({
    serviceId: valid.generalFields.id.required()
}).required()


const showRitingByNum = joi.object({
    num: joi.string().max(5),
    serviceId: valid.generalFields.id.required()
}).required()

module.exports = {
    updateCoupon,
    createCoupon,
    deleteCoupon,
    addToCart,
    clearCart,
    createComment,
    replyComment,
    updateComment,
    deleteComment,
    likeOrDislikeComment,
    cancelOrder,
    createOrder,
    numStars,
    showRiting,
    showRitingByNum
}