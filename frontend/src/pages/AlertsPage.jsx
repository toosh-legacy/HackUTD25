import { useEffect } from "react";
import { useReports } from "../hooks/useReports";

export default function AlertsPage() {
  // Use existing reports hook to fetch recent problem reports
  const { reports, fetchReports, loading, error } = useReports();

  useEffect(() => {
    // fetch initial batch of recent reports
    fetchReports();
  }, [fetchReports]);

  const renderDate = (createdAt) => {
    if (!createdAt) return "Unknown";
    // Firestore serverTimestamp may be a Timestamp with toDate()
    if (typeof createdAt.toDate === "function") {
      return createdAt.toDate().toLocaleString();
    }
    // If it's a JS Date already
    if (createdAt instanceof Date) return createdAt.toLocaleString();
    // If it's a number (ms)
    if (typeof createdAt === 'number') return new Date(createdAt).toLocaleString();
    // fallback
    return String(createdAt);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Alert System</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Recent Problem Reports</h2>

        {loading && <p>Loading reports…</p>}
        {error && <p className="text-red-600">Error loading reports: {error}</p>}

        {!loading && reports.length === 0 && (
          <p className="no-logs">No recent problem reports.</p>
        )}

        <div className="grid gap-2">
          {reports.map((r) => (
            <div key={r.id} className="border p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{r.title || 'Untitled Report'}</h3>
                  <p className="text-gray-600 text-sm">{r.description || r.message || 'No description'}</p>
                </div>
                <div className="text-xs text-gray-500">{renderDate(r.createdAt)}</div>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <strong>Severity:</strong> {r.severity ?? 'N/A'}
                {r.latitude && r.longitude && (
                  <span className="ml-4">📍 {r.latitude.toFixed ? `${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)}` : `${r.latitude}, ${r.longitude}`}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
