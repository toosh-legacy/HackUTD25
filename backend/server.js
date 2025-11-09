import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // store in .env
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful chatbot specializing in T-Mobile and wireless network support. Provide accurate, friendly, and concise answers.',
        },
        { role: 'user', content: message },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

const PORT1 = process.env.PORT1 || 5000;
app.listen(PORT1, () => console.log(`Server running on port ${PORT1}`));
