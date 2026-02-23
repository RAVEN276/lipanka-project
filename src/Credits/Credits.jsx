import './Credits.css'
import pageBackground from '../assets/page-background.svg'
import panji from '../assets/panji.svg'
import najla from '../assets/najla.svg'
import lintar from '../assets/lintar.svg'
import kaila from '../assets/kaila.svg'
import icha from '../assets/icha.svg'

function Credits() {
    return (
        <div className="credits-page">
            {/* Background */}
            <img src={pageBackground} alt="Background" className="page-bg" />
            <div className="credits-content">
                <h1 className="credits-title">MEET THE TEAM</h1>
                <div className="team-section">
                    <h2 className="team-title">Backend Developers</h2>
                    <div className="team-members">
                        <div className="member-card">
                            <img src={panji} alt="Panji Kurnia Akbar" className="member-photo" />
                            <p className="member-name">Panji Kurnia Akbar</p>
                        </div>
                        <div className="member-card">
                            <img src={lintar} alt="Mochammad Lintar Arya Dwiputra" className="member-photo" />
                            <p className="member-name">M. Lintar Arya Dwiputra</p>
                        </div>
                    </div>
                </div>
                <div className="team-section">
                    <h2 className="team-title">Frontend Developers</h2>
                    <div className="team-members">
                        <div className="member-card">
                            <img src={kaila} alt="Kaila Zanita" className="member-photo" />
                            <p className="member-name">Kaila Zanita</p>
                        </div>
                        <div className="member-card">
                            <img src={icha} alt="Icha Marisa Mahmuda" className="member-photo" />
                            <p className="member-name">Icha Marisa Mahmuda</p>
                        </div>
                        <div className="member-card">
                            <img src={najla} alt="Raden Najla Ramadhani" className="member-photo" />
                            <p className="member-name">Raden Najla Ramadhani</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Credits