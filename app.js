const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getEndPoints, getTopics, getArticleById, getArticles, getCommentForGivenArticle, postedCommentForGivenArticle } = require("./controller");


app.use(express.json());

app.get("/api", getEndPoints)
app.get("/api/topics" , getTopics)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getCommentForGivenArticle)
app.post("/api/articles/:article_id/comments", postedCommentForGivenArticle)



 

  app.all("*", (req, res) => {
    res.status(404).send({ msg: "Path Not Found" })
  })
  
 
  app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg })
    } else {
      next(err)
    }
  })
  
  app.use((err, req, res, next) => {
    if(err.code === "22P02"){
        res.status(400).send({ msg: 'Bad Request'})
    }
     else {
      next(err)
  }});

  app.use((err, req, res, next) => {
    console.log(err) 
    res.status(500).send({ msg: "Internal Server Error" }) 
  });
  
module.exports = app