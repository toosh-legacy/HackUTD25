import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";

import { CITIES } from "../constants";
import "../css/map.css";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const getColorByStatus = (status) => {
  if (status === 'online') return '#10b981'; // green
  if (status === 'maintenance') return '#f59e0b'; // orange
  if (status === 'down') return '#ef4444'; // red
  return '#9ca3af'; // gray default
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

export default function USMap() {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([-96, 38]);
  const [hoveredBranch, setHoveredBranch] = useState(null);
  const [locationStatuses, setLocationStatuses] = useState({});

  useEffect(() => {
    fetchLocationStatuses();
    // Poll every 10 seconds for status updates
    const interval = setInterval(fetchLocationStatuses, 10000);
    return () => clearInterval(interval);
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

  const handleZoomIn = () => {
    if (zoom < 8) {
      setZoom(zoom * 1.5);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 1) {
      setZoom(zoom / 1.5);
    }
  };

  const handleMoveEnd = (position) => {
    setCenter(position.coordinates);
    setZoom(position.zoom);
  };

  return (
    <div className="map-container">
      <div className="map-controls">
        <button onClick={handleZoomIn} className="zoom-btn" title="Zoom In">
          +
        </button>
        <button onClick={handleZoomOut} className="zoom-btn" title="Zoom Out">
          −
        </button>
      </div>

      <div className="map-viewport">
        <ComposableMap projection="geoAlbersUsa">
          <ZoomableGroup zoom={zoom} center={center} onMoveEnd={handleMoveEnd}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#e8e8e8"
                    stroke="#999"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#d5d5d5", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {CITIES.map((city) => {
              const status = locationStatuses[city.id]?.status || 'online';
              return (
                <Marker key={city.id} coordinates={city.coordinates}>
                  <g>
                    <circle
                      r={hoveredBranch === city.id ? 8 : 5}
                      fill={getColorByStatus(status)}
                      stroke="#fff"
                      strokeWidth={2}
                      onMouseEnter={() => setHoveredBranch(city.id)}
                      onMouseLeave={() => setHoveredBranch(null)}
                      style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                    />

                    {hoveredBranch === city.id && (
                      <g>
                        <rect
                          x={10}
                          y={-25}
                          width={140}
                          height={55}
                          fill="#fff"
                          stroke="#E20074"
                          strokeWidth={1.5}
                          rx={4}
                        />
                        <text x={15} y={-12} style={{ fontSize: "10px", fontWeight: "bold" }}>
                          {city.name}
                        </text>
                        <text x={15} y={0} style={{ fontSize: "8px" }}>
                          Status: {getStatusIcon(status)} {getStatusText(status)}
                        </text>
                        <text x={15} y={10} style={{ fontSize: "8px" }}>
                          {city.state}
                        </text>
                      </g>
                    )}
                  </g>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <div className="map-info">
        <p>Click + drag to pan • Use zoom buttons to zoom in/out</p>
        <p>Hover over markers to see location status</p>
      </div>
    </div>
  );
}