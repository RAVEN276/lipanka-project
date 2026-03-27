import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import KartuIcon from '../../assets/Kartu.svg'; // Import the SVG
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if link is active
    const isActive = (path) => location.pathname === path;

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">
                    <img src={KartuIcon} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <h2 className="logo-text">Lipanka</h2>
            </div>

            <div className="sidebar-menu">
                <div 
                    className={`menu-item ${isActive('/admin') ? 'active' : ''}`}
                    onClick={() => navigate('/admin')}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span>Manage Questions</span>
                </div>

                <div 
                    className={`menu-item ${isActive('/') ? 'active' : ''}`}
                    onClick={() => navigate('/')}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>Home Page</span>
                </div>
            </div>

            <div className="sidebar-footer">
                <div className="menu-item logout" onClick={handleSignOut}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Sign Out</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
