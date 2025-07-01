const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Notification = require('../models/Notification');

// GET /api/notifications - Get latest notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

module.exports = router;
