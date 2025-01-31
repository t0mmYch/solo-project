const articlesRouter = require("express").Router()
const {
  getArticles,
  getArticleById,
  patchedArticleVotes,
  getCommentForGivenArticle,
  postedCommentForGivenArticle
} = require("../controller")

articlesRouter.route("/")
  .get(getArticles)

articlesRouter.route("/:article_id")
  .get(getArticleById)
  .patch(patchedArticleVotes)

articlesRouter.route("/:article_id/comments")
  .get(getCommentForGivenArticle)
  .post(postedCommentForGivenArticle)

module.exports = articlesRouter