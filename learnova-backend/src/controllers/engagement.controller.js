const EngagementLog = require('../models/EngagementLog');

exports.logEngagement = async (req, res) => {
  try {
    const { sessionId, eventType, meta } = req.body;

    if (!sessionId || !eventType) {
      return res.status(400).json({ message: 'sessionId and eventType are required' });
    }

    const log = await EngagementLog.create({
      sessionId,
      userId: req.user.id,
      eventType,
      meta
    });

    res.status(201).json({ message: 'Engagement logged', log });
  } catch (error) {
    console.error('Engagement logging error:', error.message);
    res.status(500).json({ error: 'Could not log engagement' });
  }
};
