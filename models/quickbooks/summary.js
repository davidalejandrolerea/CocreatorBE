const mongoose = require("mongoose");

const SummarySchema = mongoose.Schema({
    coldata: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ColData', 
        required: true 
      }]
});

const Summary = mongoose.model("Summary", SummarySchema);

module.exports = { Summary, SummarySchema };