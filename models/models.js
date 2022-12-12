const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then(({ rows }) => rows )
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
    WHERE article_id = $1`, [id]).then(({ rows }) => {
        return rows
    })
}