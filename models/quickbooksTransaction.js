const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },

  value: {
    type: Number,
    require: true,

  },
  date: {
    type: String,
    require: true,
  },

});



const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = { Transaction, transactionSchema };