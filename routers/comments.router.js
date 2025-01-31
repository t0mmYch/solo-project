const commentsRouter = require("express").Router()
const { deleteCommentByCommentId } = require("../controller")

commentsRouter.delete("/:comment_id", deleteCommentByCommentId)

module.exports = commentsRouter