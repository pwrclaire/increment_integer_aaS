const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
// backend function
const user = require("../backend/user");
const config = require("../config");
const { parseBearer } = require("../helper/bearer");
const jwt = require("jsonwebtoken");

const AUTHORIZATION = "authorization";

router.get("/", (req, res) => {
  res.send("Able to connect api");
});

router.post("/register", (req, res) => {
  console.log("calling function");
  const email = req.body.email;
  const password = req.body.password;
  console.log({ email, password });
  user
    .register(email, password)
    .then(user => {
      console.log("API /register: ", user);
      const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400
      });
      res.status(200).send({ auth: true, Authorization: token });
    })
    .catch(err => {
      res.status(404).send(err);
    });
});

router.post("/login", (req, res) => {
  console.log("logging..in...");
  const email = req.body.email;
  const password = req.body.password;
  console.log("email: ", email, "pw: ", password);
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
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers[AUTHORIZATION];
  console.log("body.toekn", req.body.token);
  console.log("query.token", req.query.token);
  console.log("req.header authorization", req.headers[AUTHORIZATION]);
  console.log("req.header x-access", req.headers["x-access-token"]);
  console.log("req.header", req.headers);

  // decode token
  if (token) {
    const bearer = parseBearer(token);
    console.log("Bearer: ", bearer);
    if (!bearer) {
      return;
      //  res.status(403).send({
      //   success: false,
      //   message: "No token provided."
      // });
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
    // if there is no token
    // return an error
    console.log("FAILLLLLL");
    res.status(400).send("There is no token");
  }
});

router.get("/protected", (req, res) => {
  res.send("Everything after this IS PROTECTED");
});

router.get("/next", (req, res) => {
  const token = req.body.token || req.query.token || req.headers[AUTHORIZATION];
  // Increment integer by one
  user
    .incrementInteger(token)
    .then(() => res.status(200).send("Incremented!"))
    .catch(err => res.status(404).send(err));
});

router.get("/current", (req, res) => {
  const token = req.body.token || req.query.token || req.headers[AUTHORIZATION];
  console.log("get/current token:", token);

  // Increment integer by one
  user
    .getCurrentInteger(token)
    .then(data => res.status(200).send({ integer: data.integer }))
    .catch(err => res.status(404).send(err));
});

router.put("/current", (req, res) => {
  const newInt = req.body.int;
  const token = req.body.token || req.query.token || req.headers[AUTHORIZATION];

  // Increment integer by one
  user
    .resetInteger(token, newInt)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(err));
});

module.exports = router;
