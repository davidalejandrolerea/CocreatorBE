const { response } = require('express');
const bcrypt = require('bcryptjs');

const { dbCConnection } = require('../database/config');

const {PersonalityQuestion} = require('../models/personalityquestion');

const postPersonalityQuestion = async (req, res = response) => {
    /*
     * 
     */
    dbCConnection();
    const body = req.body;
    const personalityQuestion = new PersonalityQuestion(body);
    await personalityQuestion.save();

    res.json({
        ok: true,
        personalityQuestion,
    });

};

//get Pregunta
const getPersonalityQuestion = async (req, res = response)=>{
  try {
    /**
     * http://localhost:3000/api/personalityquestion?codigo=1
     * 
     */
    var query = req.query;
    
    if (query.hasOwnProperty("title")){
      query["title"] = query.title; 
    }
    dbCConnection();
    const personalityquestion = await PersonalityQuestion.find(query);
    console.log(personalityquestion);
    res.json(personalityquestion);
 
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

const readPersonalityQuestionFromDB = async (query) => {
    try {
        const personalityquestion = await PersonalityQuestion.find({ "codigo": query });
        return JSON.stringify(personalityquestion);
    } catch (e) {
        res.status(500).json({ error: e.message });
    } 
}

module.exports = {
    postPersonalityQuestion,
    getPersonalityQuestion,
    readPersonalityQuestionFromDB,
};
