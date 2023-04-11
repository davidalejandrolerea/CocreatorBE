
const mongoose = require("mongoose");

const ColumnsSchema = mongoose.Schema([{
    column: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Column', 
        required: true 
    }
}]);

const Columns = mongoose.model("Columns", ColumnsSchema);

module.exports = { Columns, ColumnsSchema };