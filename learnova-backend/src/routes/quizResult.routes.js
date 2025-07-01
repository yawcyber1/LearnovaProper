const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { submitQuiz, getUserQuizResults } = require('../controllers/quizResult.controller');

router.post('/submit', auth, submitQuiz); // Submit a quiz
router.get('/history', auth, getUserQuizResults); // Get past quiz results

module.exports = router;
