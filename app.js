const express = require("express");
const { getTopics } = require("./controllers/controllers");
const { handle500Error, handleInvalidPath, getArticleById } = require("./controllers/errors.controllers");

const app = express();

app.get("/api/topics", getTopics);

// app.get("api/articles/:article_id", getArticleById)

app.all("*", handleInvalidPath);
app.use(handle500Error);

module.exports = app;