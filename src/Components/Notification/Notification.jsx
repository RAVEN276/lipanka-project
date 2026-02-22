import React, { useEffect } from 'react'
import GlassCard from '../GlassCard/GlassCard'
import './Notification.css'

const Notification = ({ message, show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  if (!show) return null

  return (
    <div className="notification-wrapper">
      <GlassCard className="notification-card">
        <div className="notification-content">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="white"/>
            <path d="M7 12L10 15L17 8" stroke="#8B7C63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="notification-message">{message}</span>
        </div>
      </GlassCard>
    </div>
  )
}

export default Notification
