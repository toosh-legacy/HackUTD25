import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";

import { ZoomIn, ZoomOut } from "lucide-react";
import "../css/map.css";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const branches = [
  { id: '1', name: 'Seattle HQ', state: 'WA', coordinates: [-122.3321, 47.6062], happinessPercent: 92, employees: 2500 },
  { id: '2', name: 'Bellevue Campus', state: 'WA', coordinates: [-122.2015, 47.6101], happinessPercent: 89, employees: 1800 },
  { id: '3', name: 'Portland Branch', state: 'OR', coordinates: [-122.6765, 45.5231], happinessPercent: 85, employees: 950 },
  { id: '4', name: 'San Francisco', state: 'CA', coordinates: [-122.4194, 37.7749], happinessPercent: 88, employees: 1600 },
  { id: '5', name: 'Los Angeles', state: 'CA', coordinates: [-118.2437, 34.0522], happinessPercent: 82, employees: 2200 },
  { id: '6', name: 'San Diego', state: 'CA', coordinates: [-117.1611, 32.7157], happinessPercent: 86, employees: 1100 },
  { id: '7', name: 'Phoenix', state: 'AZ', coordinates: [-112.0740, 33.4484], happinessPercent: 79, employees: 890 },
  { id: '8', name: 'Denver', state: 'CO', coordinates: [-104.9903, 39.7392], happinessPercent: 90, employees: 1400 },
  { id: '9', name: 'Austin', state: 'TX', coordinates: [-97.7431, 30.2672], happinessPercent: 91, employees: 1750 },
  { id: '10', name: 'Dallas', state: 'TX', coordinates: [-96.7970, 32.7767], happinessPercent: 87, employees: 1950 },
  { id: '11', name: 'Houston', state: 'TX', coordinates: [-95.3698, 29.7604], happinessPercent: 84, employees: 1650 },
  { id: '12', name: 'Minneapolis', state: 'MN', coordinates: [-93.2650, 44.9778], happinessPercent: 88, employees: 1200 },
  { id: '13', name: 'Chicago', state: 'IL', coordinates: [-87.6298, 41.8781], happinessPercent: 85, employees: 2100 },
  { id: '14', name: 'Kansas City', state: 'MO', coordinates: [-94.5786, 39.0997], happinessPercent: 83, employees: 780 },
  { id: '15', name: 'Atlanta', state: 'GA', coordinates: [-84.3880, 33.7490], happinessPercent: 89, employees: 1850 },
  { id: '16', name: 'Miami', state: 'FL', coordinates: [-80.1918, 25.7617], happinessPercent: 81, employees: 1450 },
  { id: '17', name: 'Orlando', state: 'FL', coordinates: [-81.3792, 28.5383], happinessPercent: 83, employees: 920 },
  { id: '18', name: 'Charlotte', state: 'NC', coordinates: [-80.8431, 35.2271], happinessPercent: 86, employees: 1100 },
  { id: '19', name: 'Washington DC', state: 'DC', coordinates: [-77.0369, 38.9072], happinessPercent: 87, employees: 1680 },
  { id: '20', name: 'Philadelphia', state: 'PA', coordinates: [-75.1652, 39.9526], happinessPercent: 84, employees: 1320 },
  { id: '21', name: 'New York', state: 'NY', coordinates: [-74.0060, 40.7128], happinessPercent: 90, employees: 3200 },
  { id: '22', name: 'Boston', state: 'MA', coordinates: [-71.0589, 42.3601], happinessPercent: 91, employees: 1580 },
  { id: '23', name: 'Detroit', state: 'MI', coordinates: [-83.0458, 42.3314], happinessPercent: 80, employees: 890 },
  { id: '24', name: 'Nashville', state: 'TN', coordinates: [-86.7816, 36.1627], happinessPercent: 88, employees: 1050 },
  { id: '25', name: 'Las Vegas', state: 'NV', coordinates: [-115.1398, 36.1699], happinessPercent: 82, employees: 750 },
];

const getColorByHappiness = (happinessPercent) => {
  if (happinessPercent >= 90) return '#E20074';
  if (happinessPercent >= 85) return '#E7258E';
  if (happinessPercent >= 80) return '#F24CAE';
  if (happinessPercent >= 75) return '#F772C8';
  return '#FCA8DC';
};

export default function USMap() {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([-96, 38]);
  const [hoveredBranch, setHoveredBranch] = useState(null);

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
      <div className="map-header">
        <h1>T-Mobile Employee Happiness Index</h1>
        <p>Branches across the United States</p>
      </div>

      <div className="map-controls">
        <button onClick={handleZoomIn} className="zoom-btn">
          <ZoomIn size={20} />
        </button>
        <button onClick={handleZoomOut} className="zoom-btn">
          <ZoomOut size={20} />
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

            {branches.map((branch) => (
              <Marker key={branch.id} coordinates={branch.coordinates}>
                <g>
                  <circle
                    r={hoveredBranch === branch.id ? 8 : 5}
                    fill={getColorByHappiness(branch.happinessPercent)}
                    stroke="#fff"
                    strokeWidth={2}
                    onMouseEnter={() => setHoveredBranch(branch.id)}
                    onMouseLeave={() => setHoveredBranch(null)}
                    style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                  />

                  {hoveredBranch === branch.id && (
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
                        {branch.name}
                      </text>
                      <text x={15} y={0} style={{ fontSize: "8px" }}>
                        Happiness: {branch.happinessPercent}%
                      </text>
                      <text x={15} y={10} style={{ fontSize: "8px" }}>
                        Employees: {branch.employees.toLocaleString()}
                      </text>
                    </g>
                  )}
                </g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <div className="map-info">
        <p>Click + drag to pan • Use zoom buttons to zoom in/out</p>
        <p>Hover over markers to see branch details</p>
      </div>
    </div>
  );
}