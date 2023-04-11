const mongoose = require("mongoose");


const accountsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  item: {
    type: String,
    required: true,
    trim: true,
  }

});

const Accounts = mongoose.model("Accounts", accountsSchema);

module.exports = { Accounts, accountsSchema };