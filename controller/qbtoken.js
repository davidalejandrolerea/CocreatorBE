const { response } = require('express');
const bcrypt = require('bcryptjs');

const { dbCConnection } = require('../database/config');


const {Token} = require('../models/quickbooks/token');

const postToken = async (req, res = response) => {
    /**
     * {"token":"eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..3qIegG_eOhWjOei6CvG5aQ.dwp2xUZpjULPXkLLx8DVAfzBd2ztYT5UOpOM0E6FbTBrGYWI-otIPnBN4cORG2vUcc35_J6WvJuNB5m_2rrDemGhl3v8yB7sKiAm08Bgf00wks9FzkD3pga8SalMjgKv8QhAtfh0csXFsOUXx9ruj8XBs65-IywLISQkTNtxKE7eZU_MY0W5w-A3ld7wxEh_haWrLgOSa5N4FTHA6BA5F7Rgyp3ZObGbrbrPQwr5F-gbKxc6k3T2GqIKlVhnrG83cAELlbom53ZzTuw-d0d4qltkfC0jHg_Ns0fy2AJUM8QFBZ5oCgh0KazvadkJtIMFvpRRGPNCiyzbIQyV2C03S8wZ1sfR31qOs2dGzDswGB_JwDOWUfw3r4xzssTvA_Zu6aILymrT3bnYFifI8yjgyRpa6ceWxxDK-L-c0NvMHTq7i3zKS9knxziCatCYfc2wfRi3GZadUXh2oeCTsTlFn61GaOlCG1rExFApaYTb8NcYHosySkDen2YXCi01vlIGLjIILpkU3Q3qWLUYG71KmNc0F7ldLn5eba71srAWshBUIULWBOqS2oCbg9QSusDPdkwX6scrMdkqzmrj5f2f2cl53DfeIG7eqJ2vaTzow5Ji3ngeROTirp97GEKmdwHJ_bTHmr7dutG1NJ210WBLdqrmOJsZ0iRXnW9qQq01qulTpBo3lUSNlzyj05kgXcuZkFaDhLvbJRUEa5nZ6RYdhCzKt1Q0zU2Aw9FyNStG6OgpP60G4mDJK2cJTEIIKipM.3OsorAXplT2FdFYhUEyHVQ", 
     * "refreshtoken":"AB11685134955231l1EQLpPjBEyfb0JwBCvweGjbzttdvEApDa",
     * "user":"4620816365270088910"}
     * 
     */
    dbCConnection();
    const body = req.body;
    const tokenDB = new Token(body);
    await tokenDB.save();

    res.json({
        ok: true,
        Token,
    });

};

//get Token
const getToken = async (req, res = response)=>{
  try {
    /**
     * 
     * http://localhost:3000/api/qbtoken/token?user=4620816365270088910
     * 
     * [{
     * "_id":"63ebf79335e0fc4ae455d97f",
     * "token":"eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..3qIegG_eOhWjOei6CvG5aQ.dwp2xUZpjULPXkLLx8DVAfzBd2ztYT5UOpOM0E6FbTBrGYWI-otIPnBN4cORG2vUcc35_J6WvJuNB5m_2rrDemGhl3v8yB7sKiAm08Bgf00wks9FzkD3pga8SalMjgKv8QhAtfh0csXFsOUXx9ruj8XBs65-IywLISQkTNtxKE7eZU_MY0W5w-A3ld7wxEh_haWrLgOSa5N4FTHA6BA5F7Rgyp3ZObGbrbrPQwr5F-gbKxc6k3T2GqIKlVhnrG83cAELlbom53ZzTuw-d0d4qltkfC0jHg_Ns0fy2AJUM8QFBZ5oCgh0KazvadkJtIMFvpRRGPNCiyzbIQyV2C03S8wZ1sfR31qOs2dGzDswGB_JwDOWUfw3r4xzssTvA_Zu6aILymrT3bnYFifI8yjgyRpa6ceWxxDK-L-c0NvMHTq7i3zKS9knxziCatCYfc2wfRi3GZadUXh2oeCTsTlFn61GaOlCG1rExFApaYTb8NcYHosySkDen2YXCi01vlIGLjIILpkU3Q3qWLUYG71KmNc0F7ldLn5eba71srAWshBUIULWBOqS2oCbg9QSusDPdkwX6scrMdkqzmrj5f2f2cl53DfeIG7eqJ2vaTzow5Ji3ngeROTirp97GEKmdwHJ_bTHmr7dutG1NJ210WBLdqrmOJsZ0iRXnW9qQq01qulTpBo3lUSNlzyj05kgXcuZkFaDhLvbJRUEa5nZ6RYdhCzKt1Q0zU2Aw9FyNStG6OgpP60G4mDJK2cJTEIIKipM.3OsorAXplT2FdFYhUEyHVQ",
     * "refreshtoken":"AB11685134955231l1EQLpPjBEyfb0JwBCvweGjbzttdvEApDa",
     * "user":"4620816365270088910",
     * "__v":0
     * }]
     * 
     */
    var query = req.query;
    
    if (query.hasOwnProperty("user")){
      query["user"] = query.user; 
    }

    const token = await Token.find(query);
    res.json(token);
 
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

    /*
    const dbConnect = dbCConnection.getDb;
    const tokenBody = {
      token: req.body.token,
      refreshtoken: req.body.refreshtoken,
      user: req.body.user
    };

    console.log(req.body.token);

    dbConnect
      .collection("Token")
      .insertOne(tokenBody, function (err, result) {
        if (err) {
          res.status(400).send("Error inserting Token!");
        } else {
          console.log(`Added a new Token with id ${result.insertedId}`);
          res.status(204).send();
        }
      });
      //const jsonToken = '{"token":"kjhygJHKGHJG56576KJHJKHkmlvvgghgk", "refreshtoken":"kjhygJHKGHJG56576KJHJKHkmlvvgghgk","user":"usuario"}';
    */
const saveQuickBookToken = async (req, res = response)=>{
  // recibir token...usuario
  try {
      const root = await Root.find();
      res.json(root);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
}

const passthrouQB = async (req, res = response)=>{
  // lo que viene de QB pasarlo
  try {
      const root = await Root.find();
      res.json(root);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
}

module.exports = {
    postToken,
    getToken,
    saveQuickBookToken,
    passthrouQB
};
