const express = require('express');
const router = express.Router();
const {
  startSession,
  endSession,
  getUserSessions
} = require('../controllers/session.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Start a new study session
router.post('/start', authMiddleware, startSession);

// End an existing session
router.put('/end/:sessionId', authMiddleware, endSession);

// Get user's session history
router.get('/history', authMiddleware, getUserSessions);

module.exports = router;
