const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { getDashboardStats } = require('../controllers/dashboard.controller');

router.get('/stats', auth, getDashboardStats);

module.exports = router;
