/*
    paht: /api/transactionlist
*/
const { Router } = require('express');

const { getTransactionList } = require('../controller/transactionlist');

const router = Router();

router.get('/',  getTransactionList); 

module.exports = router;