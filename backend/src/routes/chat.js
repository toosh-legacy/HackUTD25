import express from 'express';
import { verifyAuth } from '../middleware/auth.js';
import { ChatService } from '../services/chat.service.js';

const router = express.Router();

// GET /api/chat/history
router.get('/history', verifyAuth, async (req, res) => {
  try {
    const { limit } = req.query;
    const messages = await ChatService.getChatHistory(req.user.uid, limit);
    res.json({ data: messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chat/message
router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?.uid || 'anonymous'; // Fall back to anonymous if no auth

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messageId = await ChatService.sendMessage(userId, message);
    const messages = await ChatService.getChatHistory(userId, 1); // Get the latest message including AI response
    res.status(200).json({ 
      reply: messages[0].isUser ? messages[1]?.message : messages[0].message,
      messageId 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;