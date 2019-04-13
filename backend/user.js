const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const config = require("../config");
const { parseBearer, encodeBearer } = require("../helper/bearer");
const {
  validateEmail,
  validatePassword,
  validateInteger
} = require("../helper/general");

const register = (email, password) => {
  return new Promise((resolve, reject) => {
    // Reject empty email and password
    if (!(email && password)) {
      return reject("Email or Password cannot be empty.");
    }

    // Validate email format
    const validEmail = validateEmail(email);
    if (!validEmail) {
      return reject("Email address is invalid.");
    }

    // Validate password length
    const validPassword = validatePassword(password);
    if (!validPassword) {
      return reject("Please enter at least 6 characters for your password");
    }

    // Hash user password
    const hashedPassword = bcrypt.hashSync(password, 8);
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return reject("An error has occured: ", err);
      }
      if (user) {
        return reject(
          "This email has been taken, please use a different email."
        );
      } else {
        User.create(
          {
            email: email,
            password: hashedPassword,
            integer: 0
          },
          (err, user) => {
            if (err) {
              return reject("Error:", err);
            }
            return resolve(user);
          }
        );
      }
    });
  });
};

const authenticate = (email, password) => {
  return new Promise((resolve, reject) => {
    if (!(email && password)) {
      return reject("Please enter email and password");
    }

    // Validate email format
    const validEmail = validateEmail(email);
    if (!validEmail) {
      return reject("Email format incorrect");
    }

    // Find user in db with email
    User.findOne({ email }, (err, user) => {
      if (err) {
        return reject("Error: ", err);
      }
      if (!user) {
        return reject("User with this email is not found!");
      } else {
        const passwordValid = bcrypt.compareSync(password, user.password);
        if (!passwordValid) {
          return reject("password incorrect");
        }
        let token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400
        });
        token = encodeBearer(token);
        return resolve({ auth: true, Authorization: token });
      }
    });
  });
};

const incrementInteger = token => {
  return new Promise((resolve, reject) => {
    const bearer = parseBearer(token);
    if (!bearer) {
      return reject("Unable to parse token.");
    }
    jwt.verify(bearer, config.secret, (err, decoded) => {
      if (err) {
        return reject("Unable to decode token");
      } else {
        const userId = decoded.id;
        User.findOneAndUpdate(
          { _id: userId },
          { $inc: { integer: 1 } },
          { new: true },
          (err, response) => {
            if (err) {
              return reject(err);
            } else {
              return resolve(response);
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
    if (!bearer) {
      return reject("Unable to parse token.");
    }
    jwt.verify(bearer, config.secret, (err, decoded) => {
      if (err) {
        return reject("Unable to decode");
      } else {
        const userId = decoded.id;
        User.findOne({ _id: userId }, (err, data) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(data);
          }
        });
      }
    });
  });
};

const resetInteger = (token, int) => {
  return new Promise((resolve, reject) => {
    const bearer = parseBearer(token);
    if (!bearer) {
      return reject("Unable to parse token.");
    }
    const validInteger = validateInteger(int);
    if (!validInteger) {
      return reject("Please enter a positive integer!");
    }
    jwt.verify(bearer, config.secret, (err, decoded) => {
      if (err) {
        return reject("Unable to decode");
      } else {
        console.log(decoded);
        const userId = decoded.id;
        User.findOneAndUpdate(
          { _id: userId },
          { $set: { integer: int } },
          { new: true },
          (err, data) => {
            if (err) {
              return reject(err);
            } else {
              return resolve(data);
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
