// Backend functions for manipulating data and stuff
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const config = require("../config");
const { parseBearer, encodeBearer } = require("../helper/bearer");

const register = (email, password) => {
  return new Promise((resolve, reject) => {
    if (!(email && password)) {
      reject("email and pw cannot be empty");
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        reject("An error has occured: ", err);
        return;
      }
      if (user) {
        console.log("SHould break..same email used");
        reject("This email has been taken, please use a different email.");
        return;
      } else {
        User.create(
          {
            email: email,
            password: hashedPassword,
            integer: 0
          },
          (err, user) => {
            if (err) {
              reject("Error:", err);
              return;
            }
            console.log("Register function: user: ", user);
            resolve(user);
          }
        );
      }
    })
  });
};

const authenticate = (email, password) => {
  return new Promise((resolve, reject) => {
    if (!(email && password)) {
      reject("Please enter email and password");
      return;
    }
    User.findOne({ email }, (err, user) => {
      if (err) {
        reject("Error: ", err);
        return;
      }
      if (!user) {
        reject("User with this email is not found!");
        return;
      } else {
        const passwordValid = bcrypt.compareSync(password, user.password);
        if (!passwordValid) {
          reject("password incorrect");
          return;
        }
        let token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400
        });
        token = encodeBearer(token);
        resolve({ auth: true, Authorization: token });
      }
    });
  });
};

const incrementInteger = token => {
  return new Promise((resolve, reject) => {
    // Given a token, must decrypt and parse user id and stuff
    const bearer = parseBearer(token);
    jwt.verify(bearer, config.secret, (err, decoded) => {
      if (err) {
        reject("Unable to decode");
        return;
      } else {
        console.log("backend-function: increment**** decoded", decoded);
        const userId = decoded.id;
        return User.findOneAndUpdate(
          { _id: userId },
          { $inc: { integer: 1 } },
          { new: true },
          (err, response) => {
            if (err) {
              reject(err);
              return;
            } else {
              resolve(response);
            }
          }
        );
      }
    });
  });
};

const getCurrentInteger = token => {
  return new Promise((resolve, reject) => {
    const bearer = parseBearer(token);
    console.log("backnend-function getCurrentInteger**** bearer", bearer);
    jwt.verify(bearer, config.secret, (err, decoded) => {
      if (err) {
        reject("Unable to decode");
        return;
      } else {
        console.log("Backed-function getcurrentInteger***** got jwt", decoded);
        const userId = decoded.id;
        return User.findOne({ _id: userId }, (err, data) => {
          if (err) {
            reject(err);
            return;
          } else {
            console.log("backend-user-function**** data:", data);
            resolve(data);
          }
        });
      }
    });
  });
};

const resetInteger = (token, int) => {
  return new Promise((resolve, reject) => {
    const bearer = parseBearer(token);
    jwt.verify(bearer, config.secret, (err, decoded) => {
      if (err) {
        reject("Unable to decode");
        return;
      } else {
        console.log(decoded);
        const userId = decoded.id;
        return User.findOneAndUpdate(
          { _id: userId },
          {
            $set: { integer: int }
          },
          (err, data) => {
            if (err) {
              reject(err);
              return;
            } else {
              resolve(data);
            }
          }
        );
      }
    });
  });
};

module.exports = {
  register,
  authenticate,
  incrementInteger,
  getCurrentInteger,
  resetInteger
};
