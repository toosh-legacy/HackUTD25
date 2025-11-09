import { useState } from "react";
import { useGlobal } from "../contexts/GlobalContext";

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newAnnouncement.title}
          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
          className="border p-2 rounded"
          disabled={loading}
        />
        <textarea
          placeholder="Message"
          value={newAnnouncement.message}
          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
          className="border p-2 rounded"
          disabled={loading}
        />
        <button
          onClick={handleAdd}
          disabled={loading || !newAnnouncement.title.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded w-fit hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Announcement'}
        </button>
      </div>

      <div className="space-y-2">
        {announcements.map((a) => (
          <div key={a.id} className="border p-3 rounded-lg shadow-sm">
            <h3 className="font-semibold">{a.title}</h3>
            <p className="text-gray-600 text-sm">{a.message}</p>
            <p className="text-xs text-gray-400 mt-2">
              {a.createdAt && new Date(a.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
