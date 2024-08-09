const mongoose = require("mongoose");
//const { boolean } = require("webidl-conversions");

const User = mongoose.model("User", {
  email: String,
  account: { username: String, avatar: Object },
  //password: String,
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
