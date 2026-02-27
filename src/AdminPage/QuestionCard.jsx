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

      if (active) {
        setImgSrc(null);
        setLoadingImg(false);
      }
    };

    loadImg();

    return () => { active = false; };
  }, [q.image, q.imageUrl, theme]);

  return (
    <tr className="question-row">
      <td className="col-idx">{index + 1}</td>
      <td className="col-image">
           {loadingImg ? (
             <span className="img-loading">...</span>
           ) : imgSrc ? (
             <div className="img-preview-table">
               <img src={imgSrc} alt={q.image || 'Question'} />
             </div>
           ) : (
             <span className="no-image">-</span>
           )}
      </td>
      <td className="col-name"><strong>{q.image || '-'}</strong></td>
      <td className="col-correct">{q.correctAnswer}</td>
      <td className="col-near">{q.nearAnswer}</td>
      <td className="col-options">{Array.isArray(q.options) ? q.options.join(', ') : '-'}</td>
      <td className="col-actions">
        <div className="action-buttons-row">
          <button className="btn-icon btn-edit" onClick={() => onEdit(index)} title="Edit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button className="btn-icon btn-delete" onClick={() => onDelete(index)} title="Delete">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default QuestionCard;
