import express from 'express';
import { verifyAuth } from '../middleware/auth.js';
import { FeedbackService } from '../services/feedback.service.js';

const router = express.Router();

// POST /api/feedback
router.post('/', async (req, res) => {
  try {
    const { rating, ...additionalData } = req.body;
    const userId = req.user?.uid || 'anonymous';

    if (typeof rating !== 'number' || rating < 0 || rating > 100) {
      return res.status(400).json({ error: 'Invalid rating value' });
    }

    const feedback = await FeedbackService.saveFeedback(userId, rating, additionalData);
    res.status(201).json({ data: feedback });
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/feedback/user
router.get('/user', async (req, res) => {
  try {
    const userId = req.user?.uid || 'anonymous';
    const feedback = await FeedbackService.getUserFeedback(userId);
    res.json({ data: feedback });
  } catch (err) {
    console.error('Error getting user feedback:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/feedback/average
router.get('/average', async (req, res) => {
  try {
    const average = await FeedbackService.getAverageFeedback();
    res.json({ data: { average } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;