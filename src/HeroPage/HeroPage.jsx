import { useState, useEffect } from 'react'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup, onAuthStateChanged, updateProfile } from 'firebase/auth'
import { Routes, Route, useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard/GlassCard'
import './HeroPage.css'
import heroBackground from '../assets/hero-background.svg'
import kartuIcon from '../assets/Kartu.svg'
import pialaIcon from '../assets/Piala.svg'
import SignIn from '../SignIn/SignIn'
import Profile from '../Profile/Profile'
import EditProfile from '../EditProfile/EditProfile'
import ThemePage from '../ThemePage/ThemePage'
import GamePage from '../GamePage/GamePage'

function HeroPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleSaveProfile = async (updatedData) => {
    if (!auth.currentUser) return;

    try {
      await updateProfile(auth.currentUser, updatedData)
      // Force refresh user state
      setUser({ ...auth.currentUser, ...updatedData })
      
      console.log("Profile updated successfully")
      navigate('/profile')
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.")
    }
  }

  // Listen for auth state changes to persist login across refreshes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleLeaderboardClick = () => {
    if (!user) {
      navigate('/signin')
    } else {
      console.log("Open leaderboard")
      // Future logic for leaderboard
    }
  }

  const handleProfileClick = () => {
    if (!user) {
      navigate('/signin')
    } else {
      navigate('/profile')
    }
  }

  const handleActionClick = () => {
    if (!user) {
      navigate('/signin')
    } else {
      console.log("Proceed to game", user)
    }
  }

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      // Navigation will be handled by the user/caller or just redirection
      console.log("User signed in:", result.user)
      navigate('/') // Go back to home after sign in
    } catch (error) {
      console.error("Error signing in with Google:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      navigate('/')
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleBack = () => {
    navigate(-1) // Go back in history
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="hero-page">
      {/* Background */}
      <img src={heroBackground} alt="Background" className="hero-bg" />

      {/* Top bar */}
      <div className="hero-topbar">
        <div className="hero-topbar-right">
          {/* Leaderboard icon */}
          <button className="icon-btn leaderboard-btn" aria-label="Leaderboard" onClick={handleLeaderboardClick}>
            <img src={pialaIcon} alt="Leaderboard" />
          </button>
          
          {/* Profile icon */}
          <button className="icon-btn profile-btn" aria-label="Profile" onClick={handleProfileClick}>
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || "Profile"} 
                className="profile-img" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <svg width="52" height="52" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="18" fill="#3b5f8a"/>
                <circle cx="18" cy="13" r="5" fill="#c4d8e2"/>
                <path d="M8 30c0-5.523 4.477-10 10-10s10 4.477 10 10" fill="#c4d8e2"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Center content - Managed by Router */}
      <div className="hero-center">
        <Routes>
          <Route path="/" element={
            <>
              <div className="hero-title-wrapper">
                <h1 className="hero-title">LIPANKA</h1>
                <img src={kartuIcon} alt="Kartu" className="hero-kartu" />
              </div>
              <p className="hero-subtitle">
                Lorem ipsum dolor sit amet,<br />
                consectetur adipiscing elit.
              </p>
              <GlassCard as="button" className="hero-play-btn" onClick={handleActionClick}>PLAY</GlassCard>
            </>
          } />
          
          <Route path="/signin" element={
            <>
              <div className="hero-title-wrapper">
                <h1 className="hero-title">LIPANKA</h1>
                <img src={kartuIcon} alt="Kartu" className="hero-kartu" />
              </div>
              <SignIn onSignIn={handleSignIn} onBack={handleBack} />
            </>
          } />
          
          <Route path="/profile" element={
            /* Check user existence again just in case direct access */
            user ? (
              <Profile 
                user={user} 
                onLogout={handleLogout} 
                onEdit={() => navigate('/edit-profile')}
                onClose={() => navigate('/')} 
              />
            ) : (
               /* Redirect to signin if not logged in. Ideally inside a useEffect but this works for render logic */
               <>
                 <div className="hero-title-wrapper">
                   <h1 className="hero-title">LIPANKA</h1>
                   <img src={kartuIcon} alt="Kartu" className="hero-kartu" />
                 </div>
                 <SignIn onSignIn={handleSignIn} onBack={handleBack} />

               </>
            )
          } />

          <Route path="/edit-profile" element={
            user ? (
              <EditProfile 
                user={user} 
                onSave={handleSaveProfile} 
                onCancel={() => navigate('/profile')} 
              />
            ) : (
              <SignIn onSignIn={handleSignIn} onBack={handleBack} />
            )
          } />

          <Route path="/theme/:themeName" element={<ThemePage />} />
          
          <Route path="/game/:themeName" element={<GamePage />} />
        </Routes>
      </div>
    </div>
  )
}

export default HeroPage