/*
    paht: /api/qbbalance
*/
const { Router } = require('express');

const { getBalance } = require('../controller/qbbalance');
const { obtenerDBtoken, obtenerQBtoken } = require('../middlewares/obtener-qbtoken');

const router = Router();

router.get('/',  getBalance);   //savetoken  quickbooks/qbbalance
router.get('/obtenerdbtoken',  obtenerDBtoken); 
router.get('/obtenerqbtoken',  obtenerQBtoken);

//router.get('/quickbooks/get-balance',  getBalance); //savetoken
//router.get('/quickbooks/get-balance',  getBalance); //passtrhou

module.exports = router;