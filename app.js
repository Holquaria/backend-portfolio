const express = require("express");
const { getTopics, getArticles } = require("./controllers/controllers");
const { handle500Error, handleInvalidPath } = require("./controllers/errors.controllers");

const app = express();

app.get("/api/topics", getTopics);
app.get('/api/articles', getArticles)

app.all("*", handleInvalidPath);
app.use(handle500Error);

module.exports = app;