import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import kartuLogo from '../../assets/Kartu.svg';
import './LoadingScreen.css';

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increment for realistic feel
        const increment = Math.floor(Math.random() * 15) + 5; 
        return Math.min(prev + increment, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setOpacity(0);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 500); // Wait for fade out
      }, 500); // Wait at 100% for a moment
    }
  }, [progress, onFinish]);

  if (opacity === 0) return null;

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
