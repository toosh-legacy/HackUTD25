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
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('http://localhost:4000/api/feedback/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setUserFeedback(data.data);
      return data.data;
    } catch (err) {
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
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('http://localhost:4000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, ...additionalData }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setUserFeedback(data.data);
      await getAverageFeedback(); // Refresh average after submitting
      return data.data;
    } catch (err) {
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