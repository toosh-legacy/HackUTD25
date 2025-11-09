import { useState } from "react";
import { useGlobal } from "../contexts/GlobalContext";

export default function AnnouncementsPage() {
  const { announcements, addAnnouncement } = useGlobal();
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", message: "" });

  const handleAdd = () => {
    if (!newAnnouncement.title.trim()) return;
    addAnnouncement({ title: newAnnouncement.title.trim(), message: newAnnouncement.message.trim() });
    setNewAnnouncement({ title: "", message: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>

      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newAnnouncement.title}
          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Message"
          value={newAnnouncement.message}
          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded w-fit hover:bg-blue-700"
        >
          Add Announcement
        </button>
      </div>

      <div className="space-y-2">
        {announcements.map((a) => (
          <div key={a.id} className="border p-3 rounded-lg shadow-sm">
            <h3 className="font-semibold">{a.title}</h3>
            <p className="text-gray-600 text-sm">{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
