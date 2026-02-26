import React from 'react';
import { auth } from '../firebase';
import PageBackground from '../Components/PageBackground/PageBackground';
import GlassCard from '../Components/GlassCard/GlassCard';
import './GetUID.css';

/**
 * Helper page to get your User ID for admin setup
 * Use this ONCE to get your UID, then add it to Firebase Database
 * After setup, you can delete this component
 */
function GetUID() {
  const user = auth.currentUser;

  const copyToClipboard = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      alert('UID copied to clipboard!');
    }
  };

  if (!user) {
    return (
      <PageBackground>
        <div className="getuid-container">
          <GlassCard>
            <div className="getuid-content">
              <h1>Get Your UID</h1>
              <p>Please sign in first to see your User ID</p>
            </div>
          </GlassCard>
        </div>
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <div className="getuid-container">
        <GlassCard>
          <div className="getuid-content">
            <h1>Your User ID (UID)</h1>
            <p className="uid-display">{user.uid}</p>
            
            <button className="copy-btn" onClick={copyToClipboard}>
              Copy UID
            </button>

            <div className="instructions">
              <h2>Next Steps:</h2>
              <ol>
                <li>Copy your UID above</li>
                <li>Go to Firebase Console → Realtime Database</li>
                <li>Add this data manually:
                  <pre>
                    admins/{'\n'}
                    {'  '}{user.uid}: true
                  </pre>
                </li>
                <li>Save and try accessing /admin page</li>
              </ol>
              
              <p className="warning">
                ⚠️ After setup, you can delete this GetUID component from your project.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageBackground>
  );
}

export default GetUID;
