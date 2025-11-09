import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import '../css/AdminReports.css';

export default function AdminReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAllReports();
    }
  }, [user]);

  const fetchAllReports = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
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
      if (data.data) {
        setReports(data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId) => {
    if (!user) return;
    
    try {
      setResolvingId(reportId);
      const token = await user.getIdToken();
      const response = await fetch(`http://localhost:4000/api/reports/${reportId}/resolve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to resolve report');
      }
      
      toast.success('Report resolved successfully!');
      // Refresh the list
      await fetchAllReports();
    } catch (error) {
      console.error('Error resolving report:', error);
      toast.error('Failed to resolve report');
    } finally {
      setResolvingId(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'resolved') {
      return <span className="status-badge status-resolved">✓ Resolved</span>;
    }
    return <span className="status-badge status-active">Active</span>;
  };

  const activeReports = reports.filter(r => r.status !== 'resolved');
  const resolvedReports = reports.filter(r => r.status === 'resolved');

  return (
    <div className="admin-reports-container">
      <h1>Manage Problem Reports</h1>

      <div className="reports-summary">
        <div className="summary-card">
          <div className="summary-number">{activeReports.length}</div>
          <div className="summary-label">Active Reports</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{resolvedReports.length}</div>
          <div className="summary-label">Resolved Reports</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{reports.length}</div>
          <div className="summary-label">Total Reports</div>
        </div>
      </div>

      {loading && reports.length === 0 ? (
        <div className="loading-state">Loading reports...</div>
      ) : (
        <>
          {/* Active Reports Section */}
          <section className="reports-section">
            <h2>Active Reports</h2>
            {activeReports.length === 0 ? (
              <div className="empty-state">
                No active reports. Great job! 🎉
              </div>
            ) : (
              <div className="reports-grid">
                {activeReports.map((report) => (
                  <div key={report.id} className="report-card active">
                    <div className="report-header">
                      <div className="report-title-row">
                        <h3>{report.title || report.category}</h3>
                        {getStatusBadge(report.status)}
                      </div>
                      <div className="report-meta">
                        {report.location && (
                          <span className="report-location">
                            📍 {report.location}
                          </span>
                        )}
                        <span className="report-date">
                          {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'Unknown date'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="report-description">{report.description}</p>
                    
                    <div className="report-actions">
                      <button
                        onClick={() => handleResolve(report.id)}
                        disabled={resolvingId === report.id}
                        className="resolve-button"
                      >
                        {resolvingId === report.id ? 'Resolving...' : 'Mark as Resolved'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Resolved Reports Section */}
          {resolvedReports.length > 0 && (
            <section className="reports-section">
              <h2>Recently Resolved</h2>
              <div className="reports-grid">
                {resolvedReports.map((report) => (
                  <div key={report.id} className="report-card resolved">
                    <div className="report-header">
                      <div className="report-title-row">
                        <h3>{report.title || report.category}</h3>
                        {getStatusBadge(report.status)}
                      </div>
                      <div className="report-meta">
                        {report.location && (
                          <span className="report-location">
                            📍 {report.location}
                          </span>
                        )}
                        <span className="report-date">
                          Resolved: {report.resolvedAt ? new Date(report.resolvedAt).toLocaleString() : 'Unknown'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="report-description">{report.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
