const mongoose = require("mongoose");

const ColDataSchema = mongoose.Schema({
    value: {
    type: String,
    required: true,
    trim: true,
  },
  id: {
    type: String,
    required: false
  }
});

const ColData = mongoose.model("ColData", ColDataSchema);

module.exports = { ColData, ColDataSchema };