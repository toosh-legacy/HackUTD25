import { useState, useEffect } from 'react';
import USMap from '../components/USMap';
import '../css/Status.css';

export default function Status() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/reports');
      const data = await response.json();
      if (data.data) {
        setReports(data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-container">
      <div className="status-content">
        <h2>Network Status Overview</h2>
        
        <div className="status-map">
          <h2 className="map-title">Coverage Map</h2>
          <USMap />
        </div>

        <div className="reports-section">
          <h2 className="map-title">Recent Reports</h2>
          {loading ? (
            <p>Loading reports...</p>
          ) : reports.length === 0 ? (
            <p>No reports yet.</p>
          ) : (
            <div className="reports-list">
              {reports.map((report) => (
                <div key={report.id} className="report-item">
                  <div className="report-header">
                    <strong>{report.title || report.category}</strong>
                    <span className="report-time">
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {report.location && (
                    <div className="report-location">📍 {report.location}</div>
                  )}
                  <p className="report-description">{report.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}