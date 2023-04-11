const mongoose = require("mongoose");


const questionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
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

const Question = mongoose.model("Question", questionSchema);

module.exports = { Question, questionSchema };