import React from 'react'
import './GlassCard.css'

const GlassCard = ({ children, className = '', style = {}, as = 'div', ...props }) => {
  return (
    React.createElement(as, { className: `glass-card ${className}`, style, ...props }, children)
  )
}

export default GlassCard
