import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import GlassCard from '../Components/GlassCard/GlassCard'
import './HeroPage.css'
import heroBackground from '../assets/hero-background.svg'
import kartuIcon from '../assets/Kartu.svg'
import pialaIcon from '../assets/Piala.svg'
import defaultAvatar from '../assets/default-avatar.svg'

function HeroPage() {
  const navigate = useNavigate()
  const user = auth.currentUser 
  
  const handleProfileClick = () => {
    // If user exists, go to profile, otherwise handled by App protection or direct navigation
    navigate(user ? '/profile' : '/signin')
  }

  const handlePlayClick = () => {
    if (!user) {
      navigate('/signin')
    } else {
      navigate('/select-theme')
    }
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
            <img 
              src={user?.photoURL || defaultAvatar} 
              alt={user?.displayName || "Profile"} 
              className="profile-img" 
              referrerPolicy="no-referrer"
            />
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
            <GlassCard as="button" className="hero-play-btn" onClick={handlePlayClick}>PLAY</GlassCard>
      </div>
    </div>
  )
}

export default HeroPage
