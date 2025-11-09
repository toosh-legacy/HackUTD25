import { useEffect } from "react";
import { useReports } from "../hooks/useReports";
import "../css/Alerts.css";

export default function AlertsPage() {
  const { reports, fetchReports, loading, error } = useReports();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const renderDate = (createdAt) => {
    if (!createdAt) return "Unknown";
    try {
      return new Date(createdAt).toLocaleString();
    } catch {
      return String(createdAt);
    }
  };

  const activeReports = reports.filter(r => r.status !== 'resolved');

  return (
    <div className="alerts-container">
      <h1>Alert System - Active Reports</h1>

      <div className="alerts-summary">
        <div className="summary-card alert-critical">
          <div className="summary-icon">🚨</div>
          <div className="summary-content">
            <div className="summary-number">{activeReports.length}</div>
            <div className="summary-label">Active Alerts</div>
          </div>
        </div>
      </div>

      <section className="alerts-section">
        <div className="section-header">
          <h2>Active Problem Reports</h2>
          <button onClick={fetchReports} className="refresh-button" disabled={loading}>
            🔄 {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading && reports.length === 0 && (
          <div className="loading-state">Loading reports...</div>
        )}
        
        {error && (
          <div className="error-alert">
            Error loading reports: {error}
          </div>
        )}

        {!loading && activeReports.length === 0 && !error && (
          <div className="empty-state">
            No active alerts. All systems operating normally! ✅
          </div>
        )}

        <div className="alerts-grid">
          {activeReports.map((r) => (
            <div key={r.id} className="alert-card">
              <div className="alert-header">
                <div className="alert-title-section">
                  <h3>{r.title || r.category || 'Untitled Report'}</h3>
                  <span className="alert-badge">Active</span>
                </div>
                <div className="alert-timestamp">{renderDate(r.createdAt)}</div>
              </div>
              
              <p className="alert-description">{r.description || r.message || 'No description provided'}</p>
              
              <div className="alert-footer">
                {r.location && (
                  <span className="alert-location">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {r.location}
                  </span>
                )}
                {r.severity && (
                  <span className="alert-severity">
                    Severity: {r.severity}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
