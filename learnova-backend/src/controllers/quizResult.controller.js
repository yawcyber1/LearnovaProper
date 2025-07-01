const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const unlockAchievement = require('../utils/unlockAchievement');

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let correct = 0;
    const detailedAnswers = answers.map(submission => {
      const question = quiz.questions.id(submission.questionId);
      const isCorrect = question.correctAnswer === submission.selectedAnswer;
      if (isCorrect) correct++;

      return {
        questionId: submission.questionId,
        selectedAnswer: submission.selectedAnswer,
        isCorrect
      };
    });

    const score = Math.round((correct / quiz.questions.length) * 100);

    const result = await QuizResult.create({
      userId: req.user.id,
      quizId,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers: correct,
      answers: detailedAnswers,
      timeTaken
    });

    // 🏅 Auto-award achievement for perfect score
    if (score === 100) {
      await unlockAchievement(
        req.user.id,
        '💯 First 100% Quiz!',
        'You aced a quiz with a perfect score!'
      );
    }

    res.status(201).json({ message: 'Quiz submitted', result });
  } catch (error) {
    res.status(500).json({ error: 'Could not submit quiz', details: error.message });
  }
};

exports.getUserQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user.id })
      .populate('quizId', 'title subject')
      .sort({ createdAt: -1 });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve quiz results' });
  }
};
