import { db } from '../firebase.js';

export class FeedbackService {
  static async saveFeedback(userId, rating, additionalData = {}) {
    try {
      const feedbackRef = db.collection('user_feedback').doc();
      const feedbackData = {
        userId,
        rating,
        ...additionalData,
        timestamp: new Date().toISOString()
      };

      await feedbackRef.set(feedbackData);
      return { id: feedbackRef.id, ...feedbackData };
    } catch (error) {
      console.error('Error saving feedback:', error);
      throw error;
    }
  }

  static async getUserFeedback(userId) {
    try {
      const snapshot = await db
        .collection('user_feedback')
        .where('userId', '==', userId)
        .limit(10)
        .get();

      if (snapshot.empty) {
        return null;
      }

      // Sort in memory instead of using orderBy to avoid index requirement
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return docs[0];
    } catch (error) {
      console.error('Error getting user feedback:', error);
      throw error;
    }
  }

  static async getAverageFeedback() {
    try {
      const snapshot = await db
        .collection('user_feedback')
        .limit(100)
        .get();

      const feedbacks = snapshot.docs.map(doc => doc.data());
      if (feedbacks.length === 0) return 0;

      // Sort in memory instead of using orderBy to avoid index requirement
      feedbacks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      const sum = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
      return sum / feedbacks.length;
    } catch (error) {
      console.error('Error calculating average feedback:', error);
      throw error;
    }
  }
}