    const mongoose = require("mongoose");

    const MetadataSchema = mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      value: {
        type: String,
        required: true,
        trim: true,
      }
    });
    
    const Metadata = mongoose.model("Metadata", MetadataSchema);
    
    module.exports = { Metadata, MetadataSchema };