import { db } from '../firebase.js';

export class FeedbackService {
  static async saveFeedback(userId, rating, additionalData = {}) {
    try {
      // Check if user already has feedback
      const existingSnapshot = await db
        .collection('user_feedback')
        .where('userId', '==', userId)
        .limit(1)
        .get();

      const feedbackData = {
        userId,
        rating,
        ...additionalData,
        timestamp: new Date().toISOString()
      };

      let feedbackRef;
      
      if (!existingSnapshot.empty) {
        // Update existing feedback
        feedbackRef = existingSnapshot.docs[0].ref;
        await feedbackRef.update({
          rating,
          ...additionalData,
          timestamp: new Date().toISOString()
        });
        return { id: feedbackRef.id, ...feedbackData };
      } else {
        // Create new feedback
        feedbackRef = db.collection('user_feedback').doc();
        await feedbackRef.set(feedbackData);
        return { id: feedbackRef.id, ...feedbackData };
      }
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
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting user feedback:', error);
      throw error;
    }
  }

  static async getAverageFeedback() {
    try {
      // Get the most recent feedback from each user (one entry per user)
      const snapshot = await db
        .collection('user_feedback')
        .get();

      if (snapshot.empty) return 50; // Default neutral value

      // Group by userId and get the most recent for each user
      const userFeedbackMap = new Map();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const existing = userFeedbackMap.get(data.userId);
        
        if (!existing || new Date(data.timestamp) > new Date(existing.timestamp)) {
          userFeedbackMap.set(data.userId, data);
        }
      });

      // Calculate average from unique users
      const uniqueFeedbacks = Array.from(userFeedbackMap.values());
      
      if (uniqueFeedbacks.length === 0) return 50;

      const sum = uniqueFeedbacks.reduce((acc, curr) => acc + curr.rating, 0);
      const average = Math.round(sum / uniqueFeedbacks.length);
      
      return average;
    } catch (error) {
      console.error('Error calculating average feedback:', error);
      throw error;
    }
  }
}