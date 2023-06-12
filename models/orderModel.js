
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "user", required: false },
    services: [
        {
            serviceId: { type: mongoose.Types.ObjectId, ref: "service", required: true },
            finalPrice: { type: Number, default: 1 }
        }
    ],
    finalPrice: { type: Number, default: 1 },
    couponId: { type: mongoose.Types.ObjectId, ref: "coupon" },
    phone: String,
    paymentType: {
        type: String,
        default: "cash",
        enum: ["cash", "card"]
    },
   /*  isDeleted: { type: Boolean, default: false } */
}, {
    timestamps: true
})

module.exports = mongoose.model("order", orderSchema)


