import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { STATES, PROBLEM_CATEGORIES } from '../constants';
import '../css/ReportProblem.css';

export default function ReportProblem() {
  const [formData, setFormData] = useState({
    category: '',
    location: '',
    description: ''
  });
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load reports when component mounts
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/reports');
      const data = await response.json();
      if (data.data) {
        setLogs(data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load previous reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.location || !formData.description.trim()) {
      toast.error('Please fill out all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.category,
          description: formData.description,
          location: formData.location,
          category: formData.category
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh the reports list
      await fetchReports();
      
      setFormData({ category: '', location: '', description: '' });
      toast.success('Problem report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report');
    } finally {
      setLoading(false);
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
                {PROBLEM_CATEGORIES.map((cat) => (
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
                {STATES.map((state) => (
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
          <h2>My Logs</h2>
          <div className="logs-container">
            {loading && logs.length === 0 ? (
              <p className="no-logs">Loading reports...</p>
            ) : logs.length === 0 ? (
              <p className="no-logs">No logs yet. Submit a report to get started.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="log-card">
                  <div className="log-header">
                    <span className="log-category">{log.title || log.category}</span>
                    <span className="log-timestamp">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : log.timestamp}
                    </span>
                  </div>
                  {log.location && (
                    <div className="log-location">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {log.location}
                    </div>
                  )}
                  <p className="log-description">{log.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}