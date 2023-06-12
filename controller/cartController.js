
const cartModel = require("../models/cartModel.js");
const Services = require("../models/serviceModel");

const addToCart = async (req, res, next) => {
    const { serviceId, createdBy } = req.body
    const service = await Services.findById(serviceId)
    if (!service) {
        return res.status(404).send({ success: false, message: "In-valid ID" });
    }
    // check cart exist
    const cart = await cartModel.findOne({ createdBy: createdBy }) // id from token
    if (!cart) {
        //create cart firstTime
        const newCart = await cartModel.create({
            createdBy: createdBy, //id from token
            services: [{ serviceId }]
        })
        return res.status(201).json({ message: "Done", cart: newCart })
    }
    // update cart item
    let matchServices = false
    for (let i = 0; i < cart.services.length; i++) {
        if (cart.services[i].serviceId.toString() == serviceId) {
            matchServices = true
            break;
        }
    }
    // or push to cart

    if(!matchServices) {
        cart.services.push({serviceId})
    }
    await cart.save()
    return res.status(200).json({ message: "Done", cart })

}

const clearCart = async (req, res, next) => {
    const { createdBy } = req.body
    await cartModel.updateOne({ createdBy: createdBy }, { services: [] })
    return res.status(200).json({ message: "Done" })
}





module.exports = {
    addToCart,
    clearCart
}