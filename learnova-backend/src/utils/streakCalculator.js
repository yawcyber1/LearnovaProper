const User = require('../models/User');
const unlockAchievement = require('./unlockAchievement');

const calculateStreak = async (userId, score = 0) => {
  const user = await User.findById(userId);
  if (!user) return { xpAwarded: 0, streak: 0 };

  const today = new Date();
  const todayStr = today.toDateString();

  const lastDate = user.streak?.lastStudyDate
    ? new Date(user.streak.lastStudyDate).toDateString()
    : null;

  // Award XP (e.g., score / 10, capped to 10 XP per session)
  const xpAwarded = Math.min(10, Math.round(score / 10));
  user.xp += xpAwarded;

  if (lastDate === todayStr) {
    // Already studied today – only XP changes
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = lastDate === yesterday.toDateString();

    if (isYesterday) {
      // Continue streak
      user.streak.count += 1;
    } else {
      // New streak
      user.streak.count = 1;
    }

    user.streak.lastStudyDate = today;
  }

  await user.save();

  // Unlock achievements
  if (user.streak.count === 3) {
    await unlockAchievement(userId, '🔥 3-Day Streak', 'You studied 3 days in a row!');
  }
  if (user.streak.count === 5) {
    await unlockAchievement(userId, '🏅 5-Day Streak', 'You reached a 5-day learning streak!');
  }
  if (user.streak.count === 7) {
    await unlockAchievement(userId, '🏆 7-Day Streak', 'You hit a full week of study sessions!');
  }

  const badge =
    user.streak.count >= 7
      ? `🏆 ${user.streak.count}-Day Streak!`
      : user.streak.count >= 3
      ? `🔥 ${user.streak.count}-Day Streak!`
      : null;

  return {
    xpAwarded,
    streak: user.streak.count,
    badge
  };
};

module.exports = calculateStreak;
