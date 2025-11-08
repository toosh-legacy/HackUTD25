import HappinessGauge from '../components/HappinessGauge';
import '../css/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">T-Mobile Customer Sentiment Analysis</h1>
        <div className="gauges-wrapper">
          <HappinessGauge 
            value={68} 
            label="Overall User Happiness" 
            isReadOnly={true}
          />
          <HappinessGauge 
            label="Your Happiness"
          />
        </div>
      </div>
    </div>
  );
}