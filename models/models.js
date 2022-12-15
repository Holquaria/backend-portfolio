const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then(({ rows }) => rows )
}




exports.selectArticleById = (id) => {
    return db.query(
    `SELECT * FROM articles
    WHERE article_id = $1`, [id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'article id not found'})
        }
       return rows[0]} )
}

exports.selectArticles = () => {
    return db.query(`
    SELECT DISTINCT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT (comments.article_id) AS comment_count FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.author, articles.title, articles.article_id, articles.created_at, articles.votes, comments.article_id
    ORDER BY articles.created_at DESC`).then(({ rows }) => rows)
}

exports.selectCommentsByArticle = (id) => {
    return db.query(`
    SELECT author, comment_id, created_at, votes, body FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`, [id]).then(({ rows }) => {
        return rows
    })
}

exports.checkArticleExists = (id) => {
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1`, [id])
    .then(({ rowCount }) => {
        if (rowCount === 0) {
            return Promise.reject({ status: 404, msg: 'article id not found'})
        } else {
            return true
        }
    })
}

exports.insertCommentIntoArticle = (id, comment) => {
    const { username, body } = comment
    return db.query(`
    INSERT INTO comments 
    (author, body, article_id) 
    VALUES
    ($1, $2, $3)
    RETURNING *`, [username, body, id])
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then(({ rows }) => rows)
}

exports.updateArticle = (id, votes) => {
    const { inc_votes } = votes
    return db.query(`
    UPDATE articles
    SET
    votes = votes + $1
    WHERE article_id = $2
    RETURNING *`, [inc_votes, id])
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