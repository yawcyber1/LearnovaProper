const { body, validationResult } = require('express-validator');

exports.validateQuiz = [
  body('title').notEmpty().withMessage('Quiz title is required'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  body('questions.*.questionText').notEmpty().withMessage('Each question must have text'),
  body('questions.*.options')
    .isArray({ min: 2 })
    .withMessage('Each question must have at least 2 options'),
  body('questions.*.correctAnswer')
    .notEmpty()
    .withMessage('Each question must have a correct answer'),

  // Final error handling
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }
];
