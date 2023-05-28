const mongoose = require("mongoose");

const paySchema = mongoose.Schema({
    image:{
        type:String,
        required:true  
    }
});
module.exports = mongoose.model("pay",paySchema);

