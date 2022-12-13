const { selectTopics, selectArticles, selectArticleById } = require('../models/models')

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


exports.getArticleById = (req, res, next) => {
    const id = req.params.article_id
    selectArticleById(id).then((article) => {
        res.status(200).send({ article })
    }).catch((err) => {
        next(err)
    })
}