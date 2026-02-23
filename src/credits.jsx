import './credits.css'
import pageBackground from './assets/page-background.svg'

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
                            <p className="member-name">Panji Kurnia Akbar</p>
                        </div>
                        <div className="member-card">
                            <p className="member-name">Mochammad Lintar Arya Dwiputra</p>
                        </div>
                    </div>
                </div>
                <div className="team-section">
                    <h2 className="team-title">Frontend Developers</h2>
                    <div className="team-members">
                        <div className="member-card">
                            <p className="member-name">Kaila Zanita</p>
                        </div>
                        <div className="member-card">
                            <p className="member-name">Icha Marisa Mahmuda</p>
                        </div>
                        <div className="member-card">
                            <p className="member-name">Raden Najla Ramadhani</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Credits