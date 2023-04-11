// Crear un esquema de Mongoose para las preguntas y respuestas
const mongoose = require("mongoose");

const preguntausrSchema = new mongoose.Schema({

      user: {
        type: String,
        required: true
      },
      fecha: {
        type: Date,
        required: true,
        default: Date.now
      },
      body_question: {
        type: String,
        required: true
      },
      body_answer: {
        type: String,
        required: true
      },
});

const PreguntaUsr = mongoose.model('PreguntaUsr', preguntausrSchema);

module.exports = { PreguntaUsr, preguntausrSchema };