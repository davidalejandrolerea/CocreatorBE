const mongoose = require("mongoose");

const personalityAnswerSchema = mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  intro: {
    type: String,
    required: false,
    trim: true,
  },
  secondary: { 
    type: String,
    required: false,
    trim: true,
  },
  thirdsty:{
    type: String,
    required: false,
    trim: true,
  },
  personality_code:{
    type: String,
    required: false,
    trim: true,
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  item: {
    type: String,
    required: false,
    trim: true,
  }
});

const PersonalityAnswer = mongoose.model("PersonalityAnswer", personalityAnswerSchema);

module.exports = { PersonalityAnswer, personalityAnswerSchema };