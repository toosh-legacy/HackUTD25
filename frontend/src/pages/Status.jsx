import USMap from '../components/USMap';
import '../css/Status.css';

export default function Status() {
  return (
    <div className="status-container">
      <div className="status-content">
        <h2>Network Status Overview</h2>
        
        <div className="status-map">
          <h2 className="map-title">Coverage Map</h2>
          <USMap />
        </div>
      </div>
    </div>
  );
}