const express = require('express');
const router = express.Router();
const { getTopLearners,getTopQuizPerformers } = require('../controllers/leaderboard.controller');

// Public leaderboard route
router.get('/top', getTopLearners);
router.get('/quiz', getTopQuizPerformers);

module.exports = router;
