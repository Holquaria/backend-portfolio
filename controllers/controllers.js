const {
  selectTopics,
  selectArticles,
  selectArticleById,
  selectCommentsByArticle,
  checkArticleExists,
  insertCommentIntoArticle,
  updateArticle,
  checkTopicExists
} = require("../models/models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
    const { topic, sort_by, order } = req.query
    Promise.all([checkTopicExists(topic), selectArticles(topic, sort_by, order)])
    .then(([err, articles]) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticle = (req, res, next) => {
  const id = req.params.article_id;
  Promise.all([checkArticleExists(id), selectCommentsByArticle(id)])
    .then(([err, comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentToArticle = (req, res, next) => {
  const id = req.params.article_id;
  Promise.all([checkArticleExists(id), insertCommentIntoArticle(id, req.body)])
    .then(([err, comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const id = req.params.article_id;
  Promise.all([checkArticleExists(id), updateArticle(id, req.body)])
    .then(([err, article]) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
