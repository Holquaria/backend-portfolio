const express = require("express");

const { getTopics, getArticles, getArticleById, getCommentsByArticle } = require("./controllers/controllers");
const { handle500Error, handleInvalidPath, handleAbsentId, handleInvalidId  } = require("./controllers/errors.controllers");


const app = express();

app.get("/api/topics", getTopics);
app.get('/api/articles', getArticles)


app.get('/api/articles/:article_id/comments', getCommentsByArticle)

app.get("/api/articles/:article_id", getArticleById)


app.use(handleInvalidId)
app.use(handleAbsentId)
app.all("*", handleInvalidPath);
app.use(handle500Error);

module.exports = app;