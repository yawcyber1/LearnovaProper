const Achievement = require('../models/Achievement');

const unlockAchievement = async (userId, title, description = '') => {
  try {
    // Check if achievement already unlocked
    const existing = await Achievement.findOne({ userId, title });
    if (existing) return null;

    // Create new achievement
    const achievement = await Achievement.create({
      userId,
      title,
      description
    });

    console.log(`🏅 Achievement unlocked: ${title} for user ${userId}`);
    return achievement;
  } catch (error) {
    console.error('❌ Error unlocking achievement:', error.message);
    return null;
  }
};

module.exports = unlockAchievement;
