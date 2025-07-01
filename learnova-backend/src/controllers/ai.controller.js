const openai = require('../config/openai');
const Question = require('../models/Question');

exports.askQuestion = async (req, res) => {
  let { question, subject, topic } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const modelFallbacks = [
    'provider-5/gpt-4o-mini',
    'provider-3/gpt-4o-mini',
    'provider-2/gpt-4o-mini'
  ];

  let completion;
  let lastError;
  let answer = null;

  for (const model of modelFallbacks) {
    try {
      completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You are a helpful learning assistant.' },
          { role: 'user', content: question }
        ]
      });

      answer = completion?.choices?.[0]?.message?.content;
      if (answer) {
        console.log(`✅ Answer generated using model: ${model}`);

        // 🔍 Attempt smart context recall if subject/topic not provided
        if (!subject || !topic) {
          const pastQuestions = await Question.find({ userId: req.user.id });

          let bestMatch = { subject: '', topic: '', score: 0 };

          for (const q of pastQuestions) {
            const sharedWords = question
              .toLowerCase()
              .split(/\s+/)
              .filter(word => q.question.toLowerCase().includes(word));

            const score = sharedWords.length;

            if (score > bestMatch.score) {
              bestMatch = {
                subject: q.subject,
                topic: q.topic,
                score
              };
            }
          }

          if (bestMatch.score > 2) {
            subject = subject || bestMatch.subject;
            topic = topic || bestMatch.topic;
            console.log(`🔁 Auto-tagged from history: subject="${subject}", topic="${topic}"`);
          }
        }

        // ✅ Save to DB
        await Question.create({
          userId: req.user.id,
          question,
          answer,
          subject: subject || '',
          topic: topic || ''
        });

        break;
      }
    } catch (error) {
      console.error(`⚠️ Error with model ${model}:`, error?.response?.data || error.message);
      lastError = error;
    }
  }

  if (!answer) {
    return res.status(500).json({
      error: 'All providers failed. Please try again later.',
      details: lastError?.message || 'Unknown error'
    });
  }

  return res.status(200).json({ question, answer });
};

exports.getUserQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (error) {
    console.error('❌ Error fetching user questions:', error.message);
    res.status(500).json({ error: 'Failed to retrieve question history.' });
  }
};

