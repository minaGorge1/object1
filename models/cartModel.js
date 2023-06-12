
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Types.ObjectId, ref: "user", required: false },
    services: [
        {
            serviceId: { type: mongoose.Types.ObjectId, ref: "service", required: true }
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model("cart", cartSchema)


