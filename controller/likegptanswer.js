const { response } = require('express');
const bcrypt = require('bcryptjs');

const { dbCConnection } = require('../database/config');

const {PreguntaUsr} = require('../models/preguntausr');

const putLikeGptAnswerByObjectId = async (req, res = response) => {

    var query = req.query;
    if (query.hasOwnProperty("_id")){
      query["_id"] = query._id; 
    }
    console.log('query._id=' + query._id);

    if (query.hasOwnProperty("like")){
      query["like"] = query.like; 
    }
    console.log('query.like=' + query.like);

    var ObjectId = require('mongodb').ObjectId;
    var o_id = new ObjectId(query._id);

    PreguntaUsr.updateOne({"_id": o_id} , {$set: {"like" : query.like}}, function(err, doc) {
      console.log(doc);
      res.json(doc);
    });
};

//get
const getLikeGptAnswerByObjectId = async (req, res = response)=>{
  try {
    /*
     */
    var query = req.query;
    var ObjectId = require('mongodb').ObjectId;

    if (query.hasOwnProperty("_id")){
      query["_id"] = query._id; 
    }
    console.log('query._id=' + query._id);
    var o_id = new ObjectId(query._id);

    PreguntaUsr.findOne({"_id": o_id}, function(err, doc) {
      console.log(doc);
      res.json(doc);
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

const getLikeGptAnswerByObjectIdFromDb = async (id)=>{
  try {
    var ObjectId = require('mongodb').ObjectId;
    console.log('id=' + id);
    var o_id = new ObjectId(id);

    PreguntaUsr.findOne({"_id": o_id}, function(err, doc) {
      console.log(doc);
      return doc;
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  putLikeGptAnswerByObjectId,
  getLikeGptAnswerByObjectId,
  getLikeGptAnswerByObjectIdFromDb
};
