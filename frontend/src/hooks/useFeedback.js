import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

export const useFeedback = () => {
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userFeedback, setUserFeedback] = useState(null);
  const [averageFeedback, setAverageFeedback] = useState(null);

  const getUserFeedback = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        console.warn('No user logged in');
        return null;
      }
      
      const token = await user.getIdToken();
      const response = await fetch(`http://localhost:4000/api/feedback/user?userId=${user.uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user feedback');
      }
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setUserFeedback(data.data);
      return data.data;
    } catch (err) {
      console.error('Error in getUserFeedback:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAverageFeedback = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/feedback/average');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAverageFeedback(data.data.average);
      return data.data.average;
    } catch (err) {
      console.error('Error fetching average feedback:', err);
      return null;
    }
  };

  const submitFeedback = async (rating, additionalData = {}) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:4000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          rating, 
          userId: user.uid,
          ...additionalData 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      console.log('Feedback submitted successfully:', data.data);
      setUserFeedback(data.data);
      await getAverageFeedback(); // Refresh average after submitting
      return data.data;
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserFeedback();
    getAverageFeedback();
  }, []);

  return {
    loading,
    error,
    userFeedback,
    averageFeedback,
    submitFeedback,
    refreshFeedback: async () => {
      await Promise.all([getUserFeedback(), getAverageFeedback()]);
    },
  };
};