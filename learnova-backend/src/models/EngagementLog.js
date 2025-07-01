const mongoose = require('mongoose');

const engagementLogSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['tab-switch', 'click', 'ai-usage', 'note-write']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  meta: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model('EngagementLog', engagementLogSchema);
