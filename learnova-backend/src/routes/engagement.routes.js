const express = require('express');
const router = express.Router();
const { logEngagement } = require('../controllers/engagement.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/log', authMiddleware, logEngagement);

module.exports = router;
