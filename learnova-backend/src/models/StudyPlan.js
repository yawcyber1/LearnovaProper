const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  daysOfWeek: {
    type: [String], // e.g., ['Monday', 'Wednesday']
    required: true
  },
  timeBlocks: {
    type: [
      {
        startTime: { type: String, required: true }, // e.g., "16:00"
        endTime: { type: String, required: true }    // e.g., "17:30"
      }
    ],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  topic: {
    type: String
  },
  goal: {
    type: String // e.g., "Revise algebra fundamentals"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
