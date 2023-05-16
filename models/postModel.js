const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    postDetails:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
});

module.exports= mongoose.model("post",postSchema);