import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, database, storage } from '../firebase';
import { ref, get, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import PageBackground from '../Components/PageBackground/PageBackground';
import GlassCard from '../Components/GlassCard/GlassCard';
import './EditQuestionPage.css';

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
        nextQuestions.push(payload);
      } else {
        nextQuestions[index] = payload;
      }

      const questionsRef = ref(database, `questions/${theme}`);
      await set(questionsRef, nextQuestions);
      alert('Question saved successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Failed to save question: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (checkingAuth) {
    return (
      <PageBackground>
        <div className="edit-question-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
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
    <PageBackground scrollable>
      <div className="edit-question-container">
        <div className="edit-question-header">
          <button className="back-btn" onClick={() => navigate('/admin')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="edit-question-title">
            {mode === 'add' ? 'ADD QUESTION' : 'EDIT QUESTION'}
          </h1>
        </div>

        <GlassCard className="edit-question-card">
          {loading ? (
            <p className="loading-text">Loading question...</p>
          ) : (
            <div className="edit-form">
              <label>
                Image Name (without .svg):
                <input
                  type="text"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  placeholder="e.g., bandung"
                />
              </label>

              <label>
                Upload Image (optional):
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files?.[0])}
                />
                {uploading && <span className="uploading-text">Uploading...</span>}
              </label>

              <label>
                Image URL (from upload):
                <input
                  type="text"
                  value={editForm.imageUrl}
                  onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </label>

              <label>
                Correct Answer:
                <input
                  type="text"
                  value={editForm.correctAnswer}
                  onChange={(e) => setEditForm({ ...editForm, correctAnswer: e.target.value })}
                  placeholder="e.g., BANDUNG"
                />
              </label>

              <label>
                Near Answer:
                <input
                  type="text"
                  value={editForm.nearAnswer}
                  onChange={(e) => setEditForm({ ...editForm, nearAnswer: e.target.value })}
                  placeholder="e.g., CIMAHI"
                />
              </label>

              <label>Options (5 choices):</label>
              {editForm.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                />
              ))}

              <div className="form-actions">
                <button className="btn-update" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button className="btn-cancel" onClick={() => navigate('/admin')}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </PageBackground>
  );
}

export default EditQuestionPage;
