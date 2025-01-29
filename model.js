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


  exports.selectCommentByArticleId = (article_id) =>{
    return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article Not Found"
        });
      }
      
      return db.query(
        `SELECT comment_id, votes, created_at, author, body,article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`,
        [article_id]
      );
    })
    .then(({ rows }) => rows);
};

////// 7_POST /api/articles/:article_id/comments
exports.addedCommentForGivenArticle = (article_id, username, body) => {
  return db
 .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
 .then(({ rows }) => {
   if (rows.length === 0) {
     return Promise.reject({
       status: 404,
       msg: "Article Not Found"
     });
   }
   return db.query('SELECT * FROM users WHERE username = $1;', [username]);
 })
 .then(({ rows }) => {
   if (rows.length === 0) {
     return Promise.reject({
       status: 404,
       msg: "User Not Found"
     });
   }
   return db.query(
     `INSERT INTO comments (body, article_id, author, votes)
      VALUES ($1, $2, $3, 0)
      RETURNING *;`,
     [body, article_id, username]
   );
 })
 .then(({ rows }) => rows[0])
};