import { useState, useCallback } from 'react';
import { ReportsService } from '../services/firebase.service';

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReportsService.getReports(50, lastDoc);
      setReports(prev => [...prev, ...data]);
      if (data.length > 0) {
        setLastDoc(data[data.length - 1]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lastDoc]);

  const createReport = useCallback(async (reportData) => {
    try {
      setLoading(true);
      setError(null);
      const id = await ReportsService.createReport(reportData);
      return id;
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
    hasMore: reports.length > 0 && reports.length % 50 === 0
  };
}