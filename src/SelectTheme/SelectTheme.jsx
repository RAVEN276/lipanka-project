import './SelectTheme.css';
import pageBackground from '../assets/page-background.svg';
import tari from '../assets/tari.svg';
import permainan from '../assets/permainan.svg';
import kuliner from '../assets/kuliner.svg';
import alatmusik from '../assets/musik.svg';
import daerah from '../assets/borobudur.svg';
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';

const themes = [
    {
        name: 'Tarian Daerah',
        img: tari,
        description: 'Tarian Nusantara',
        key: 'tari'
    },
    {
        name: 'Permainan',
        img: permainan,
        description: 'Permainan Nusantara',
        key: 'permainan'
    },
    {
        name: 'Kuliner',
        img: kuliner,
        description: 'Kuliner Nusantara',
        key: 'kuliner'
    },
    {
        name: 'Alat Musik',
        img: alatmusik,
        description: 'Alat Musik Nusantara',
        key: 'musik'
    },
    {
        name: 'Daerah',
        img: daerah,
        description: 'Daerah Nusantara',
        key: 'daerah'
    },
]

function SelectTheme() {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const navigate = useNavigate();

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '120px',
        autoplay: false,
        arrows: true,
        beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerPadding: '40px',
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: false,
                    arrows: false,
                    dots: true
                }
            }
        ]
    };

    const handlePlayClick = (theme) => {
        console.log(`Selected theme: ${theme.name}`);
        navigate(`/theme/${theme.key}`);
    }

    return (
        <div className="select-theme-page">
            {/* Background */}
            <img src={pageBackground} alt="Background" className="page-bg" />
            <div className="select-theme-content">
                <div 
                    className="select-theme-back-button" 
                    onClick={() => navigate('/')}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                <h1 className="select-theme-title">SELECT YOUR THEME</h1>
                <p className="select-theme-subtitle">Have fun playing <strong>LIPANKA</strong></p>
                <div className="theme-options">
                    <Slider {...settings}>
                    {themes.map((theme, index) => (
                        <div key={index} className="select-theme-card">
                            <img src={theme.img} alt={theme.name} className="select-theme-image" />
                            <div className="select-theme-name-description-play">
                                <div className="select-theme-name-description">
                                <h2 className="select-theme-name">{theme.name}</h2>
                                <p className="select-theme-description">{theme.description}</p>
                                </div>
                                {currentSlide === index && (
                                    <button className="play-button" onClick={() => handlePlayClick(theme)}>
                                        <span className="play-icon">▶</span>
                                        <p className='play-name'>Play</p>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    </Slider>
                </div>
            </div>
        </div>
    )
}

export default SelectTheme