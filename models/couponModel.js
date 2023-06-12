const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    name: { type: String, required: true , unique:true },
    amount: { type: Number, default: 1, required: true },
    expire : {type :Date , required: true},
    createdBy: { type: mongoose.Types.ObjectId, ref: "user", required: false },
    usedBy: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
})


module.exports =  mongoose.model("coupon",couponSchema);
