import { useGlobal } from "../contexts/GlobalContext";

export default function ServerStatusPage() {
  const { serverStatus, setServerStatus, cycleServerStatus } = useGlobal();

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
            onClick={cycleServerStatus}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            {nextLabel()}
          </button>
          <button
            onClick={() => setServerStatus("down")}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Force Down
          </button>
        </div>
      </div>
    </div>
  );
}
