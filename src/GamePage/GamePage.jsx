import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageBackground from '../Components/PageBackground/PageBackground'
import GlassCard from '../components/GlassCard/GlassCard'
import TimerBar from '../Components/TimerBar/TimerBar'
import { shuffleArray } from '../utils/shuffleArray'
import './GamePage.css'

const GAME_DURATION = 60 // 5 minutes in seconds

function GamePage() {
  const { themeName } = useParams()
  const navigate = useNavigate()

  // Question data - will be loaded dynamically
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResultOverlay, setShowResultOverlay] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [shuffledOptions, setShuffledOptions] = useState([])
  const [isTimeUp, setIsTimeUp] = useState(false)

  // Load questions based on theme
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Dynamically import images from the theme folder
        const theme = themeName || 'daerah'
        
        // Create question data structure - import images from soal folder
        const questionDataMap = {
          daerah: [
            { answer: 'KOTA BANDUNG', image: 'bandung' },
            { answer: 'YOGYAKARTA', image: 'yogyakarta' },
            { answer: 'LOMBOK', image: 'lombok' },
            { answer: 'BALI', image: 'bali' },
            { answer: 'SUMATERA BARAT', image: 'sumatera barat' }
          ],
          kuliner: [
            { answer: 'RENDANG', image: 'rendang' },
            { answer: 'GUDEG', image: 'Gudeg' },
            { answer: 'PEMPEK', image: 'pempek' },
            { answer: 'SATE MADURA', image: 'satemadura' },
            { answer: 'NASI PECEL', image: 'nasipecel' }
          ],
          musik: [
            { answer: 'ANGKLUNG', image: 'angklung' },
            { answer: 'GONG', image: 'gong' },
            { answer: 'SASANDO', image: 'sasando' },
            { answer: 'TIFA', image: 'tifa' },
            { answer: 'suling', image: 'suling' }
          ],
          permainan: [
            { answer: 'ANGKLUNG', image: 'angklung' },
            { answer: 'GONG', image: 'gong' },
            { answer: 'SASANDO', image: 'sasando' },
            { answer: 'TIFA', image: 'tifa' },
            { answer: 'suling', image: 'suling' }
          ],
          tari: [
            { answer: 'TARI SAMAN', image: 'tarisaman' },
            { answer: 'TARI KECAK', image: 'tarikecak' },
            { answer: 'TARI PIRING', image: 'taripiring' },
            { answer: 'TARI MERAK', image: 'tarimerak' },
            { answer: 'TARI SAJOJO', image: 'tarisajojo' }
          ]
        }

        const data = questionDataMap[theme] || questionDataMap.daerah
        
        // Import images dynamically
        const questionsWithImages = await Promise.all(
          data.map(async (q) => {
            try {
              const img = await import(`../assets/soal/${theme}/${q.image}.svg`)
              return {
                ...q,
                imageUrl: img.default
              }
            } catch (e) {
              console.error(`Failed to load image for ${q.answer}`)
              return {
                ...q,
                imageUrl: null
              }
            }
          })
        )
        
        setQuestions(questionsWithImages)
        setGameStarted(true)
      } catch (error) {
        console.error('Failed to load questions:', error)
      }
    }

    loadQuestions()
  }, [themeName])

  // Handle timer timeout
  const handleTimeUp = () => {
    console.log('Time is up!')
    setIsTimeUp(true)
  }

  // Auto-progress after showing result
  useEffect(() => {
    if (!showResultOverlay) return

    const timer = setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResultOverlay(false)
      } else {
        console.log('Game Finished')
        // TODO: Navigate to results page
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [showResultOverlay, currentQuestionIndex, questions.length])

  // Shuffle answers when question changes
  useEffect(() => {
    if (questions.length === 0) return

    const currentQuestion = questions[currentQuestionIndex]
    const allAnswers = questions.map(q => q.answer)
    const options = allAnswers.filter((_, i) => i !== currentQuestionIndex)
    const unshuffledOptions = [currentQuestion.answer, ...options]
    const shuffled = shuffleArray(unshuffledOptions)
    
    setShuffledOptions(shuffled)
  }, [currentQuestionIndex, questions])

  const handleAnswerClick = (answer) => {
    if (showResultOverlay || selectedAnswer || isTimeUp) return

    const correct = answer.toUpperCase() === questions[currentQuestionIndex].answer
    setSelectedAnswer(answer)
    setIsCorrect(correct)
    setShowResultOverlay(true)
  }

  const handleBack = () => {
    navigate(`/theme/${themeName}`)
  }

  if (!gameStarted || questions.length === 0) {
    return <PageBackground><div className="game-loading">Loading...</div></PageBackground>
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <PageBackground>
      <div className="game-page">
        {/* Back button */}
        <button className="game-back-btn" onClick={handleBack}>←</button>

        {/* Timer Bar Component */}
        <TimerBar 
          totalTime={GAME_DURATION} 
          onTimeUp={handleTimeUp}
        />

        {/* Main Game Area */}
        <div className="game-container">
          {/* Left: Question Image */}
          <div className="game-left">
            <div className="question-card">
              {currentQuestion.imageUrl && (
                <img 
                  src={currentQuestion.imageUrl} 
                  alt="Question" 
                  className="question-image"
                />
              )}
            </div>
          </div>

          {/* Right: Answers + Badges */}
          <div className="game-right">
            {/* Answer Grid */}
            <div className="answers-wrapper">
              <div className="answers-grid">
                {shuffledOptions.map((answer, index) => (
                  <GlassCard
                    key={index}
                    as="button"
                    className={`answer-btn ${
                      selectedAnswer === answer 
                        ? isCorrect 
                          ? 'correct' 
                          : 'wrong'
                        : showResultOverlay && answer === currentQuestion.answer
                        ? 'correct-show'
                        : showResultOverlay
                        ? 'disabled-show'
                        : ''
                    }`}
                    onClick={() => handleAnswerClick(answer)}
                    disabled={showResultOverlay || selectedAnswer || isTimeUp}
                  >
                    {answer}
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Right Badge Panel */}
            <div className="badges-panel">
              <div className="badge badge-red">
                <span className="badge-text">Skor × 2</span>
              </div>
              <div className="badge badge-red">
                <span className="badge-text">50:50</span>
              </div>
              <div className="badge badge-green">
                <span className="badge-text">Waktu Tambahan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Result Overlay */}
        {showResultOverlay && (
          <div className="result-overlay">
            <GlassCard className={`result-card ${isCorrect ? 'correct' : 'wrong'}`}>
              <div className="result-inner">
                {currentQuestion.imageUrl && (
                  <img 
                    src={currentQuestion.imageUrl} 
                    alt="Result" 
                    className="result-image"
                  />
                )}
                <p className="result-text">{selectedAnswer}</p>
                <div className="result-icon-wrapper">
                  {isCorrect ? (
                    <svg className="result-icon correct" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg className="result-icon wrong" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
                      <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Bottom Progress Text */}
        <div className="game-progress-text">
          {currentQuestionIndex + 1} dari {questions.length}
        </div>
      </div>
    </PageBackground>
  )
}

export default GamePage
