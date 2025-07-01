const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Achievement = require('../models/Achievement');

// GET /api/achievements - Get all achievements for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.user.id }).sort({ unlockedAt: -1 });
    res.status(200).json(achievements);
  } catch (error) {
    console.error('❌ Error fetching achievements:', error.message);
    res.status(500).json({ error: 'Could not fetch achievements.' });
  }
});

module.exports = router;
