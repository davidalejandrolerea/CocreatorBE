const { Router } = require('express');
const { postPregunta, getPregunta } = require('../controller/pregunta');

const router = Router();

router.post('/',  postPregunta); 
router.get('/q',  getPregunta);

module.exports = router;