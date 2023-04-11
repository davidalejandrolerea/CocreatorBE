// Crear un esquema de Mongoose para las preguntas y respuestas
const mongoose = require("mongoose");

const preguntaSchema = new mongoose.Schema({
    type_of_business: {
        type: String,
        required: false
      },
      state: {
        type: String,
        required: false
      },
      name_of_company: {
        type: String,
        required: false
      },
      current_DSO: {
        type: String,
        required: false
      },
      DPO: {
        type: String,
        required: false
      },
      DIH: {
        type: String,
        required: false
      },
      current_net_cash_flows: {
        type: String,
        required: false
      },
      liquidity_ratio: {
        type: String,
        required: false
      },
      codigo: {
        type: String,
        required: true
      },
      body_question: {
        type: String,
        required: true
      },
      respuesta: String,
});

const Pregunta = mongoose.model('Pregunta', preguntaSchema);

module.exports = { Pregunta, preguntaSchema };