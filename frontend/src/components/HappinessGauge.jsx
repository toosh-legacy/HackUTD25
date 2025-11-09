import { useState, useEffect } from 'react';
import { useFeedback } from '../hooks/useFeedback';
import '../css/HappinessGauge.css';

export default function HappinessGauge({ onChange, label, isReadOnly = false, value }) {
  const { userFeedback, averageFeedback, submitFeedback, loading } = useFeedback();
  const [happiness, setHappiness] = useState(50);

  useEffect(() => {
    // If a value prop is provided (for overall happiness), use it
    if (value !== undefined && value !== null) {
      setHappiness(value);
    } 
    // Otherwise, use user's feedback (for personal happiness)
    else if (userFeedback?.rating) {
      setHappiness(userFeedback.rating);
    }
  }, [userFeedback, value]);
  
  const currentValue = happiness;

  const getColor = (val) => {
    if (val < 30) return '#ef4444'; // red
    if (val < 60) return '#f59e0b'; // orange
    return '#10b981'; // green
  };

  const getEmoji = (val) => {
    if (val < 20) return '💀';
    if (val < 40) return '😬';
    if (val < 60) return '😐';
    if (val < 80) return '🙂';
    return '😄';
  };

  const getLabel = (val) => {
    if (val < 20) return 'Very Sad';
    if (val < 40) return 'Sad';
    if (val < 60) return 'Neutral';
    if (val < 80) return 'Happy';
    return 'Very Happy';
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (currentValue / 100) * circumference;

  const handleChange = async (e) => {
    const newValue = Number(e.target.value);
    setHappiness(newValue);
    if (onChange) onChange(newValue);
    
    // Debounce the feedback submission
    if (!loading) {
      await submitFeedback(newValue);
    }
  };

  return (
    <div className="happiness-gauge-container">
      {label && <h3 className="gauge-title">{label}</h3>}
      <div className="gauge-svg-container">
        <svg width="200" height="200" className="gauge-svg">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="16"
            fill="none"
            className="gauge-circle-bg"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={getColor(currentValue)}
            strokeWidth="16"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="gauge-circle-progress"
          />
        </svg>
        <div className="gauge-content">
          <div className="gauge-emoji">{getEmoji(currentValue)}</div>
          <div className="gauge-percentage" style={{ color: getColor(currentValue) }}>
            {currentValue}%
          </div>
          <div className="gauge-label">{getLabel(currentValue)}</div>
        </div>
      </div>

      {!isReadOnly && (
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={currentValue}
            onChange={handleChange}
            className="slider"
            style={{
              accentColor: getColor(currentValue),
            }}
          />
          <div className="slider-labels">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  );
}