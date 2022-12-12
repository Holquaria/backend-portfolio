const { selectTopics, selectArticles, selectCommentsByArticle } = require('../models/models')


exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({ topics })
    }).catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({ articles })
    })
}

exports.getCommentsByArticle = (req, res, next) => {
    const id = req.params.article_id
    selectCommentsByArticle(id).then((comments) => {
        res.status(200).send({ comments })
    })
}
