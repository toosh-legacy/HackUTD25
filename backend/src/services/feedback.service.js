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

      // Fetch Reddit happiness index
      let redditHappiness = null;
      try {
        const response = await fetch('http://localhost:3001/api/happiness');
        const data = await response.json();
        redditHappiness = data.happiness;
        console.log('📊 Reddit happiness fetched:', redditHappiness);
      } catch (error) {
        console.warn('⚠️ Could not fetch Reddit happiness, continuing without it:', error.message);
      }

      // If no user feedback and no Reddit data, return default
      if (snapshot.empty && !redditHappiness) {
        return 50;
      }

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
      
      // Calculate user average
      let userAverage = 50;
      if (uniqueFeedbacks.length > 0) {
        const sum = uniqueFeedbacks.reduce((acc, curr) => acc + curr.rating, 0);
        userAverage = sum / uniqueFeedbacks.length;
      }

      // If we have Reddit happiness, include it in the average
      // Reddit happiness gets equal weight to all user feedback combined
      let finalAverage;
      if (redditHappiness !== null && uniqueFeedbacks.length > 0) {
        finalAverage = Math.round((userAverage + redditHappiness) / 2);
        console.log(`📈 Combined average: Users=${Math.round(userAverage)}%, Reddit=${Math.round(redditHappiness)}%, Final=${finalAverage}%`);
      } else if (redditHappiness !== null) {
        // Only Reddit data available
        finalAverage = Math.round(redditHappiness);
        console.log(`📈 Using Reddit happiness only: ${finalAverage}%`);
      } else {
        // Only user feedback available
        finalAverage = Math.round(userAverage);
        console.log(`📈 Using user feedback only: ${finalAverage}%`);
      }
      
      return finalAverage;
    } catch (error) {
      console.error('Error calculating average feedback:', error);
      throw error;
    }
  }
}