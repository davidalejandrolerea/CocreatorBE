const mongoose = require("mongoose");


const personalityQuestionSchema = mongoose.Schema({
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

const PersonalityQuestion = mongoose.model("PersonalityQuestion", personalityQuestionSchema);

module.exports = { PersonalityQuestion, personalityQuestionSchema };
