const mongoose = require("mongoose");

const ColumnSchema = mongoose.Schema({
  colTitle: {
    type: Date,
    required: true,
    trim: true,
  },
  colType: {
    type: String,
    required: true,
    trim: true,
  },
  metaData:  [{
    column:{
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'MetaData', 
      required: true 
    }
  }]
});

const Column = mongoose.model("Column", ColumnSchema);

module.exports = { Column, ColumnSchema };