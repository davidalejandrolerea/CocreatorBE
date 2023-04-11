const mongoose = require("mongoose");

const Header = require('./header');

const RootSchema = mongoose.Schema({

  header: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Header', 
    required: true 
  },
  columns: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Columns',
    required: true
  },
  rows: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Rows',
    required: true
  }
});

const Root = mongoose.model("Root", RootSchema);

RootSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = { Root, RootSchema };