import './App.css'
import heroBackground from './assets/hero-background.svg'
import kartuIcon from './assets/Kartu.svg'
import pialaIcon from './assets/Piala.svg'

function App() {
  return (
    <div className="hero-page">
      {/* Background */}
      <img src={heroBackground} alt="Background" className="hero-bg" />

      {/* Top bar */}
      <div className="hero-topbar">
        <div className="hero-topbar-right">
          {/* Leaderboard icon */}
          <button className="icon-btn leaderboard-btn" aria-label="Leaderboard">
            <img src={pialaIcon} alt="Leaderboard" />
          </button>
          
          {/* Profile icon */}
          <button className="icon-btn profile-btn" aria-label="Profile">
            <svg width="52" height="52" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="18" fill="#3b5f8a"/>
              <circle cx="18" cy="13" r="5" fill="#c4d8e2"/>
              <path d="M8 30c0-5.523 4.477-10 10-10s10 4.477 10 10" fill="#c4d8e2"/>
            </svg>
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
          Lorem ipsum dolor sit amet,<br />
          consectetur adipiscing elit.
        </p>
        <button className="hero-play-btn">PLAY</button>
      </div>
    </div>
  )
}

export default App
