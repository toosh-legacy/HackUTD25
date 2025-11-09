import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useReports } from '../hooks/useReports';
import { useAuth } from '../contexts/AuthContext';
import { STATES, PROBLEM_CATEGORIES } from '../constants';
import '../css/ReportProblem.css';

export default function ReportProblem() {
  const { user } = useAuth();
  const { reports, loading, error, fetchReports, createReport } = useReports();
  const [formData, setFormData] = useState({
    category: '',
    location: '',
    description: ''
  });

  // Categories and states are now imported from constants

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.location || !formData.description.trim()) {
      toast.error('Please fill out all fields');
      return;
    }

    try {
      await createReport({
        ...formData,
        userId: user.uid,
        severity: 1 // Default severity
      });
      
      setFormData({ category: '', location: '', description: '' });
      toast.success('Problem report submitted successfully!');
      fetchReports(); // Refresh the list
    } catch (err) {
      toast.error('Failed to submit report: ' + err.message);
    }
  };

  return (
    <div className="report-container">
      <div className="report-content">
        <div className="survey-section">
          <h2>Report a Problem</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>What category is the problem?</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="form-select"
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Where is this problem located?</label>
              <input 
                type="text"
                list="states-list"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="form-input"
                placeholder="Type or select a state..."
              />
              <datalist id="states-list">
                {states.map((state) => (
                  <option key={state} value={state} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="form-textarea"
                placeholder="Describe the problem briefly..."
                rows="4"
              />
            </div>

            <button type="submit" className="submit-button">
              Submit Log
            </button>
          </form>
        </div>

        <div className="logs-section">
          <h2>My Reports</h2>
          <div className="logs-container">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : reports.length === 0 ? (
              <p className="no-logs">No reports yet. Submit a report to get started.</p>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="log-card">
                  <div className="log-header">
                    <span className="log-category">{report.category}</span>
                    <span className="log-timestamp">
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="log-location">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {report.location}
                  </div>
                  <p className="log-description">{report.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}