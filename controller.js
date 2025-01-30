const endpoints = require("./endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectCommentByArticleId,
  addedCommentForGivenArticle,
  patchedArticleVotesById,
  deleteCommentByGivenId,
  getUsersFromDatabase,
  articlesByTopic,
} = require("../be-nc-news/model");

exports.getEndPoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentForGivenArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

////// 7_POST /api/articles/:article_id/comments
exports.postedCommentForGivenArticle = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  if (!username || !body) {
    res.status(400).send({ msg: "Bad Request" });
    return;
  }
  addedCommentForGivenArticle(article_id, username, body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

////// 8_PATCH /api/articles/:article_id
exports.patchedArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (typeof inc_votes !== "number") {
    res
      .status(400)
      .send({ msg: "Bad Request >>> inc_votes has to be a number" });
    return;
  }
  patchedArticleVotesById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

////// 9_DELETE /api/comments/:comment_id
exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentByGivenId(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

////// 10_GET_/api/users
exports.getUsersF = (req, res, next) => {
  getUsersFromDatabase()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
