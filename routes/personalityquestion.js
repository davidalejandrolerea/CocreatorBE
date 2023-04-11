const { Router } = require('express');
const { postPersonalityQuestion, getPersonalityQuestion } = require('../controller/personalityquestion');

const router = Router();

router.post('/',  postPersonalityQuestion); 
router.get('/',  getPersonalityQuestion);

module.exports = router;
