const mongoose = require("mongoose");
let connect = () => {
  mongoose.connect(
    "mongodb://pwrclaire:thinkific123@ds237196.mlab.com:37196/thinkific",
    { useNewUrlParser: true }
  );
  console.log("Mongoose connection status: ", mongoose.connection.readyState);
};

module.exports = {
  connect
} 