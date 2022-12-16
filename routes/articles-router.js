const articlesRouter = require('express').Router()
const {
    getArticles,
    getArticleById,
    getCommentsByArticle,
    postCommentToArticle,
    patchArticle,
  } = require("../controllers/controllers");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id/comments", getCommentsByArticle);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.post("/:article_id/comments", postCommentToArticle);
articlesRouter.patch("/:article_id", patchArticle)

module.exports = articlesRouter