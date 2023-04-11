const mongoose = require("mongoose");

const RowsSchema = mongoose.Schema([{
  row:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Row', 
    required: true 
  }
}]);

const Rows = mongoose.model("Rows", RowsSchema);

module.exports = { Rows, RowsSchema };