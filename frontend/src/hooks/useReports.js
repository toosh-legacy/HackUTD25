import { useState, useCallback } from 'react';
import { auth } from '../firebase';

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:4000/api/reports/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      
      const data = await response.json();
      setReports(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createReport = useCallback(async (reportData) => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:4000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create report');
      }
      
      const data = await response.json();
      return data.data.id;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reports,
    loading,
    error,
    fetchReports,
    createReport,
    hasMore: false
  };
}