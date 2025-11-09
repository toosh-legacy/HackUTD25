import { useState } from "react";
import { useGlobal } from "../contexts/GlobalContext";
import "../css/Announcements.css";

export default function AnnouncementsPage() {
  const { announcements, addAnnouncement } = useGlobal();
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = async () => {
    if (!newAnnouncement.title.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      await addAnnouncement({ 
        title: newAnnouncement.title.trim(), 
        message: newAnnouncement.message.trim() 
      });
      setNewAnnouncement({ title: "", message: "" });
    } catch (err) {
      setError('Failed to add announcement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="announcements-container">
      <h1>Manage Announcements</h1>

      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}

      <div className="announcement-form">
        <div className="form-group">
          <label htmlFor="announcement-title">Title</label>
          <input
            id="announcement-title"
            type="text"
            placeholder="Enter announcement title"
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
            className="form-input"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="announcement-message">Message</label>
          <textarea
            id="announcement-message"
            placeholder="Enter announcement message"
            value={newAnnouncement.message}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
            className="form-textarea"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={loading || !newAnnouncement.title.trim()}
          className="submit-button"
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Adding...
            </>
          ) : (
            'Add Announcement'
          )}
        </button>
      </div>

      <div className="announcements-list">
        {announcements.length === 0 ? (
          <div className="empty-state">
            No announcements yet. Create your first one above!
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="announcement-card">
              <h3>{a.title}</h3>
              <p>{a.message}</p>
              <p className="announcement-timestamp">
                {a.createdAt && new Date(a.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
