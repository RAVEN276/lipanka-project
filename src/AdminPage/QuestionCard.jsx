import React, { useState, useEffect } from 'react';

const QuestionCard = ({ q, index, theme, onEdit, onDelete }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [loadingImg, setLoadingImg] = useState(true);

  useEffect(() => {
    let active = true;
    
    const loadImg = async () => {
      setLoadingImg(true);
      
      // Setup image source priority: 
      // 1. q.imageUrl (uploaded/external)
      // 2. q.image (local asset name)
      
      if (q.imageUrl) {
        if (active) {
          setImgSrc(q.imageUrl);
          setLoadingImg(false);
        }
        return;
      }

      if (!q.image) {
        if (active) {
          setImgSrc(null);
          setLoadingImg(false);
        }
        return;
      }

      try {
        // Try to import local asset
        // Note: This relies on Vite's dynamic import analysis
        const imageModule = await import(`../assets/soal/${theme}/${q.image}.svg`);
        if (active) {
          setImgSrc(imageModule.default);
        }
      } catch (err) {
        console.warn(`Failed to load image for ${q.image}`, err);
        if (active) setImgSrc(null);
      } finally {
        if (active) setLoadingImg(false);
      }
    };

    loadImg();

    return () => { active = false; };
  }, [q.image, q.imageUrl, theme]);

  return (
    <div className="question-item">
      <div className="question-view">
        <div className="question-header-row">
           <h3>Question #{index + 1}</h3>
           {loadingImg ? (
             <span className="img-loading">...</span>
           ) : imgSrc && (
             <div className="img-preview">
               <img src={imgSrc} alt={q.image || 'Question'} />
             </div>
           )}
        </div>
        
        <p><strong>Image Name:</strong> {q.image || '-'}</p>
        
        <p><strong>Correct:</strong> {q.correctAnswer}</p>
        <p><strong>Near:</strong> {q.nearAnswer}</p>
        <p><strong>Options:</strong> {q.options.join(', ')}</p>
        
        <div className="item-actions">
          <button className="btn-edit" onClick={() => onEdit(index)}>
            Edit
          </button>
          <button className="btn-delete" onClick={() => onDelete(index)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
