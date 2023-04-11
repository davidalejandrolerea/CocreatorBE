    const mongoose = require("mongoose");

    const RowSchema = mongoose.Schema([{
      header: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Header', 
        required: true,
      },
      rows: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Rows', 
        required: true,
      },
      summary: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Summary', 
        required: true,
      },
      type: {
        type: String,
        required: true,
        trim: true,
      },
      group: {
        type: String,
        required: true,
        trim: true,
      },
      colData: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ColData', 
        required: true,
      }]
    }]);
    
    const Row = mongoose.model("Row", RowSchema);
    
    module.exports = { Row, RowSchema };