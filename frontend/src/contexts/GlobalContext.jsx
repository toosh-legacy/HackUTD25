import { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [announcements, setAnnouncements] = useState([]);
  const [serverStatus, setServerStatus] = useState("online");
  const [loading, setLoading] = useState(true);

  // Fetch announcements from backend
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/announcements');
      const data = await response.json();
      if (data.data) {
        setAnnouncements(data.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  // Fetch server status from backend
  const fetchServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/server-status');
      const data = await response.json();
      if (data.data) {
        setServerStatus(data.data.status);
      }
    } catch (error) {
      console.error('Error fetching server status:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAnnouncements(), fetchServerStatus()]);
      setLoading(false);
    };
    loadData();

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchAnnouncements();
      fetchServerStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addAnnouncement = async ({ title, message }) => {
    try {
      const response = await fetch('http://localhost:4000/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message }),
      });
      const data = await response.json();
      if (data.data) {
        setAnnouncements((prev) => [data.data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding announcement:', error);
      throw error;
    }
  };

  const removeAnnouncement = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/announcements/${id}`, {
        method: 'DELETE',
      });
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error removing announcement:', error);
    }
  };

  const updateServerStatus = async (newStatus) => {
    try {
      const response = await fetch('http://localhost:4000/api/server-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.data) {
        setServerStatus(data.data.status);
      }
    } catch (error) {
      console.error('Error updating server status:', error);
      throw error;
    }
  };

  // Cycle server status: online -> maintenance -> down -> online
  const cycleServerStatus = async () => {
    const nextStatus = 
      serverStatus === "online" ? "maintenance" :
      serverStatus === "maintenance" ? "down" : "online";
    await updateServerStatus(nextStatus);
  };

  return (
    <GlobalContext.Provider
      value={{
        announcements,
        addAnnouncement,
        removeAnnouncement,
        serverStatus,
        setServerStatus: updateServerStatus,
        cycleServerStatus,
        loading,
        refreshData: () => {
          fetchAnnouncements();
          fetchServerStatus();
        }
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
