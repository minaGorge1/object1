const router = require('express').Router();
const commentController = require('../controller/commentController.js');
const auth = require("../middlewares/auth");


//comments
router.get("/:postId/comments",
    commentController.comments)

//comment
router.post("/:postId/comment",
    /* auth, */
    commentController.createComment)

//replyComment
router.post("/:postId/comment/:commentId/reply",
    auth,
    commentController.replyComment)

//updateComment
router.put("/comment/:commentId/update",
    auth,
    commentController.updateComment)

//deletePost
router.delete("/comment/:commentId/delete",
    auth,
    commentController.deleteComment)

//softDeletePost
router.patch("/comment/:commentId/delete",
    auth,
    commentController.softDeleteComment)

//like 
router.patch("/comment/:commentId/like",
    auth,
    commentController.likeComment)

//unlike 
router.patch("/comment/:commentId/unlike",
    auth,
    commentController.unlikeComment)

