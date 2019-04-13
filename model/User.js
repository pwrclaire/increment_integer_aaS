const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  integer: Number
});
mongoose.model("User", UserSchema);

module.exports = mongoose.model("User");
