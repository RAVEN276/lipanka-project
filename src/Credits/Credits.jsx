import React, { useState } from 'react';
import './Credits.css';
import pageBackground from '../assets/page-background.svg';
import panji from '../assets/panji.svg';
import najla from '../assets/najla.svg';
import lintar from '../assets/lintar.svg';
import kaila from '../assets/kaila.svg';
import icha from '../assets/icha.svg';
import { useNavigate } from 'react-router-dom';

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const LinkedinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

const GithubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

const teamMembers = [
    {
        id: 1,
        name: "Panji Kurnia Akbar",
        role: "Backend Developer",
        image: panji,
        description: "Designing the logic and structure behind the scenes to ensure everything runs smoothly.",
        slogan: "Code is Poetry.",
        socials: {
            instagram: "https://www.instagram.com/pnji_krniaakbr/",
            linkedin: "https://www.linkedin.com/in/panji-kurnia-akbar-366976376/",
            github: "https://github.com/pnjikrniaakbr"
        }
    },
    {
        id: 2,
        name: "M. Lintar Arya Dwiputra",
        role: "Backend Developer",
        image: lintar,
        description: "Ensuring data integrity and server performance for the best user experience.",
        slogan: "Efficiency is Key.",
        socials: {
            instagram: "https://www.instagram.com/everon_zwei/",
            linkedin: "https://www.linkedin.com/in/m-lintar-arya-dwiputra-9b507330a/",
            github: "https://github.com/RAVEN276"
        }
    },
    {
        id: 3,
        name: "Kaila Zanita",
        role: "Frontend Developer",
        image: kaila,
        description: "Crafting beautiful and responsive interfaces that users love to interact with.",
        slogan: "Design with Passion.",
        socials: {
            instagram: "https://www.instagram.com/kailazanita/",
            linkedin: "https://www.linkedin.com/in/kaila-zanita/",
            github: "https://github.com/kailazanita"
        }
    },
    {
        id: 4,
        name: "Icha Marisa Mahmuda",
        role: "Frontend Developer",
        image: icha,
        description: "Combining aesthetics and functionality to create seamless web applications.",
        slogan: "Simplicity is the Ultimate Sophistication.",
        socials: {
            instagram: "https://www.instagram.com/ichamrsm/",
            github: "https://github.com/ichamarisamahmuda"
        }
    },
    {
        id: 5,
        name: "Raden Najla Ramadhani",
        role: "Frontend Developer",
        image: najla,
        description: "Bringing creative ideas to life through code and pixel-perfect implementation.",
        slogan: "Create to Inspire.",
        socials: {
            instagram: "https://www.instagram.com/najlarmdhnii/",
            linkedin: "https://www.linkedin.com/in/radennajlaramadhani/",
            github: "https://github.com/najlaramadhani"
        }
    }
];

function FlipCard({ member }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="flip-card-inner">
                {/* Front Side */}
                <div className="flip-card-front">
                    <div className="image-wrapper">
                        <img src={member.image} alt={member.name} className="member-photo" />
                    </div>
                    <div className="member-info">
                        <h3 className="member-name">
                            {member.name}
                        </h3>
                        <p className="member-role">{member.role}</p>
                        <span className="tap-hint">Tap to flip &rarr;</span>
                    </div>
                </div>

                {/* Back Side */}
                <div className="flip-card-back">
                    <div className="back-content">
                        <h3 className="member-name-back">
                            {member.name}
                        </h3>
                        <p className="member-slogan">"{member.slogan}"</p>
                        <p className="member-desc">{member.description}</p>
                        
                        <div className="social-links">
                            {Object.entries(member.socials).map(([platform, url]) => (
                                <a 
                                    key={platform} 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`social-btn ${platform}`}
                                    onClick={(e) => e.stopPropagation()} 
                                    title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                                >
                                    {platform === 'instagram' && <InstagramIcon />}
                                    {platform === 'linkedin' && <LinkedinIcon />}
                                    {platform === 'github' && <GithubIcon />}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Credits() {
    const navigate = useNavigate();

    // Split team members based on role
    const backendDevs = teamMembers.filter(m => m.role.includes('Backend'));
    const frontendDevs = teamMembers.filter(m => m.role.includes('Frontend'));

    return (
        <div className="credits-page">
            {/* Background */}
            <div className="background-wrapper">
                <img src={pageBackground} alt="Background" className="page-bg" />
            </div>

            <div 
                className="credits-back-button" 
                onClick={() => navigate('/')}
            >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            <div className="credits-container">
                <header className="credits-header">
                    <h1 className="credits-title">MEET THE TEAM</h1>
                    <p className="credits-subtitle">The creative minds behind Lipanka</p>
                </header>

                <div className="team-rows">
                    {/* Row 1: Backend Developers (2 people) */}
                    <div className="team-row backend-row">
                        {backendDevs.map((member) => (
                            <FlipCard key={member.id} member={member} />
                        ))}
                    </div>

                    {/* Row 2: Frontend Developers (3 people) */}
                    <div className="team-row frontend-row">
                        {frontendDevs.map((member) => (
                            <FlipCard key={member.id} member={member} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Credits