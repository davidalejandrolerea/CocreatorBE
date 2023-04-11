const { Router } = require('express');
const { postPersonalityAnswer, getPersonalityAnswer } = require('../controller/personalityAnswer');

const router = Router();

router.post('/',  postPersonalityAnswer); 
router.get('/',  getPersonalityAnswer);

module.exports = router;
