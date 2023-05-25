const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
    offerTitle:{
        type:String,
        required:true
    },
    postDetails:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    serviceName:{
        type:String,
        ref:"serviceProvider"
    },
    category:{
        type:String,
        required:true,
        // enum:["Hotel","Cinema","Bazaar","Resort & Village","Natural Preserve","Tourism Company","Archaeological Site","Restaurant & Cafe","Transportation Company"]
    }
    
});

module.exports= mongoose.model("service",serviceSchema);