import { db } from '../firebase.js';
import OpenAI from 'openai';

export class ChatService {
  static async getChatHistory(userId, limit = 50) {
    try {
      const snapshot = await db
        .collection('chat_messages')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw error;
    }
  }

  static async sendMessage(userId, message) {
    try {
      const docRef = await db.collection('chat_messages').add({
        userId,
        message,
        timestamp: new Date().toISOString(),
        isUser: true
      });

      // Simulate AI response
      const aiResponse = await this.generateAIResponse(message);
      await db.collection('chat_messages').add({
        userId,
        message: aiResponse,
        timestamp: new Date().toISOString(),
        isUser: false
      });

      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  static async generateAIResponse(userMessage) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful T-Mobile customer service chatbot. Provide accurate, friendly, and concise answers about T-Mobile services, plans, and technical support.',
          },
          { role: 'user', content: userMessage },
        ],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
    }
  }
}