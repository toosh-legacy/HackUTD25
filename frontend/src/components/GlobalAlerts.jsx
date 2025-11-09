import { useGlobal } from "../contexts/GlobalContext";
import "../css/GlobalAlerts.css";

export default function GlobalAlerts() {
  const { announcements, removeAnnouncement, serverStatus } = useGlobal();

  return (
    <div className="alert-container">
      {serverStatus === "down" && (
        <div className="alert alert-error">
          🚨 Server is currently <strong>DOWN</strong>
        </div>
      )}

      {serverStatus === "maintenance" && (
        <div className="alert alert-info">
          ⚠️ Server is in <strong>MAINTENANCE</strong> mode
        </div>
      )}

      {announcements.map((a) => (
        <div key={a.id} className="alert alert-info">
          {a.title ? (<strong>📢 {a.title}: </strong>) : '📢 '}
          {a.message}
          <button className="close-btn" onClick={() => removeAnnouncement(a.id)}>✖</button>
        </div>
      ))}
    </div>
  );
}
