const db = require("../db/connection");
const fs = require("fs/promises")

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => rows);
};

exports.selectArticleById = (id) => {
    let queryString = `
    SELECT DISTINCT articles.author, title, articles.article_id, topic, articles.body, articles.created_at, articles.votes, COUNT (comments.article_id) AS comment_count FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.author, articles.title, articles.article_id, articles.created_at, articles.votes, comments.article_id
    ORDER BY articles.created_at DESC`
    
    return db.query(
    queryString, [id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'article id not found'})
        }
       return rows[0]} )
}

exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
  const validSortQueries = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
  ];
  const validOrderQueries = ["asc", "desc"];

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  let queryString = `
    SELECT DISTINCT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT (comments.article_id) AS comment_count FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
     `;

  const queryValues = [];
  if (topic !== undefined) {
    queryString += ` WHERE topic = $1`;
    queryValues.push(topic);
  }

  queryString += `
    GROUP BY articles.author, articles.title, articles.article_id, articles.created_at, articles.votes, comments.article_id
    ORDER BY articles.${sort_by} ${order}`;

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.checkTopicExists = (topic) => {
    if (topic !== undefined) {
    return db
    .query(
      `
    SELECT * FROM topics
    WHERE slug = $1`,
      [topic]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "topic not found" });
      } else {
        return true;
      }
    });
} else return true
}

exports.selectCommentsByArticle = (id) => {
  return db
    .query(
      `
    SELECT author, comment_id, created_at, votes, body FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkArticleExists = (id) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1`,
      [id]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "article id not found" });
      } else {
        return true;
      }
    });
};

exports.insertCommentIntoArticle = (id, comment) => {
  const { username, body } = comment;
  return db
    .query(
      `
    INSERT INTO comments 
    (author, body, article_id) 
    VALUES
    ($1, $2, $3)
    RETURNING *`,
      [username, body, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then(({ rows }) => rows)
}

exports.updateArticle = (id, votes) => {
  const { inc_votes } = votes;
  return db
    .query(
      `
    UPDATE articles
    SET
    votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.removeCommentById = (id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1`, [id])
    .then(({ rowCount }) => {
        if (rowCount !== 1) {
            return Promise.reject({status: 404, msg: 'comment not found'})
        }
        return rowCount
    })
}

exports.selectAllEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8")
}

