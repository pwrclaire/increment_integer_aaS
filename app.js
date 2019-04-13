const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const db = require("./db");
db.connect();

app.use((req, res, next) => {
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
