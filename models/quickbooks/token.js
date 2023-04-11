//{"token":"kjhygJHKGHJG56576KJHJKHkmlvvgghgk", "refreshtoken":"kjhygJHKGHJG56576KJHJKHkmlvvgghgk","user":"usuario"}';

const mongoose = require("mongoose");

const TokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    trim: true,
  },
  refreshtoken: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: String,
    required: true,
    trim: true,
  }
});

const Token = mongoose.model("Token", TokenSchema);

module.exports = { Token, TokenSchema };