const express = require("express");
const { getTopics } = require("./controllers/controllers");
const { handle500Error } = require("./controllers/errors.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.use(handle500Error);

module.exports = app;
