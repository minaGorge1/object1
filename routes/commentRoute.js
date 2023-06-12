const router = require('express').Router();
const commentController = require('../controller/commentController.js');
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validation.js");
const validators = require("../utils/validators/Validatiors.js");

//comments
router.get("/:postId/comments",
    commentController.comments)

//createComment
router.post("/:postId/comment",validation.validation(validators.createComment),
    /* auth, */
    commentController.createComment)

//replyComment
router.post("/:postId/comment/:commentId/reply",validation.validation(validators.replyComment),
    /* auth, */
    commentController.replyComment)

//updateComment
router.put("/comment/:commentId/update",validation.validation(validators.updateComment),
    /* auth, */
    commentController.updateComment)

//deletePost
router.delete("/comment/:commentId/delete",validation.validation(validators.deleteComment),
    /* auth, */
    commentController.deleteComment)

//like 
router.patch("/comment/:commentId/like",validation.validation(validators.likeOrDislikeComment),
    /* auth, */
    commentController.likeComment)

//unlike 
router.patch("/comment/:commentId/unlike",validation.validation(validators.likeOrDislikeComment),
    /* auth, */
    commentController.unlikeComment)

module.exports = router;