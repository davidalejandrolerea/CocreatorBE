const mongoose = require("mongoose");

const OptionSchema = mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  }
});

const Option = mongoose.model("Option", OptionSchema);

module.exports = { Option, OptionSchema };