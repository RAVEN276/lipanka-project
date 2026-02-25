import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import HeroPage from './HeroPage/HeroPage.jsx'
import ThemePage from './ThemePage/ThemePage.jsx'
import SelectTheme from './SelectTheme/SelectTheme.jsx'
import Credits from './Credits/Credits.jsx'
import GamePage from './GamePage/GamePage.jsx'
import Leaderboard from './Leaderboard/Leaderboard.jsx'
import AnswerPage from './AnswerPage/AnswerPage.jsx'
import ScorePage from './ScorePage/ScorePage.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<HeroPage />} />
        <Route path="/select-theme" element={<SelectTheme />} />
        <Route path="/theme/:themeName" element={<ThemePage />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/game/:themeName" element={<GamePage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/answer" element={<AnswerPage />} />
        <Route path="/score" element={<ScorePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)