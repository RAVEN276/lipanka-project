import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, database, storage } from '../firebase';
import { ref, get, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import PageBackground from '../Components/PageBackground/PageBackground';
import GlassCard from '../Components/GlassCard/GlassCard';
import Sidebar from '../Components/Sidebar/Sidebar';
import './EditQuestionPage.css';
import './AdminPage.css'; // Import AdminPage styles for layout consistency

const emptyQuestion = {
  image: '',
  imageUrl: '',
  correctAnswer: '',
  nearAnswer: '',
  options: ['', '', '', '', '']
};

function EditQuestionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;

  const theme = location.state?.theme;
  const index = location.state?.index;
  const mode = location.state?.mode || 'edit';

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [editForm, setEditForm] = useState(emptyQuestion);

  const themes = [
    { key: 'daerah', name: 'Daerah' },
    { key: 'kuliner', name: 'Kuliner' },
    { key: 'musik', name: 'Musik' },
    { key: 'permainan', name: 'Permainan' },
    { key: 'tari', name: 'Tari' }
  ];

  useEffect(() => {
    if (!theme || (mode === 'edit' && typeof index !== 'number')) {
      navigate('/admin', { replace: true });
      return;
    }

    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/signin');
        return;
      }

      try {
        const adminRef = ref(database, `admins/${user.uid}`);
        const snapshot = await get(adminRef);
        if (snapshot.exists() && snapshot.val() === true) {
          setIsAdmin(true);
        } else {
          alert('Access denied. You are not authorized as admin.');
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        alert('Failed to verify admin access.');
        navigate('/');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate, theme, index, mode]);

  useEffect(() => {
    const loadQuestion = async () => {
      if (!theme) return;
      setLoading(true);
      try {
        const questionsRef = ref(database, `questions/${theme}`);
        const snapshot = await get(questionsRef);
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          const list = Array.isArray(rawData) ? rawData : Object.values(rawData);
          const normalized = list.map((q) => ({
            image: q.image || '',
            imageUrl: q.imageUrl || '',
            correctAnswer: q.correctAnswer || '',
            nearAnswer: q.nearAnswer || '',
            options: Array.isArray(q.options) ? q.options : ['', '', '', '', '']
          }));
          setQuestions(normalized);
          if (mode === 'edit') {
            setEditForm(normalized[index] || emptyQuestion);
          } else {
            setEditForm(emptyQuestion);
          }
        } else {
          setQuestions([]);
          setEditForm(emptyQuestion);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        alert('Failed to load questions: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      loadQuestion();
    }
  }, [theme, index, mode, isAdmin]);

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...editForm.options];
    newOptions[optionIndex] = value;
    setEditForm({ ...editForm, options: newOptions });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const path = `questions/${theme}/${Date.now()}_${file.name}`;
      const fileRef = storageRef(storage, path);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');

      setEditForm((prev) => ({
        ...prev,
        imageUrl: url,
        image: prev.image || nameWithoutExt
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const nextQuestions = [...questions];
      const payload = {
        ...editForm,
        options: Array.isArray(editForm.options) ? editForm.options : ['', '', '', '', ''] 
      };

      if (mode === 'add') {
        const questionsRef = ref(database, `questions/${theme}`);
        await set(questionsRef, [...questions, payload]);
      } else {
        const questionRef = ref(database, `questions/${theme}/${index}`);
        await set(questionRef, payload);
      }

      alert('Question saved successfully!');
      navigate('/admin');
    } catch (saveError) {
      console.error('Error saving question:', saveError);
      alert('Failed to save question: ' + saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  if (checkingAuth) {
    return (
      <PageBackground>
        <div className="admin-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <GlassCard>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>Verifying admin access...</p>
            </div>
          </GlassCard>
        </div>
      </PageBackground>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <PageBackground scrollable={false}>
      <div className="admin-layout">
        <Sidebar />
        
        <div className="admin-main-content">
          <div className="admin-content-header">
             <h1 className="admin-title">{mode === 'add' ? 'Add New Question' : 'Edit Question'}</h1>
             <p className="admin-subtitle">
               {themes.find(t => t.key === theme)?.name || theme} Theme
             </p>
          </div>

          <GlassCard className="admin-glass-panel edit-glass-panel">
            <div className="edit-question-content">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading question...</p>
                </div>
              ) : (
                <div className="edit-form-wrapper">
                  <div className="edit-form-grid">
                    <div className="form-column">
                      <label>
                        Image Name (without .svg)
                        <input
                          type="text"
                          value={editForm.image}
                          onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                          placeholder="e.g., bandung"
                        />
                      </label>

                      <label>
                        Upload Image (optional)
                        <div className="file-input-wrapper">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files?.[0])}
                            id="file-upload"
                            className="hidden-file-input"
                          />
                          <label htmlFor="file-upload" className="file-upload-btn">
                            {uploading ? 'Uploading...' : 'Choose File'}
                          </label>
                          {editForm.imageUrl && <span className="file-status">Image ready</span>}
                        </div>
                      </label>

                      <label>
                        Image URL
                        <input
                          type="text"
                          value={editForm.imageUrl}
                          onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                          placeholder="https://..."
                          readOnly
                          className="readonly-input"
                        />
                      </label>

                      {editForm.imageUrl && (
                        <div className="image-preview-box">
                          <img src={editForm.imageUrl} alt="Preview" />
                        </div>
                      )}
                    </div>

                    <div className="form-column">
                      <label>
                        Correct Answer
                        <input
                          type="text"
                          value={editForm.correctAnswer}
                          onChange={(e) => setEditForm({ ...editForm, correctAnswer: e.target.value })}
                          placeholder="e.g., BANDUNG"
                          className="highlight-input"
                        />
                      </label>

                      <label>
                        Near Answer
                        <input
                          type="text"
                          value={editForm.nearAnswer}
                          onChange={(e) => setEditForm({ ...editForm, nearAnswer: e.target.value })}
                          placeholder="e.g., CIMAHI"
                        />
                      </label>

                      <label>Options (5 choices)</label>
                      <div className="options-grid">
                        {editForm.options.map((opt, i) => (
                          <input
                            key={i}
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(i, e.target.value)}
                            placeholder={`Option ${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-actions-bar">
                    <button className="btn-cancel-large" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button className="btn-save-large" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageBackground>
  );
}

export default EditQuestionPage;
