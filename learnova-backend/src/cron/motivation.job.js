const cron = require('node-cron');
const runMotivationEngine = require('../utils/motivationEngine');

// Runs daily at 8 AM UTC
cron.schedule('0 8 * * *', async () => {
  console.log('🕗 Running daily motivation engine...');
  await runMotivationEngine();
});
