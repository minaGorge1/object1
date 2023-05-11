
const mongoose = require("mongoose");

const serviceProviderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    serviceName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    username:{
        type:String,
        required:true,
        unique: true, 
    },
    Address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:["Hotel","Cinema","Bazaar","Resort & Village","Natural Preserves","Tourism Company","Archaeological Sites","Restaurant & Cafe","Transportation Company"]
    },
    phoneNumber:{
        type:String,
    },
    is_varified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:""
    }
});

module.exports = mongoose.model("serviceProvider",serviceProviderSchema);
mongoose.set('strictQuery',false)

