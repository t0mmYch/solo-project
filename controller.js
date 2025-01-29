const  endpoints  = require("./endpoints.json");
const { selectTopics, selectArticleById, selectArticles, selectCommentByArticleId, addedCommentForGivenArticle} = require("../be-nc-news/model");

exports.getEndPoints = (req, res, next) => {
  //  console.log(endpoints);
    
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
        next(err)
});
}

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next)
};



exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) =>{
      res.status(200).send({ articles });
    })
    .catch(next)
};

exports.getCommentForGivenArticle = (req, res, next) => {
    const { article_id } = req.params
    selectCommentByArticleId(article_id)
    .then((comments)=>{
        res.status(200).send({ comments });
    })
    .catch(next)
}

////// 7_POST /api/articles/:article_id/comments
exports.postedCommentForGivenArticle = (req, res, next) => {
    const { username, body } = req.body
    const { article_id } = req.params
    if (!username || !body){
      res.status(400).send({ msg: "Bad Request" })
      return
    }
    addedCommentForGivenArticle(article_id, username, body)
      .then((comment)=>{
     res.status(200).send({ comment })
      })
   .catch(next)
  };