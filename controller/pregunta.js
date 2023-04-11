const { response } = require('express');
const bcrypt = require('bcryptjs');

const { dbCConnection } = require('../database/config');

const {Pregunta} = require('../models/pregunta');

const postPregunta = async (req, res = response) => {
    /*
     * 
     */
    dbCConnection();
    const body = req.body;
    const preguntaDB = new Pregunta(body);
    await preguntaDB.save();

    res.json({
        ok: true,
        Pregunta,
    });

};

//get Pregunta
const getPregunta = async (req, res = response)=>{
  try {
    /**
     * 
     * http://localhost:3000/api/pregunta?codigo=1
     * 
     * 
     */
    var query = req.query;
    
    if (query.hasOwnProperty("codigo")){
      query["codigo"] = query.codigo; 
    }

    const pregunta = await Pregunta.find(query);
    res.json(pregunta);
 
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}


const readQuestionFromDB = async (query) => {
    try {
        const pregunta = await Pregunta.find({ "codigo": query });
        return JSON.stringify(pregunta);
    } catch (e) {
        res.status(500).json({ error: e.message });
    } 
}

module.exports = {
    postPregunta,
    getPregunta,
    readQuestionFromDB,
};
