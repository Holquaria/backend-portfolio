const express = require("express");

const {
  handle500Error,
  handleInvalidPath,
  handleAbsentId,
  handleInvalidId,
  handleInvalidBody,
  handleAbsentUsername
} = require("./controllers/errors.controllers");
const apiRouter = require('./routes/api-router')


const app = express();

app.use(express.json())

app.use('/api', apiRouter)


app.use(handleAbsentUsername)
app.use(handleInvalidBody)
app.use(handleInvalidId);
app.use(handleAbsentId);
app.all("*", handleInvalidPath);
app.use(handle500Error);

module.exports = app;
