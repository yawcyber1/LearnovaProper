const express = require('express');
const router = express.Router();
const {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan
} = require('../controllers/studyPlan.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Create a new study plan
router.post('/', authMiddleware, createPlan);

// Get all study plans for the logged-in user
router.get('/', authMiddleware, getPlans);

// Update an existing study plan
router.put('/:planId', authMiddleware, updatePlan);

// Delete a study plan
router.delete('/:planId', authMiddleware, deletePlan);

module.exports = router;
