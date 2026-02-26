import { useNavigate } from 'react-router-dom'
import { useUserPhoto } from '../hooks/useUserPhoto'
import GlassCard from '../Components/GlassCard/GlassCard'
import './HeroPage.css'
import heroBackground from '../assets/hero-background.svg'
import kartuIcon from '../assets/Kartu.svg'
import pialaIcon from '../assets/Piala.svg'

function HeroPage({ user }) {
  const navigate = useNavigate()
  const livePhotoURL = useUserPhoto(user?.uid, user?.photoURL) 
  
  const handleProfileClick = () => {
    // If user exists, go to profile, otherwise handled by App protection or direct navigation
    navigate('/profile')
  }

  return (
    <div className="hero-page">
      {/* Background */}
      <img src={heroBackground} alt="Background" className="hero-bg" />

      {/* Top bar */}
      <div className="hero-topbar">
        <div className="hero-topbar-right">
          <button className="icon-btn leaderboard-btn" aria-label="Leaderboard" onClick={() => navigate('/leaderboard')}>
            <img src={pialaIcon} alt="Leaderboard" />
          </button>
          
          <button className="icon-btn profile-btn" aria-label="Profile" onClick={handleProfileClick}>
            {livePhotoURL ? (
              <img 
                src={livePhotoURL} 
                alt={user.displayName} 
                className="profile-img" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="profile-icon-default">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Center content */}
      <div className="hero-center">
            <div className="hero-title-wrapper">
            <h1 className="hero-title">LIPANKA</h1>
            <img src={kartuIcon} alt="Kartu" className="hero-kartu" />
            </div>
            <p className="hero-subtitle">
            Welcome to the Nusantara Quest!<br />
            Test your knowledge of Indonesian Culture.
            </p>
            <GlassCard as="button" className="hero-play-btn" onClick={() => navigate('/select-theme')}>PLAY</GlassCard>
      </div>
    </div>
  )
}

export default HeroPage
