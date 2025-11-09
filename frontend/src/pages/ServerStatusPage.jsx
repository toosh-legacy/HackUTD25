import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CITIES } from "../constants";
import "../css/ServerStatus.css";

export default function ServerStatusPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [locationStatuses, setLocationStatuses] = useState({});
  const [updatingLocation, setUpdatingLocation] = useState(null);

  useEffect(() => {
    fetchLocationStatuses();
    initializeLocations();
  }, []);

  const fetchLocationStatuses = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/server-status/locations');
      const data = await response.json();
      if (data.data) {
        setLocationStatuses(data.data);
      }
    } catch (error) {
      console.error('Error fetching location statuses:', error);
    }
  };

  const initializeLocations = async () => {
    try {
      const locationIds = CITIES.map(city => city.id);
      await fetch('http://localhost:4000/api/server-status/locations/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locationIds }),
      });
    } catch (error) {
      console.error('Error initializing locations:', error);
    }
  };

  const handleStatusChange = async (locationId, newStatus) => {
    if (!user) return;
    
    try {
      setUpdatingLocation(locationId);
      const token = await user.getIdToken();
      
      const response = await fetch(`http://localhost:4000/api/server-status/locations/${locationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchLocationStatuses();
      }
    } catch (error) {
      console.error('Error updating location status:', error);
    } finally {
      setUpdatingLocation(null);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'online') return '🟢';
    if (status === 'maintenance') return '🟠';
    if (status === 'down') return '🔴';
    return '⚪';
  };

  const getStatusText = (status) => {
    if (status === 'online') return 'Online';
    if (status === 'maintenance') return 'Maintenance';
    if (status === 'down') return 'Down';
    return 'Unknown';
  };

  const getStatusClass = (status) => {
    if (status === 'online') return 'bg-green-100 text-green-700';
    if (status === 'maintenance') return 'bg-yellow-100 text-yellow-700';
    if (status === 'down') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const groupedCities = {};
  CITIES.forEach(city => {
    if (!groupedCities[city.state]) {
      groupedCities[city.state] = [];
    }
    groupedCities[city.state].push(city);
  });

  return (
    <div className="server-status-container">
      <h1>Server Status Management by Location</h1>

      <div className="info-section" style={{ marginBottom: '2rem' }}>
        <p><strong>Real-time Updates:</strong> Changes will be visible to all users on the map immediately.</p>
        <p><strong>Location Control:</strong> Set individual status for each city location.</p>
      </div>

      <div className="locations-grid">
        {Object.keys(groupedCities).sort().map(state => (
          <div key={state} className="state-section">
            <h3 className="state-header">{state}</h3>
            <div className="city-cards">
              {groupedCities[state].map(city => {
                const status = locationStatuses[city.id]?.status || 'online';
                const isUpdating = updatingLocation === city.id;

                return (
                  <div key={city.id} className="city-card">
                    <div className="city-info">
                      <h4>{city.name}</h4>
                      <div className={`status-badge ${getStatusClass(status)}`}>
                        <span className="status-icon">{getStatusIcon(status)}</span>
                        {getStatusText(status)}
                      </div>
                    </div>

                    <div className="status-controls">
                      <button
                        onClick={() => handleStatusChange(city.id, 'online')}
                        disabled={isUpdating || status === 'online'}
                        className="status-btn status-online"
                        title="Set Online"
                      >
                        🟢 Online
                      </button>
                      <button
                        onClick={() => handleStatusChange(city.id, 'maintenance')}
                        disabled={isUpdating || status === 'maintenance'}
                        className="status-btn status-maintenance"
                        title="Set Maintenance"
                      >
                        🟠 Maintenance
                      </button>
                      <button
                        onClick={() => handleStatusChange(city.id, 'down')}
                        disabled={isUpdating || status === 'down'}
                        className="status-btn status-down"
                        title="Set Down"
                      >
                        🔴 Down
                      </button>
                    </div>

                    {isUpdating && (
                      <div className="updating-indicator">Updating...</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
