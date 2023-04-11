const { response } = require('express');
const bcrypt = require('bcryptjs');
const {Csi} = require('../models/csi/csi');
const { dbCConnection } = require('../database/config');

const getCsi = async (req, res = response) => {

    var query = req.query;
  
    if (query.hasOwnProperty("user")){
      query["user"] = query.user; 
    }
    console.log('query["user"] = ' + query["user"] );

    var dbCsi;
    var csi ;
    dbCConnection();
    try {
      dbCsi = await Csi.find(query, function(err, csis) {
        if (err) throw err;
      
        // 'token' is an array of the Token objects retrieved.
        csis.forEach(function(csi) {
          csi = csis;
        });
        csi = csis;
      }).sort({"_id": -1}).limit(1);
    } catch (e) {
      console.log('error = ' + e.message);
    }

    res.json({
        ok: true,
        csi,
    });
};

const postCsi = async (req, res = response) => {

    dbCConnection();
    const body = req.body;
    console.log('postCsi body = ' + body.user);
    const csiDB = new Csi(body);
    await csiDB.save();

    res.json({
        ok: true,
        csiDB,
    });

};

module.exports = {
  getCsi,
  postCsi
};
