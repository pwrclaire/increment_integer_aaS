const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const db = require("./db");
db.connect();

app.use(function(req, res, next) {
  console.log("appjs app use");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  if ("OPTIONS" === req.method) {
    res.send(200);
  } else {
    next();
  }
});

const userApi = require("./router/api");
app.use("/api/user", userApi);

module.exports = app;
