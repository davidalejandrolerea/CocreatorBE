/*
    paht: /api/qbtoken
*/
const { Router } = require('express');
const { postCsi, getCsi } = require('../controller/csi');

const router = Router();

router.get('/',  getCsi); 
router.post('/',  postCsi); 

module.exports = router;