const { response } = require('express');
const bcrypt = require('bcryptjs');

const { dbCConnection } = require('../database/config');

const {PersonalityAnswer} = require('../models/personalityanswer');

const postPersonalityAnswer = async (req, res = response) => {
    /*
     * 
     */
    dbCConnection();
    const body = req.body;
    const personalityAnswer = new PersonalityAnswer(body);
    await personalityAnswer.save();

    res.json({
        ok: true,
        personalityAnswer,
    });

};

//get 
const getPersonalityAnswer = async (req, res = response)=>{
  try {
    /*
     */
    var query = req.query;
    
    if (query.hasOwnProperty("user")){
      query["user"] = query.user; 
    }
    dbCConnection();
    const personalityAnswer = await PersonalityAnswer.find(query);
    console.log(personalityAnswer);
    res.json(personalityAnswer);
 
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

const readPersonalityAnswerFromDB = async (query) => {
    try {
        const personalityAnswer = await PersonalityAnswer.find({ "codigo": query });
        return JSON.stringify(personalityAnswer);
    } catch (e) {
        res.status(500).json({ error: e.message });
    } 
}

module.exports = {
    postPersonalityAnswer,
    getPersonalityAnswer,
    readPersonalityAnswerFromDB,
};

