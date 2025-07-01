const cron = require('node-cron');
const mongoose = require('mongoose');
const StudyPlan = require('../models/StudyPlan');
const User = require('../models/User');
const sendEmail = require('../utils/emailSender');
const Notification = require('../models/Notification'); // 👈 Fallback notifications

// Helper to get current time + 15 mins in HH:mm format
function getReminderTimeString() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15);
  return now.toTimeString().slice(0, 5); // "HH:mm"
}

// Helper to get current weekday name
function getTodayName() {
  return new Date().toLocaleString('en-US', { weekday: 'long' }); // e.g., "Monday"
}

// Cron job: run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  const reminderTime = getReminderTimeString();
  const today = getTodayName();

  console.log(`🔔 Checking for reminders at ${reminderTime} on ${today}`);

  try {
    const upcomingPlans = await StudyPlan.find({
      daysOfWeek: today,
      timeBlocks: {
        $elemMatch: { startTime: reminderTime }
      }
    }).populate('userId', 'email firstName');

    for (const plan of upcomingPlans) {
      const user = plan.userId;

      const subject = `⏰ Reminder: Study time for ${plan.subject} starts soon`;
      const text = `Hi ${user.firstName},\n\nJust a quick reminder that your study session for ${plan.subject} - ${plan.topic || 'General'} starts at ${reminderTime}.\n\nGoal: ${plan.goal || 'Stay focused and learn well!'}\n\nGood luck!\n– Learnova`;

      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>⏰ Upcoming Study Session</h2>
          <p>Hi <strong>${user.firstName}</strong>,</p>
          <p>This is your reminder that your study session for <strong>${plan.subject}</strong> 
          ${plan.topic ? `on <em>${plan.topic}</em>` : ''} begins soon at <strong>${reminderTime}</strong>.</p>
          ${plan.goal ? `<p><strong>Goal:</strong> ${plan.goal}</p>` : ''}
          <p>🧠 Stay focused and keep up the great work!</p>
          <br>
          <p>– The Learnova Team</p>
        </div>
      `;

      await sendEmail(user.email, subject, text, html);
      console.log(`📧 Reminder sent to ${user.email} for ${plan.subject}`);

      // Log fallback notification
      await Notification.create({
        userId: user._id,
        message: `Reminder: Your ${plan.subject} session starts at ${reminderTime}`,
        type: 'reminder'
      });
    }

  } catch (error) {
    console.error('❌ Error in reminder cron job:', error.message);
  }
});
