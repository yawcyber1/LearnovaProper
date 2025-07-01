const Quiz = require('../models/Quiz');

exports.createQuiz = async (req, res) => {
  try {
    const { title, subject, topic, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and questions are required' });
    }

    const quiz = await Quiz.create({
      title,
      subject,
      topic,
      questions,
      createdBy: req.user.id
    });

    res.status(201).json({ message: 'Quiz created', quiz });
  } catch (error) {
    res.status(500).json({ error: 'Could not create quiz', details: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('title subject topic');
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Hide correct answers
    const sanitized = quiz.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options
    }));

    res.status(200).json({
      _id: quiz._id,
      title: quiz.title,
      subject: quiz.subject,
      topic: quiz.topic,
      questions: sanitized
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve quiz' });
  }
};
