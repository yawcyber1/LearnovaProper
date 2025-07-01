const User = require('../models/User');
const QuizResult = require('../models/QuizResult');

exports.getTopLearners = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ xp: -1 }) // Sort by XP descending
      .limit(10)         // Return top 10 users
      .select('firstName xp streak.count'); // Select only necessary fields

    const ranked = topUsers.map((user, index) => ({
      rank: index + 1,
      name: user.firstName,
      xp: user.xp,
      streak: user.streak?.count || 0
    }));

    res.status(200).json({ leaderboard: ranked });
  } catch (error) {
    console.error('❌ Leaderboard fetch error:', error.message);
    res.status(500).json({ error: 'Could not retrieve leaderboard.' });
  }
};

exports.getTopQuizPerformers = async (req, res) => {
  try {
    const top = await QuizResult.aggregate([
      {
        $group: {
          _id: "$userId",
          avgScore: { $avg: "$score" },
          attempts: { $sum: 1 }
        }
      },
      { $sort: { avgScore: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$user.firstName",
          avgScore: 1,
          attempts: 1
        }
      }
    ]);

    res.status(200).json({ leaderboard: top });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quiz leaderboard' });
  }
};

