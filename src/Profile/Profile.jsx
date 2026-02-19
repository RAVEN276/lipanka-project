import React from 'react'
import './Profile.css' 

function Profile({ user, onLogout }) {
  if (!user) return null

  return (
    <div className="profile-page-container">
      <h1 className="profile-title">PROFILE</h1>
      
      <div className="profile-card">
        <div className="profile-avatar-container">
          <img 
            src={user.photoURL} 
            alt={user.displayName} 
            className="profile-avatar" 
            referrerPolicy="no-referrer"
          />
        </div>
        
        <h2 className="profile-name">{user.displayName || "User Name"}</h2>
        <p className="profile-email">{user.email}</p>
        
        <div className="profile-actions">
          <button className="profile-btn-edit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Edit Profile
          </button>
          
          <button className="profile-btn-logout" onClick={onLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
      
    </div>
  )
}

export default Profile
