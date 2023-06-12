
const commentModel = require("../models/CommentModel.js");
const serviceModel = require("../models/serviceModel.js");



//comments
const comments = async (req, res, next) => {
    try {
        const { postId } = req.params
        const commentList = await commentModel.find({ postId: postId }).populate([
            {
                path: 'reply',
                select: "text userId"
            }
        ])
        return res.status(201).json({ message: "Done", commentList })
    } catch (error) {
        res.status(400).send({ success: false }, error.message);
    }

}

//create Comment
const createComment = async (req, res, next) => {
    try {
        const post = await serviceModel.findById(req.params.postId)
        if (!post) {
            return res.status(404).send({ success: false, message: "In-valid ID" });
        }
        req.body.postId = post._id;
        /* req.body.userId = req.user._id */ //id user from token
        const comment = await commentModel.create(req.body)
        return res.status(201).json({ message: "Dona", comment })
    } catch (error) {
        res.status(400).send({ success: false }, error.message);
    }
}

//reply Comment
const replyComment = async (req, res, next) => {
    try {
        const { commentId, postId } = req.params
        const comment = await commentModel.findOne({ _id: commentId, postId: postId })
        if (!comment) {
            return res.status(404).send({ success: false, message: "In-valid ID" });
        }

        req.body.postId = postId;
        /* req.body.userId = req.user._id; */ // id from token mkan req.user._id
        req.body.commentType = "reply"
        const reply = await commentModel.create(req.body)
        comment.reply.push(reply._id)
        await comment.save()
        return res.status(201).json({ message: "Dona", comment })
    } catch (error) {
        res.status(400).send({ success: false }, error.message);
    }
}

//update Comment
const updateComment = async (req, res, next) => {
    try {
        const { commentId } = req.params
        const { text } = req.body

        const Comment = await commentModel.findById({ _id: commentId/* , createdBy: req.user._id */ })
        if (!Comment || Comment.softDelete) {
            return res.status(404).send({ success: false, message: "not found" });
        }
        if (!text || Comment.text == text) {
            return res.status(409).send({ success: false, message: "In-valid ID" });
        }
        Comment.text = text
        await Comment.save()
        return res.json({ message: "Done", Comment });
    } catch (error) {
        res.status(400).send({ success: false }, error.message);
    }
}

//delete Comment
const deleteComment = async (req, res, next) => {
    const { commentId } = req.params
    const comment = await commentModel.findByIdAndDelete({ _id: commentId })
    if (!comment || comment.softDelete) {
        return res.status(404).send({ success: false, message: "not found" });
    }
    return res.json({ message: "Done" });
}

//like
const likeComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body; //id user from token
        const comment = await commentModel.findByIdAndUpdate(
            commentId,
            {
                $addToSet: { like: userId },
                $pull: { unlike: userId }
            },
            { new: true }
        )
        comment.totalVote = comment.like.length - comment.unlike.length
        await comment.save()
        return res.status(201).json({ message: "Done", comment })
    } catch (error) {
        res.status(400).send({ success: false }, error.message);
    }
}

//unlike
const unlikeComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body; //id user from token
        //add To Set
        const comment = await commentModel.findByIdAndUpdate(
            commentId,
            {
                $addToSet: { unlike: userId },
                $pull: { like: userId }
            },
            { new: true }
        )
        comment.totalVote = comment.like.length - comment.unlike.length
        await comment.save()
        return res.status(201).json({ message: "Done", comment })
    } catch (error) {
        res.status(400).send({ success: false }, error.message);
    }
}
module.exports = {
    comments,
    createComment,
    replyComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment,
}

