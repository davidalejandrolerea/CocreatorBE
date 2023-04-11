/*
    paht: /api/qbtoken
*/
const { Router } = require('express');
const { postToken, getToken } = require('../controller/qbtoken');

const router = Router();

router.post('/',  postToken);   //savetoken  quickbooks/qbbalance  //passtrhou
router.get('/token',  getToken);  //?user=realmId

module.exports = router;
