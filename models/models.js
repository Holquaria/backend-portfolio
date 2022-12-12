const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then(({ rows }) => rows )
}



exports.selectArticleById = () => {
    return db.query(`SELECT * FROM articles`).then(({ rows }) => rows )
}