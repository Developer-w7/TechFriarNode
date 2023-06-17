var express = require("express");
var app = express();

var authRouter = require("./auth");
var fileRouter = require("./file");


app.use("/auth", authRouter);
app.use("/file", fileRouter);

module.exports = app;