const db = require("../be-nc-news/db/connection");
//const articles = require("../be-nc-news/db/data/test-data/articles")
//const comments = require("../be-nc-news/db/data/test-data/comments")
//const topics = require("../be-nc-news/db/data/test-data/topics")
//const users = require("../be-nc-news/db/data/test-data/users")

exports.selectTopics = () => {
  return db.query(`SELECT slug, description FROM topics;`).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Path Not Found",
      })
    }
    return rows
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT  article_id, title, topic, author, body, created_at, votes, article_img_url
      FROM articles 
      WHERE article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article Not Found",
        });
      }
      return rows[0]
    });
};

exports.selectArticles = () => {
    return db
      .query(
        `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url,
        COUNT(comments.comment_id)
        ::INT AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
      )
      .then(({ rows }) => rows)
  };