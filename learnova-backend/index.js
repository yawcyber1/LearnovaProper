const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const aiRoutes = require("./src/routes/ai.routes");
const sessionRoutes = require('./src/routes/session.routes');
const engagementRoutes = require('./src/routes/engagement.routes');
const studyPlanRoutes = require('./src/routes/studyPlan.routes');
const achievementRoutes = require('./src/routes/achievement.routes'); // ✅ NEW
const leaderboardRoutes = require('./src/routes/leaderboard.routes');
const quizRoutes = require('./src/routes/quiz.routes');
const quizResultRoutes = require('./src/routes/quizResult.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const errorHandler = require('./src/middleware/errorHandler');




//cron-job
require('./src/cron/reminder.job');
require('./src/cron/motivation.job');


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// DB connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/questions", aiRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/engagement', engagementRoutes);
app.use('/api/study-plans', studyPlanRoutes);
app.use('/api/achievements', achievementRoutes); 
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz-results', quizResultRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use(errorHandler); 

app.get('/', (req, res) => {
  res.send('Welcome to Learnova API');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
