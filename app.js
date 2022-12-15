const express = require("express");

const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentToArticle,
  getUsers,
  patchArticle,
  deleteCommentById
} = require("./controllers/controllers");
const {
  handle500Error,
  handleInvalidPath,
  handleAbsentId,
  handleInvalidId,
  handleInvalidBody,
  handleAbsentUsername
} = require("./controllers/errors.controllers");

const app = express();

app.use(express.json())

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticle);
app.get("/api/articles/:article_id", getArticleById);
app.post("/api/articles/:article_id/comments", postCommentToArticle);
app.get("/api/users", getUsers)
app.patch("/api/articles/:article_id", patchArticle)
app.delete("/api/comments/:comment_id", deleteCommentById)

app.use(handleAbsentUsername)
app.use(handleInvalidBody)
app.use(handleInvalidId);
app.use(handleAbsentId);
app.all("*", handleInvalidPath);
app.use(handle500Error);

module.exports = app;
