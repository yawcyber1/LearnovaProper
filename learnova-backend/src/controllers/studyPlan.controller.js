const StudyPlan = require('../models/StudyPlan');

// Create a new study plan
exports.createPlan = async (req, res) => {
  try {
    const { daysOfWeek, timeBlocks, subject, topic, goal } = req.body;

    if (!daysOfWeek || !timeBlocks || !subject) {
      return res.status(400).json({ message: 'daysOfWeek, timeBlocks, and subject are required.' });
    }

    const plan = await StudyPlan.create({
      userId: req.user.id,
      daysOfWeek,
      timeBlocks,
      subject,
      topic,
      goal
    });

    res.status(201).json({ message: 'Study plan created.', plan });
  } catch (error) {
    console.error('Create plan error:', error.message);
    res.status(500).json({ error: 'Could not create study plan.' });
  }
};

// Get all study plans for the logged-in user
exports.getPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (error) {
    console.error('Fetch plans error:', error.message);
    res.status(500).json({ error: 'Could not retrieve study plans.' });
  }
};

// Update an existing study plan
exports.updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { daysOfWeek, timeBlocks, subject, topic, goal } = req.body;

    const plan = await StudyPlan.findOne({ _id: planId, userId: req.user.id });
    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found.' });
    }

    // Update fields
    if (daysOfWeek) plan.daysOfWeek = daysOfWeek;
    if (timeBlocks) plan.timeBlocks = timeBlocks;
    if (subject) plan.subject = subject;
    if (topic) plan.topic = topic;
    if (goal) plan.goal = goal;

    await plan.save();

    res.status(200).json({ message: 'Study plan updated.', plan });
  } catch (error) {
    console.error('Update plan error:', error.message);
    res.status(500).json({ error: 'Could not update study plan.' });
  }
};

// Delete a study plan
exports.deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const deleted = await StudyPlan.findOneAndDelete({ _id: planId, userId: req.user.id });

    if (!deleted) {
      return res.status(404).json({ message: 'Study plan not found.' });
    }

    res.status(200).json({ message: 'Study plan deleted.' });
  } catch (error) {
    console.error('Delete plan error:', error.message);
    res.status(500).json({ error: 'Could not delete study plan.' });
  }
};
