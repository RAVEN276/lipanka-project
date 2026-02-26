import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../firebase';
import { ref, get, set } from 'firebase/database';
import PageBackground from '../Components/PageBackground/PageBackground';
import GlassCard from '../Components/GlassCard/GlassCard';
import './AdminPage.css';

function AdminPage() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('daerah');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  
  // Form state untuk edit soal
  const [editForm, setEditForm] = useState({
    image: '',
    correctAnswer: '',
    nearAnswer: '',
    options: ['', '', '', '', '']
  });

  const themes = [
    { key: 'daerah', name: 'Daerah' },
    { key: 'kuliner', name: 'Kuliner' },
    { key: 'musik', name: 'Musik' },
    { key: 'permainan', name: 'Permainan' },
    { key: 'tari', name: 'Tari' }
  ];

  // Check admin authorization dari database
  useEffect(() => {
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
  }, [user, navigate]);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const questionsRef = ref(database, `questions/${selectedTheme}`);
      const snapshot = await get(questionsRef);
      
      if (snapshot.exists()) {
        setQuestions(snapshot.val());
      } else {
        // Jika belum ada di database, set kosong
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load questions: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedTheme]);

  // Load questions dari database
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleSaveQuestions = async () => {
    if (!window.confirm('Save all questions for this theme?')) return;
    
    setSaving(true);
    try {
      const questionsRef = ref(database, `questions/${selectedTheme}`);
      await set(questionsRef, questions);
      alert('Questions saved successfully!');
    } catch (error) {
      console.error('Error saving questions:', error);
      alert('Failed to save questions: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditQuestion = (index) => {
    setEditingIndex(index);
    setEditForm({ ...questions[index] });
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      image: '',
      correctAnswer: '',
      nearAnswer: '',
      options: ['', '', '', '', '']
    };
    setQuestions([...questions, newQuestion]);
    setEditingIndex(questions.length);
    setEditForm(newQuestion);
  };

  const handleDeleteQuestion = (index) => {
    if (!window.confirm('Delete this question?')) return;
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleUpdateQuestion = () => {
    const newQuestions = [...questions];
    newQuestions[editingIndex] = { ...editForm };
    setQuestions(newQuestions);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...editForm.options];
    newOptions[optionIndex] = value;
    setEditForm({ ...editForm, options: newOptions });
  };
  // Show loading while checking auth
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

  // User not authorized
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <PageBackground>
      <div className="admin-container">
        <div className="admin-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="admin-title">ADMIN - MANAGE QUESTIONS</h1>
        </div>

        <GlassCard className="admin-content">
          {/* Theme Selector */}
          <div className="theme-selector">
            <h2>Select Theme:</h2>
            <div className="theme-buttons">
              {themes.map(theme => (
                <button
                  key={theme.key}
                  className={`theme-btn ${selectedTheme === theme.key ? 'active' : ''}`}
                  onClick={() => setSelectedTheme(theme.key)}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div className="questions-section">
            <div className="section-header">
              <h2>Questions ({questions.length})</h2>
              <div className="action-buttons">
                <button className="btn-add" onClick={handleAddQuestion}>
                  + Add Question
                </button>
                <button 
                  className="btn-save" 
                  onClick={handleSaveQuestions}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save All'}
                </button>
              </div>
            </div>

            {loading ? (
              <p className="loading-text">Loading questions...</p>
            ) : questions.length === 0 ? (
              <p className="empty-text">No questions yet. Click "Add Question" to start.</p>
            ) : (
              <div className="questions-list">
                {questions.map((q, index) => (
                  <div key={index} className="question-item">
                    {editingIndex === index ? (
                      // Edit Form
                      <div className="edit-form">
                        <h3>Edit Question #{index + 1}</h3>
                        
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
                          <button className="btn-update" onClick={handleUpdateQuestion}>
                            Update
                          </button>
                          <button className="btn-cancel" onClick={handleCancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="question-view">
                        <h3>Question #{index + 1}</h3>
                        <p><strong>Image:</strong> {q.image}.svg</p>
                        <p><strong>Correct:</strong> {q.correctAnswer}</p>
                        <p><strong>Near:</strong> {q.nearAnswer}</p>
                        <p><strong>Options:</strong> {q.options.join(', ')}</p>
                        
                        <div className="item-actions">
                          <button className="btn-edit" onClick={() => handleEditQuestion(index)}>
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteQuestion(index)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </PageBackground>
  );
}

export default AdminPage;
