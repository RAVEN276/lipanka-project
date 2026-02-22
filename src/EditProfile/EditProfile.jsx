import React, { useState, useRef } from 'react'
import GlassCard from '../components/GlassCard/GlassCard'
import { database } from '../firebase'
import { ref, set } from "firebase/database"
import './EditProfile.css'

function EditProfile({ user, onSave, onCancel }) {
  const [username, setUsername] = useState(user?.displayName || '')
  // Cek local storage (cache) dulu, kalau tidak ada baru pakai user.photoURL
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '')
  
  const fileInputRef = useRef(null)

  const handleSave = async () => {
    console.log("Saving profile...", { username, hasPhoto: !!photoURL });

    // 1. Simpan foto Base64 ke Realtime Database
    if (photoURL && photoURL.startsWith('data:image')) {
      try {
        console.log("Saving photo to database path:", 'users/' + user.uid + '/photoURL');
        const photoRef = ref(database, 'users/' + user.uid + '/photoURL');
        await set(photoRef, photoURL);
        console.log("Photo saved successfully to database");
      } catch (e) {
        console.error("GAGAL menyimpan ke Realtime Database:", e);
        alert(`Gagal menyimpan foto! Error: ${e.message}. \n\nPastikan Rules Database sudah diubah menjadi 'true' untuk write.`);
        return; // Jangan lanjut save profile kalau foto gagal
      }
    } else {
        console.log("Photo URL is not base64 or empty, skipping database upload");
    }

    // 2. Update displayName ke Firebase Auth
    // PhotoURL di object ini akan diupdate di komponen parent juga
    console.log("Updating auth profile...");
    onSave({ displayName: username, photoURL: photoURL });
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.size > 1048487) { // Limit ~1MB agar tidak membebani database
         alert("Ukuran file terlalu besar! Harap pilih gambar di bawah 1MB.")
         return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoURL(reader.result)
      }
      reader.readAsDataURL(selectedFile)
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
