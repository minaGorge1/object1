
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    phoneNumber:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true
    },
    location:{
        type:String,
        default:"Fayoum"
    },
    is_admin:{
        type:Number,
        required:true
    },
    is_varified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:''
    },
    
});

module.exports = mongoose.model("user",userSchema);

mongoose.set('strictQuery',false)

