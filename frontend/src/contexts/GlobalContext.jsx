import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [announcements, setAnnouncements] = useState([]);
  // serverStatus can be 'online' | 'maintenance' | 'down'
  const [serverStatus, setServerStatus] = useState("online");

  const addAnnouncement = ({ title, message }) => {
    const newAnnouncement = { id: Date.now(), title, message };
    setAnnouncements((prev) => [...prev, newAnnouncement]);
  };

  const removeAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Cycle server status: online -> maintenance -> down -> online
  const cycleServerStatus = () => {
    setServerStatus((prev) => {
      if (prev === "online") return "maintenance";
      if (prev === "maintenance") return "down";
      return "online";
    });
  };

  return (
    <GlobalContext.Provider
      value={{
  announcements,
  addAnnouncement,
  removeAnnouncement,
  serverStatus,
  setServerStatus,
  cycleServerStatus,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
