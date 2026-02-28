import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import kartuLogo from '../../assets/Kartu.svg';
import './LoadingScreen.css';

const LoadingScreen = ({ onFinish, duration = 200 }) => {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        // If onFinish is provided, we can complete to 100%
        // But if there is no onFinish (meaning it's indefinitely controlled by parent mounting/unmounting), 
        // we should stall at 90-95%
        const maxProgress = onFinish ? 100 : 95;
        
        if (prev >= maxProgress) {
          if (maxProgress === 100) {
            clearInterval(interval);
            return 100;
          }
          return maxProgress; // Stall at 95%
        }
        // Random increment for realistic feel
        const increment = Math.floor(Math.random() * 15) + 5; 
        return Math.min(prev + increment, maxProgress);
      });
    }, duration);

    return () => clearInterval(interval);
  }, [duration, onFinish]);

  useEffect(() => {
    // Only proceed if onFinish is provided - meaning this component is responsible for
    // dismissing itself. If no onFinish is provided, it means the parent component
    // controls when this LoadingScreen is unmounted (e.g. data loading completes),
    // so we should NOT hide ourselves prematurely.
    if (progress === 100 && onFinish) {
      const timeout1 = setTimeout(() => {
        setOpacity(0);
        const timeout2 = setTimeout(() => {
          onFinish();
        }, 500); // Wait for fade out
        return () => clearTimeout(timeout2);
      }, 500); // Wait at 100% for a moment
      return () => clearTimeout(timeout1);
    }
  }, [progress, onFinish]);

  // Only return null if we are actively hiding ourselves via opacity AND we have an onFinish handler
  // If we don't have onFinish, we should stay visible (opacity 1) until unmounted by parent
  if (opacity === 0 && onFinish) return null;

  return (
    <div className="loading-screen" style={{ opacity }}>
      <div className="loading-content">
        <div className="spinner-container">
          <div className="spinner-ring outer"></div>
          <div className="spinner-ring inner"></div>
          <div className="logo-container">
            {/* Logo image replaces text */}
            <img src={kartuLogo} alt="LIPANKA" className="loading-logo-image" />
          </div>
        </div>
        
        <div className="loading-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}></div>
          ))}
        </div>

        <div className="loading-progress">
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
