const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: { type: String, Request: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'user', Request: true },
    postId: { type: mongoose.Types.ObjectId, ref: 'service', Request: true },
    reply: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    like: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    unlike: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    /* softDelete: { type: Boolean, default: false }, */
    commentType: {
        type: String, default: "comment", enum: ["comment", "reply"]
    }
}, {
    timestamps: true
})
//mongoose.model.commentModel ||
module.exports = mongoose.model("Comment", commentSchema)


