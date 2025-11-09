import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import feedbackRoutes from './src/routes/feedback.js';
import reportsRoutes from './src/routes/reports.js';
import announcementsRoutes from './src/routes/announcements.js';
import serverStatusRoutes from './src/routes/serverStatus.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/server-status', serverStatusRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // store in .env
});

app.post('/api/chat', async (req, res) => {
  try {
    console.log('Received chat request:', req.body);
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful chatbot specializing in T-Mobile and wireless network support. Provide accurate, friendly, and concise answers.',
        },
        { role: 'user', content: message },
      ],
    });

    const reply = response.choices[0].message.content;
    console.log('Sending response:', reply);
    res.json({
      reply: reply,
    });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));