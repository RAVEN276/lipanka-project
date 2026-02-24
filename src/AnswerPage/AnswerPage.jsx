import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import GlassCard from '../components/GlassCard/GlassCard';
import './AnswerPage.css';
import pageBg from '../assets/page-background.svg';

const AnswerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dataJawaban = location.state?.results || [];

  return (
    <div className="answer-page-container" style={{ backgroundImage: `url(${pageBg})` }}>
      
      <div className="answer-header">
        {/* Tombol kembali ke ScorePage */}
        <button className="back-arrow-btn" onClick={() => navigate(-1)}>←</button>
        <h1 className="answer-title-text">Hasil Jawaban</h1>
      </div>

      <div className="answer-list-wrapper">
        {dataJawaban.length > 0 ? (
          dataJawaban.map((item, index) => (
            <GlassCard key={index} className="glass-card-answer-item">
              <span className="item-number">{index + 1}</span>

              <div className="item-thumb-container">
                {/* Menampilkan gambar soal yang tadi dimainkan */}
                <img src={item.img} alt={`Soal ${item.id}`} />
              </div>

              <div className="city-label-badge">
                <span className="city-name-text">{item.kota}</span>
              </div>

              <div className="status-icon-container">
                {item.isCorrect ? (
                  <span className="status-icon check">✓</span>
                ) : (
                  <span className="status-icon cross">✕</span>
                )}
              </div>
            </GlassCard>
          ))
        ) : (
          <p style={{ color: 'white', textAlign: 'center' }}>Tidak ada data jawaban.</p>
        )}
      </div>
    </div>
  );
};

export default AnswerPage;