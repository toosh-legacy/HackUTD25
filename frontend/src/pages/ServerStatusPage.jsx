import { useState } from "react";
import { useGlobal } from "../contexts/GlobalContext";

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

  const statusText = () => {
    if (serverStatus === "online") return "🟢 Online";
    if (serverStatus === "maintenance") return "🟠 Maintenance Mode";
    return "🔴 Down";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Server Status</h1>
      <div className="flex items-center gap-4">
        <div className={`px-4 py-2 rounded-lg font-semibold ${statusStyle()}`}>
          {statusText()}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCycleStatus}
            disabled={loading}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : nextLabel()}
          </button>
          <button
            onClick={handleForceDown}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Force Down
          </button>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Changes will be visible to all users in real-time.</p>
        <p className="mt-2">Note: Status updates are saved to Firebase and will persist across sessions.</p>
      </div>
    </div>
  );
}
