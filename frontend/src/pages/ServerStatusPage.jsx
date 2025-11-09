import { useState } from "react";
import { useGlobal } from "../contexts/GlobalContext";
import "../css/ServerStatus.css";

export default function ServerStatusPage() {
  const { serverStatus, setServerStatus, cycleServerStatus } = useGlobal();
  const [loading, setLoading] = useState(false);

  const handleCycleStatus = async () => {
    setLoading(true);
    try {
      await cycleServerStatus();
    } catch (error) {
      console.error('Error cycling status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceDown = async () => {
    setLoading(true);
    try {
      await setServerStatus("down");
    } catch (error) {
      console.error('Error setting status:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextLabel = () => {
    if (serverStatus === "online") return "Switch to Maintenance";
    if (serverStatus === "maintenance") return "Switch to Down";
    return "Bring Online";
  };

  const statusStyle = () => {
    if (serverStatus === "online") return "bg-green-100 text-green-700";
    if (serverStatus === "maintenance") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const statusIcon = () => {
    if (serverStatus === "online") return "🟢";
    if (serverStatus === "maintenance") return "🟠";
    return "🔴";
  };

  const statusText = () => {
    if (serverStatus === "online") return "Online";
    if (serverStatus === "maintenance") return "Maintenance Mode";
    return "Down";
  };

  return (
    <div className="server-status-container">
      <h1>Server Status Management</h1>
      
      <div className="status-display">
        <div className="status-header">
          <div className={`status-badge ${statusStyle()}`}>
            <span className="status-icon">{statusIcon()}</span>
            {statusText()}
          </div>
          
          <div className="button-group">
            <button
              onClick={handleCycleStatus}
              disabled={loading}
              className="control-button btn-primary"
            >
              {loading ? (
                <span className="loading-text">
                  <span className="loading-spinner"></span>
                  Updating...
                </span>
              ) : (
                nextLabel()
              )}
            </button>
            <button
              onClick={handleForceDown}
              disabled={loading}
              className="control-button btn-danger"
            >
              {loading ? (
                <span className="loading-text">
                  <span className="loading-spinner"></span>
                  Updating...
                </span>
              ) : (
                'Force Down'
              )}
            </button>
          </div>
        </div>

        <div className="info-section">
          <p><strong>Real-time Updates:</strong> Changes will be visible to all users immediately.</p>
          <p><strong>Persistence:</strong> Status updates are saved to Firebase and will persist across sessions.</p>
          <p><strong>Current Status:</strong> The server is currently in <strong>{statusText()}</strong> mode.</p>
        </div>
      </div>
    </div>
  );
}
