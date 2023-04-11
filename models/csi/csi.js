const mongoose = require("mongoose");

const CsiSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
    trim: true,
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  business_performace: {
    type: Number,
    required: false, 
    min: 0, 
    max: 100
  },
  business_liquidity: {
    type: Number,
    required: false, 
    min: 0, 
    max: 100
  },
  business_internal_satis: {
    type: Number,
    required: false, 
    min: 0, 
    max: 100
  },
  business_external_satis : {
    type: Number,
    required: false, 
    min: 0, 
    max: 100
  },
  business_connections: {
    type: Number,
    required: false, 
    min: 0, 
    max: 100
  },
  
});

const Csi = mongoose.model("Csi", CsiSchema);

module.exports = { Csi, CsiSchema };