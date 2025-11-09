import { useEffect, useState } from 'react';
import HappinessGauge from '../components/HappinessGauge';
import '../css/Home.css';

export default function Home() {
  const [overallHappiness, setOverallHappiness] = useState(50);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverallHappiness = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/feedback/average');
        const data = await response.json();
        if (data.data?.average !== undefined) {
          setOverallHappiness(data.data.average);
        }
      } catch (error) {
        console.error('Error fetching overall happiness:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverallHappiness();
    
    // Refresh every 30 seconds to keep it updated
    const interval = setInterval(fetchOverallHappiness, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">T-Mobile Customer Sentiment Analysis</h1>
        <div className="gauges-wrapper">
          <HappinessGauge 
            value={loading ? 50 : overallHappiness}
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