import React from 'react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../Components/GlassCard/GlassCard'
import PageBackground from '../Components/PageBackground/PageBackground'
import defaultAvatar from '../assets/default-avatar.svg'
import './Profile.css' 

function Profile({ user, onLogout, onEdit }) {
  const navigate = useNavigate()

  if (!user) return null

  return (
    <PageBackground>
      {/* Top Bar with Back Button */}
      <div className="profile-topbar">
        <div 
          className="profile-back-button" 
          onClick={() => navigate(-1)}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="profile-page-container">
        <h1 className="profile-title">PROFILE</h1>
        
        <GlassCard className="profile-card">
          <div className="profile-avatar-container">
            <img 
              src={user.photoURL || defaultAvatar} 
              alt={user.displayName || "User"} 
              className="profile-avatar" 
              referrerPolicy="no-referrer"
            />
          </div>
          
          <h2 className="profile-name">{user.displayName || "User Name"}</h2>
          <p className="profile-email">{user.email}</p>
          
          <div className="profile-actions">
            <button className="profile-btn-edit" onClick={onEdit}>
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
        </GlassCard>
        
      </div>
    </PageBackground>
  )
}

export default Profile
