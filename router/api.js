const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const user = require("../backend/user");
const config = require("../config");
const { parseBearer } = require("../helper/bearer");

const AUTHORIZATION = "authorization";

router.get("/", (req, res) => {
  res.send("Able to connect API");
});

router.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // register user
  user
    .register(email, password)
    .then(user => {
      res.status(200).send({ message: "Registration successful"});
    })
    .catch(err => {
      res.status(404).send(err);
    });
});


router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  user
    .authenticate(email, password)
    .then(auth => {
      // receiving {auth: true, token}
      console.log("Token: ", auth);
      res.status(200).send(auth);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

router.use(function(req, res, next) {
  const token = req.headers[AUTHORIZATION];
  // decode token
  if (token) {
    const bearer = parseBearer(token);
    console.log("Bearer: ", bearer);
    if (!bearer) {
       res.status(403).send({
        success: false,
        message: "No token provided."
      });
    }
    // verifies secret and checks exp
    jwt.verify(bearer, config.secret, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // return error if token does not exist
    res.status(400).send("There is no token");
  }
});

router.get("/protected", (req, res) => {
  // test token with protected route
  res.send("Everything after this IS PROTECTED");
});

router.get("/next", (req, res) => {
  const token = req.headers[AUTHORIZATION];
  // Increment integer by one
  user
    .incrementInteger(token)
    .then(data => res.status(200).send({ integer: data.integer }))
    .catch(err => res.status(404).send(err));
});

router.get("/current", (req, res) => {
  const token = req.headers[AUTHORIZATION];
  console.log("get/current token:", token);

  // retrieve current integer
  user
    .getCurrentInteger(token)
    .then(data => res.status(200).send({ integer: data.integer }))
    .catch(err => res.status(404).send(err));
});

router.put("/current", (req, res) => {
  const newInt = req.body.current;
  const token = req.headers[AUTHORIZATION];

  // reset current integer
  user
    .resetInteger(token, newInt)
    .then(data => res.status(200).send({ integer: data.integer}))
    .catch(err => res.status(404).send(err));
});

module.exports = router;
