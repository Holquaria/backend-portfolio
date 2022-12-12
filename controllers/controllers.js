const { selectTopics, selectArticleById } = require('../models/models')


exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({ topics })
    }).catch((err) => {
        next(err)
    })
}


exports.getArticleById = (req, res, next) => {
    selectArticleById().then((article) => {
        res.status(200).send({ article })
    })
}