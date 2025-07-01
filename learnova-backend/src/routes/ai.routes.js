const express = require("express");
const router = express.Router();
const { askQuestion,getUserQuestions } = require("../controllers/ai.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/ask", authMiddleware, askQuestion);
router.get("/history", authMiddleware, getUserQuestions);

module.exports = router;
