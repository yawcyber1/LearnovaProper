const express = require('express');
const router = express.Router();
const { register, verifyEmail, login } = require('../controllers/auth.controller');
const { validateRegister } = require('../middleware/validateAuth');
const { authLimiter } = require('../middleware/rateLimiter');

// Rate-limit + Validate register
router.post('/register', authLimiter, validateRegister, register);

// Rate-limit email verify + login
router.post('/verify-email', authLimiter, verifyEmail);
router.post('/login', authLimiter, login);

module.exports = router;
