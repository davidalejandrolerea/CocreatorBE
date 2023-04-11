const { Router } = require('express');
const { getLikeGptAnswerByObjectId, putLikeGptAnswerByObjectId } = require('../controller/likegptanswer');

const router = Router();

router.get('/',  getLikeGptAnswerByObjectId); 
router.put('/',  putLikeGptAnswerByObjectId);

module.exports = router;
