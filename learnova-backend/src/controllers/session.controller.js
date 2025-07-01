const Session = require('../models/Session');
const calculateStreak = require('../utils/streakCalculator');

// Start a new session
exports.startSession = async (req, res) => {
  try {
    const { subject, topic, startTime, endTime } = req.body;

    if (!subject || !topic || !startTime || !endTime) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newSession = await Session.create({
      userId: req.user.id,
      subject,
      topic,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    res.status(201).json({ message: 'Study session started.', session: newSession });
  } catch (error) {
    console.error('Start session error:', error.message);
    res.status(500).json({ error: 'Could not start session.' });
  }
};

// End a session
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { actualDuration, wasCompleted } = req.body;

    const session = await Session.findOne({ _id: sessionId, userId: req.user.id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    // Calculate engagement score
    const plannedDuration = (session.endTime - session.startTime) / 60000; // in minutes
    const score = Math.min(100, Math.round((actualDuration / plannedDuration) * 100));

    session.actualDuration = actualDuration;
    session.wasCompleted = wasCompleted;
    session.engagementScore = score;
    await session.save();

    // XP and streak calculation
    const result = await calculateStreak(req.user.id, score);

    res.status(200).json({
      message: 'Session ended.',
      session,
      reward: {
        xpAwarded: result.xpAwarded,
        currentStreak: result.streak,
        badge: result.badge || null
      }
    });
  } catch (error) {
    console.error('End session error:', error.message);
    res.status(500).json({ error: 'Could not end session.' });
  }
};

// View session history
exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Fetch sessions error:', error.message);
    res.status(500).json({ error: 'Could not fetch session history.' });
  }
};
