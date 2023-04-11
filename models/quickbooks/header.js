const mongoose = require("mongoose");

const HeaderSchema = mongoose.Schema({
    /*
    public ArrayList<Option> option;
    public ArrayList<ColDatum> colData;	
    */
  time: {
    type: Date,
    required: true,
    trim: true,
  },
  reportName: {
    type: String,
    required: true,
    trim: true,
  },
  dateMacro: {
    type: String,
    required: true,
    trim: true,
  },
  reportBasis: {
    type: String,
    required: true,
    trim: true,
  },
  startPeriod: {
    type: String,
    required: true,
    trim: true,
  },
  endPeriod: {
    type: String,
    required: true,
    trim: true,
  },
  summarizeColumnsBy: {
    type: String,
    required: true,
    trim: true,
  },
  currency: {
    type: String,
    required: true,
    trim: true,
  },
  option: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Option', 
    required: true 
  }],
  coldata: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ColData', 
    required: true 
  }]
});

const Header = mongoose.model("Header", HeaderSchema);

module.exports = { Header, HeaderSchema };