import { useParams, useNavigate } from 'react-router-dom'
import PageBackground from '../Components/PageBackground/PageBackground'
import GlassCard from '../components/GlassCard/GlassCard'
import './ThemePage.css'
import kulinerBg from '../assets/page-background.svg'

// Image imports from assets
import kulinerImg from '../assets/kuliner.svg'
import musikImg from '../assets/musik.svg'
import permainanImg from '../assets/permainan.svg'
import tariImg from '../assets/tari.svg'
import daerahImg from '../assets/borobudur.svg'

const themeData = {
  kuliner: {
    title: 'Kuliner Nusantara',
    description: 'Explore the delicious traditional dishes from different regions of Indonesia',
    image: kulinerImg,
  },
  musik: {
    title: 'Musik Tradisional',
    description: 'Discover the rich musical heritage and instruments of Indonesia',
    image: musikImg,
  },
  permainan: {
    title: 'Permainan Tradisional',
    description: 'Learn about traditional games and played in Indonesia',
    image: permainanImg,
  },
  tari: {
    title: 'Tari Tradisional',
    description: 'Explore the beautiful traditional dances of Indonesia',
    image: tariImg,
  },
  daerah: {
    title: 'Daerah Nusantara',
    description: 'Discover the unique regions and territories of Indonesia',
    image: daerahImg,
  },
}

function ThemePage() {
  const { themeName } = useParams()
  const navigate = useNavigate()

  // Get theme data
  const theme = themeData[themeName?.toLowerCase()]

  if (!theme) {
    return (
      <PageBackground bgImage={kulinerBg}>
        <div className="theme-page">
          <button 
            className="theme-back-btn"
            onClick={() => navigate('/')}
          >
            ← Back
          </button>
          <div className="theme-error">
            <h2>Theme not found</h2>
            <p>Please select a valid theme to continue.</p>
          </div>
        </div>
      </PageBackground>
    )
  }

  const handlePlayClick = () => {
    navigate(`/game/${themeName}`)
  }

  return (
    <PageBackground bgImage={kulinerBg}>
      <div className="theme-page">
        {/* Back Button */}
        <button 
          className="theme-back-btn"
          onClick={() => navigate('/')}
          aria-label="Back"
        >
          ←
        </button>

        {/* Main Theme Content */}
        <div className="theme-container">
          {/* Left: Theme Image */}
          <div className="theme-left">
            <div className="theme-image-card">
              <img 
                src={theme.image} 
                alt={theme.title} 
                className="theme-image"
              />
            </div>
          </div>

          {/* Right: Theme Info and Play Button */}
          <div className="theme-right">
            <h1 className="theme-title">{theme.title}</h1>
            <p className="theme-description">{theme.description}</p>
            
            <GlassCard 
              as="button" 
              className="theme-play-btn"
              onClick={handlePlayClick}
            >
              PLAY
            </GlassCard>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

export default ThemePage
