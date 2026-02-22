import { useParams, useNavigate } from 'react-router-dom'
import PageBackground from '../Components/PageBackground/PageBackground'
import GlassCard from '../components/GlassCard/GlassCard'
import './ThemePage.css'
import kulinerImg from '../assets/kuliner.svg'
import musikImg from '../assets/musik.svg'
import permainanImg from '../assets/permainan.svg'
import tariImg from '../assets/tari.svg'
import borobudurImg from '../assets/borobudur.svg'

const themeData = {
  kuliner: {
    title: 'KULINER',
    description: 'Jelajahi kekayaan kuliner nusantara. Dari Sabang sampai Merauke, temukan cita rasa tradisional yang menggugah selera dan warisan budaya di setiap hidangan.',
    image: kulinerImg
  },
  musik: {
    title: 'MUSIK',
    description: 'Nikmati harmoni musik tradisional Indonesia. Dari gamelan Jawa hingga angklung Sunda, rasakan keindahan nada yang mempersatukan bangsa.',
    image: musikImg
  },
  permainan: {
    title: 'PERMAINAN',
    description: 'Mainkan permainan tradisional Indonesia yang seru dan edukatif. Lestarikan warisan nenek moyang melalui kegembiraan bermain bersama.',
    image: permainanImg
  },
  tari: {
    title: 'TARI',
    description: 'Saksikan keindahan tarian tradisional nusantara. Setiap gerakan mengisahkan cerita budaya yang turun temurun dari generasi ke generasi.',
    image: tariImg
  },
  daerah: {
    title: 'DAERAH',
    description: 'Kenali keunikan setiap daerah di Indonesia. Dari landmark bersejarah hingga keajaiban alam, jelajahi kekayaan budaya dan geografis nusantara.',
    image: borobudurImg
  }
}

function ThemePage() {
  const { themeName } = useParams()
  const navigate = useNavigate()
  
  // Fallback to kuliner if theme is invalid
  const currentTheme = themeData[themeName] || themeData.kuliner
  const validThemeName = themeData[themeName] ? themeName : 'kuliner'

  const handlePlayClick = () => {
    console.log(`Starting ${validThemeName} game...`)
    // Future: Navigate to actual game page
  }

  const handleBackClick = () => {
    navigate('/')
  }

  return (
    <PageBackground>
      <div className="theme-page">
        {/* Back button */}
        <button className="theme-back-btn" onClick={handleBackClick} aria-label="Back to Home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        <div className="theme-content">
          {/* Left side - Image */}
          <div className="theme-image-container">
            <img 
              src={currentTheme.image} 
              alt={currentTheme.title} 
              className="theme-image"
            />
          </div>

          {/* Right side - Content */}
          <div className="theme-info">
            <h1 className="theme-title">{currentTheme.title}</h1>
            <p className="theme-description">{currentTheme.description}</p>
            <GlassCard as="button" className="theme-play-btn" onClick={handlePlayClick}>
              PLAY
            </GlassCard>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

export default ThemePage
