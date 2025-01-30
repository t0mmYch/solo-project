const db = require("../be-nc-news/db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT slug, description FROM topics;`).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Path Not Found",
      });
    }
    return rows;
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
      return rows[0];
    });
};
// tweaked for Task 11 and 12
exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
    let queryStr = `
    SELECT 
      articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      CAST(COUNT(comments.comment_id) AS VARCHAR) AS comment_count
    FROM 
      articles
    LEFT JOIN 
      comments ON articles.article_id = comments.article_id `;

  const queryParams = [];

  if (topic) {
    return db
      .query('SELECT slug FROM topics WHERE slug = $1', [topic])
      .then(({ rows: topicRows }) => {
        if (topicRows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "Topic Not Found"
          });
        }
        queryStr += ` WHERE articles.topic = $1`;
        queryParams.push(topic);
        
        queryStr += `
          GROUP BY 
            articles.article_id
          ORDER BY 
            created_at DESC;
        `;

        return db.query(queryStr, queryParams);
      })
      .then(({ rows }) => rows);
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY 
      created_at DESC; `;

  return db.query(queryStr).then(({ rows }) => rows);
};



exports.selectCommentByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article Not Found",
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
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article Not Found",
        });
      }
      return db.query("SELECT * FROM users WHERE username = $1;", [username]);
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "User Not Found",
        });
      }
      return db.query(
        `INSERT INTO comments (body, article_id, author, votes)
      VALUES ($1, $2, $3, 0)
      RETURNING *;`,
        [body, article_id, username]
      );
    })
    .then(({ rows }) => rows[0]);
};

////// 8_PATCH /api/articles/:article_id
exports.patchedArticleVotesById = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article Not Found",
        });
      }
      return rows[0];
    });
};

////// 9_DELETE /api/comments/:comment_id
exports.deleteCommentByGivenId = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id  = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment Not Found",
        });
      }
      return rows[0];
    });
};

////// 10_GET_/api/users
exports.getUsersFromDatabase = () => {
  return db
    .query(`SELECT username, name, avatar_url FROM users;`)
    .then(({ rows }) => {
      return rows;
    });
};

