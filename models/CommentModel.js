const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: { type: String, Request: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', Request: true },
    postId: { type: Schema.Types.ObjectId, ref: 'service', Request: true },
    reply: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    like: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    unlike: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    softDelete: { type: Boolean, default: false },
    commentType: {
        type: String, default: "comment", enum: ["comment", "reply"]
    }
}, {
    timestamps: true
})
//mongoose.model.commentModel ||
module.exports =  mongoose.models.Comment || model("Comment", commentSchema)


