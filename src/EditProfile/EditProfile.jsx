import React, { useState, useRef } from 'react'
import GlassCard from '../components/GlassCard/GlassCard'
import './EditProfile.css'

function EditProfile({ user, onSave, onCancel }) {
  const [username, setUsername] = useState(user?.displayName || '')
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '')
  const fileInputRef = useRef(null)

  const handleSave = () => {
    // Logic to save profile changes
    onSave({ displayName: username, photoURL })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Use FileReader to create a preview URL
      // In a real production app, you would upload this file to Firebase Storage here
      // and get the download URL. 
      // For this prototype, we'll try to use a data URL (Base64) if it's small enough, 
      // or just assume the user handles storage elsewhere. Start with detailed logging.
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoURL(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="edit-profile-container">
      <h1 className="edit-profile-title">EDIT PROFILE</h1>
      
      <GlassCard className="edit-profile-card">
        {/* Profile Photo Section */}
        <div className="edit-photo-section">
          <div className="photo-wrapper">
             <img 
              src={photoURL || "https://via.placeholder.com/150"} 
              alt="Profile" 
              className="edit-profile-avatar" 
              referrerPolicy="no-referrer"
            />
            <div className="photo-overlay">
            </div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept="image/*"
          />

          <button className="change-photo-btn" onClick={triggerFileInput}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            Change Photo
          </button>
        </div>

        {/* Username Input Section */}
        <div className="input-group">
          <label className="input-label">Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            className="glass-input"
          />
        </div>

        {/* Action Buttons */}
        <div className="edit-actions">
          <button className="save-btn" onClick={handleSave}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}>
               <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
               <polyline points="17 21 17 13 7 13 7 21"></polyline>
               <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save Changes
          </button>
          
          <button className="cancel-btn" onClick={onCancel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}>
               <circle cx="12" cy="12" r="10"></circle>
               <line x1="15" y1="9" x2="9" y2="15"></line>
               <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            Cancel
          </button>
        </div>
      </GlassCard>
    </div>
  )
}

export default EditProfile
