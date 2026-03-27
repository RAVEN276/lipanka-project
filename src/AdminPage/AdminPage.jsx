import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../firebase';
import { ref, get, set } from 'firebase/database';
import PageBackground from '../Components/PageBackground/PageBackground';
import GlassCard from '../Components/GlassCard/GlassCard';
import QuestionCard from './QuestionCard';
import Sidebar from '../Components/Sidebar/Sidebar'; // Improved Sidebar
import { seedQuestions } from '../data/seedQuestions';
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
    navigate('/admin/edit-question', {
      state: {
        theme: selectedTheme,
        index
      }
    });
  };

  const handleAddQuestion = () => {
    navigate('/admin/edit-question', {
      state: {
        theme: selectedTheme,
        mode: 'add'
      }
    });
  };

  const handleDeleteQuestion = (index) => {
    if (!window.confirm('Delete this question?')) return;
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleImportSeed = () => {
    if (!window.confirm('Import seed questions for this theme? This will replace current list.')) return;
    const seed = seedQuestions[selectedTheme] || [];
    setQuestions(seed);
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
    <PageBackground scrollable={false}>
      <div className="admin-layout">
        <Sidebar />
        
        <div className="admin-main-content">
          <div className="admin-content-header">
             <h1 className="admin-title">Manage Questions</h1>
             <p className="admin-subtitle">Add, edit, or remove questions for the game.</p>
          </div>

          <GlassCard className="admin-glass-panel">
            {/* Theme Selector - Horizontal Scroll on Mobile */}
            <div className="theme-tabs-container">
              <div className="theme-tabs">
                {themes.map(theme => (
                  <button
                    key={theme.key}
                    className={`theme-tab-btn ${selectedTheme === theme.key ? 'active' : ''}`}
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
                <h2>{themes.find(t => t.key === selectedTheme)?.name} Questions <span className="count-badge">{questions.length}</span></h2>
                <div className="action-buttons">
                  <button className="btn-save" onClick={handleImportSeed}>
                    Import Seed
                  </button>
                  <button 
                    className="btn-save" 
                    onClick={handleSaveQuestions}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save All'}
                  </button>
                  <button className="btn-add-new" onClick={handleAddQuestion}>
                    + Add New
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="empty-state">
                   <p>No questions found for this theme.</p>
                   <button className="btn-text" onClick={handleAddQuestion}>Click here to add one</button>
                </div>
              ) : (
                <div className="questions-table-wrapper">
                <table className="questions-table">
                  <thead>
                    <tr>
                      <th width="60" className="th-center">#</th>
                      <th width="100">Image</th>
                      <th width="180">Name</th>
                      <th width="150">Correct</th>
                      <th width="120">Near</th>
                      <th>Options</th>
                      <th width="120" className="th-right">Actions</th>
                    </tr>
                  </thead>
                    <tbody>
                      {questions.map((q, index) => (
                        <QuestionCard 
                          key={index} 
                          q={q} 
                          index={index} 
                          theme={selectedTheme} 
                          onEdit={() => handleEditQuestion(index)}
                          onDelete={() => handleDeleteQuestion(index)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageBackground>
  );
}

export default AdminPage;
