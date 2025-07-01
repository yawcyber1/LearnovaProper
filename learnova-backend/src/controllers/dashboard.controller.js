const Session = require('../models/Session');
const QuizResult = require('../models/QuizResult');
const Question = require('../models/Question');
const Achievement = require('../models/Achievement');
const StudyPlan = require('../models/StudyPlan');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    const [
      totalStudyTime,
      totalQuizStats,
      totalQuestions,
      totalAchievements,
      activePlans
    ] = await Promise.all([
      Session.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$actualDuration" } } }
      ]),
      QuizResult.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            avgScore: { $avg: "$score" },
            count: { $sum: 1 }
          }
        }
      ]),
      Question.countDocuments({ userId }),
      Achievement.countDocuments({ userId }),
      StudyPlan.countDocuments({ userId })
    ]);

    res.status(200).json({
      xp: user.xp,
      level: Math.floor(user.xp / 100) + 1,
      streak: user.streak?.count || 0,
      totalStudyMinutes: totalStudyTime[0]?.total || 0,
      totalQuestionsAsked: totalQuestions,
      quizAttempts: totalQuizStats[0]?.count || 0,
      averageQuizScore: Math.round(totalQuizStats[0]?.avgScore || 0),
      achievementsUnlocked: totalAchievements,
      activeStudyPlans: activePlans
    });

  } catch (error) {
    console.error('❌ Dashboard fetch error:', error.message);
    res.status(500).json({ error: 'Failed to load dashboard data.' });
  }
};
