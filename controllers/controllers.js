const { selectTopics, selectArticles, selectArticleById, selectCommentsByArticle, checkArticleExists } = require('../models/models')


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
    }).catch((err) => {
        next(err)
    })
}


exports.getCommentsByArticle = (req, res, next) => {
    const id = req.params.article_id
    Promise.all([checkArticleExists(id), selectCommentsByArticle(id)])
    .then(([err, comments]) => {
        res.status(200).send({ comments })
    }).catch((err) => {
        next(err)
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

