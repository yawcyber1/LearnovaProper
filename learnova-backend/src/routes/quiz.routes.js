const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { createQuiz, getAllQuizzes, getQuizById } = require('../controllers/quiz.controller');

router.post('/', auth, createQuiz); // Create a new quiz
router.get('/', auth, getAllQuizzes); // Get list of all quizzes
router.get('/:id', auth, getQuizById); // Get one quiz (without answers)

module.exports = router;
