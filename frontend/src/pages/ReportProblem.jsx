import { useState } from 'react';
import { toast } from 'sonner';
import '../css/ReportProblem.css';

export default function ReportProblem() {
  const [formData, setFormData] = useState({
    category: '',
    location: '',
    description: ''
  });
  
  const [logs, setLogs] = useState([]);

  const categories = [
    'Mobile Phone',
    '5G Home Internet',
    'No Signal',
    'Website',
    'TV Streaming',
    'Total Blackout',
    'Texting',
    'T-Life App',
    'Mobile Internet',
    'Mobile App',
    'Email'
  ];

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.location || !formData.description.trim()) {
      toast.error('Please fill out all fields');
      return;
    }

    const newLog = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toLocaleString()
    };

    setLogs([newLog, ...logs]);
    setFormData({ category: '', location: '', description: '' });
    toast.success('Problem report submitted successfully!');
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
            {logs.length === 0 ? (
              <p className="no-logs">No logs yet. Submit a report to get started.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="log-card">
                  <div className="log-header">
                    <span className="log-category">{log.category}</span>
                    <span className="log-timestamp">{log.timestamp}</span>
                  </div>
                  <div className="log-location">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {log.location}
                  </div>
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