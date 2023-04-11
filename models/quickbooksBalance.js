const mongoose = require("mongoose");

const balanceSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },

  totalIncome: {
    type: Number,
    require: true,

  },
  totalExpense: {
    type: Number,
    require: true,
  },

});



const Balance = mongoose.model("Balance", balanceSchema);

module.exports = { Balance, balanceSchema };



//boradps
