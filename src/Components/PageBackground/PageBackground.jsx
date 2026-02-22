import React from 'react'
import './PageBackground.css'
import pageBackgroundSvg from '../../assets/page-background.svg'

const PageBackground = ({ children }) => {
  return (
    <div className="page-background-wrapper">
      <img src={pageBackgroundSvg} alt="Background" className="page-background-img" />
      <div className="page-background-content">
        {children}
      </div>
    </div>
  )
}

export default PageBackground
