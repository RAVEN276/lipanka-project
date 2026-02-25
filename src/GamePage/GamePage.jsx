import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageBackground from '../Components/PageBackground/PageBackground'
import GlassCard from '../components/GlassCard/GlassCard'
import TimerBar from '../Components/TimerBar/TimerBar'
import './GamePage.css'

const GAME_DURATION = 60 // 5 minutes in seconds

function GamePage() {
  const { themeName } = useParams()
  const navigate = useNavigate()

  // Question data
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResultOverlay, setShowResultOverlay] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [shuffledOptions, setShuffledOptions] = useState([])
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [gameHistory, setGameHistory] = useState([]); // Untuk menyimpan data buat AnswerPage
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [totalGameTime, setTotalGameTime] = useState(GAME_DURATION)
  
  // Badge states
  const [score, setScore] = useState(0)
  const [doubleScoreActive, setDoubleScoreActive] = useState(false)
  const [doubleScoreUsed, setDoubleScoreUsed] = useState(false)
  const [fiftyFiftyActive, setFiftyFiftyActive] = useState(false)
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false)


  // Load questions based on theme
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const theme = themeName || 'daerah'
        
        // Question data with individual options per question
        const questionDataMap = {
          daerah: [
            {
              image: 'bandung',
              correctAnswer: 'BANDUNG',
              nearAnswer: 'CIMAHI',
              options: ['CIMAHI', 'PURWARKATA', 'SUKABUMI', 'BANDUNG', 'DEPOK']
            },
            {
              image: 'yogyakarta',
              correctAnswer: 'YOGYAKARTA',
              nearAnswer: 'MALANG',
              options: ['MALANG', 'YOGYAKARTA', 'CILACAP', 'SOLO', 'MAGELANG']
            },
            {
              image: 'lombok',
              correctAnswer: 'LOMBOK',
              nearAnswer: 'BALI',
              options: ['LOMBOK', 'BALI', 'FLORES', 'SUMBA', 'LABUAN BAJO']
            },
            {
              image: 'bali',
              correctAnswer: 'BALI',
              nearAnswer: 'LOMBOK',
              options: ['ACEH', 'BALI', 'BANDUNG', 'SULAWESI', 'RIAU']
            },
            {
              image: 'sumatera barat',
              correctAnswer: 'SUMATERA BARAT',
              nearAnswer: 'RIAU',
              options: ['SUMATERA BARAT', 'RIAU', 'JAMBI', 'BENGKULU', 'LAMPUNG']
            }
          ],
          kuliner: [
            {
              image: 'rendang',
              correctAnswer: 'RENDANG',
              nearAnswer: 'GULAI',
              options: ['RENDANG', 'GULAI', 'SOTO', 'LUMPIA', 'SATAI']
            },
            {
              image: 'Gudeg',
              correctAnswer: 'GUDEG',
              nearAnswer: 'GADO-GADO',
              options: ['GUDEG', 'GADO-GADO', 'PERKEDEL', 'NANGKA MUDA', 'SAMBAL']
            },
            {
              image: 'pempek',
              correctAnswer: 'PEMPEK',
              nearAnswer: 'TEKWAN',
              options: ['PEMPEK', 'TEKWAN', 'KUE LAPIS', 'OLU-OLU', 'MARTABAK']
            },
            {
              image: 'satemadura',
              correctAnswer: 'SATE MADURA',
              nearAnswer: 'SATE AYAM',
              options: ['SATE MADURA', 'SATE AYAM', 'SATE KAMBING', 'SATE PADANG', 'BAKSO']
            },
            {
              image: 'nasipecel',
              correctAnswer: 'NASI PECEL',
              nearAnswer: 'NASI GORENG',
              options: ['NASI PECEL', 'NASI GORENG', 'NASI KUNING', 'NASI ULAM', 'RISOTTO']
            }
          ],
          musik: [
            {
              image: 'angklung',
              correctAnswer: 'ANGKLUNG',
              nearAnswer: 'CALUNG',
              options: ['ANGKLUNG', 'CALUNG', 'ARAMBA', 'GAMELAN', 'KOLINTANG']
            },
            {
              image: 'gong',
              correctAnswer: 'GONG',
              nearAnswer: 'GAMELAN',
              options: ['GONG', 'GAMELAN', 'TAMBORIN', 'KENDANG', 'BONANG']
            },
            {
              image: 'sasando',
              correctAnswer: 'SASANDO',
              nearAnswer: 'ALAT MUSIK PETIK',
              options: ['SASANDO', 'QANUN', 'OUD', 'ITAR', 'HARPA']
            },
            {
              image: 'tifa',
              correctAnswer: 'TIFA',
              nearAnswer: 'KENDANG',
              options: ['TIFA', 'KENDANG', 'BEDUG', 'DRUM', 'REBANA']
            },
            {
              image: 'suling',
              correctAnswer: 'SULING',
              nearAnswer: 'BAMBOO FLUTE',
              options: ['SULING', 'SERULING', 'FLUTE', 'SERUTU', 'TEROMPET']
            }
          ],
          permainan: [
            {
              image: 'kelereng',
              correctAnswer: 'KELERENG',
              nearAnswer: 'GASING',
              options: ['KETAPEL ', 'GASING', 'CONGKLAK', 'BAKIAK', 'KELERENG']
            },
            {
              image: 'bakiak',
              correctAnswer: 'BAKIAK',
              nearAnswer: 'EGRANG',
              options: ['EGRANG', 'LOMPAT TALI', 'BAKIAK', 'GASING', 'ENGKLEK']
            },
            {
              image: 'congklak',
              correctAnswer: 'CONGKLAK',
              nearAnswer: 'KELERENG',
              options: ['CONGKLAK', 'KELERENG', 'GASING', 'BAKIAK', 'EGRANG']
            },
            {
              image: 'egrang',
              correctAnswer: 'EGRANG',
              nearAnswer: 'ENGKLEK',
              options: ['GASING', 'ENGKLEK', 'KELERENG', 'EGRANG', 'BAKIAK']
            },
            {
              image: 'gasing',
              correctAnswer: 'GASING',
              nearAnswer: 'KELERENG',
              options: ['CONGKLAK', 'KELERENG', 'GASING', 'EGRANG', 'BAKIAK']
            }
          ],
          tari: [
            {
              image: 'tarisaman',
              correctAnswer: 'TARI SAMAN',
              nearAnswer: 'TARI SEUDATI',
              options: ['TARI SAMAN', 'TARI SEUDATI', 'TARI POCO-POCO', 'TARI RATOEH DUEK', 'TARI MEUSEUKAT']
            },
            {
              image: 'tarikecak',
              correctAnswer: 'TARI KECAK',
              nearAnswer: 'TARI PENDET',
              options: ['TARI KECAK', 'TARI PENDET', 'TARI BARONG', 'TARI TOPENG', 'TARI LEGONG']
            },
            {
              image: 'taripiring',
              correctAnswer: 'TARI PIRING',
              nearAnswer: 'TARI TALIPAT',
              options: ['TARI PIRING', 'TARI TALIPAT', 'TARI LAPIAN', 'TARI GANET', 'TARI RANDAI']
            },
            {
              image: 'tarimerak',
              correctAnswer: 'TARI MERAK',
              nearAnswer: 'TARI BURUNG',
              options: ['TARI MERAK', 'TARI BURUNG', 'TARI JAIPONG', 'TARI TOPENG CIREBON', 'TARI SERIMPI']
            },
            {
              image: 'tarisajojo',
              correctAnswer: 'TARI SAJOJO',
              nearAnswer: 'TARI CAKALELE',
              options: ['TARI SAJOJO', 'TARI CAKALELE', 'TARI PATUDDU', 'TARI BAMBU', 'TARI MOYO']
            }
          ]
        }

        const data = questionDataMap[theme] || questionDataMap.daerah
        
        // Import images dynamically and shuffle options once per question
        const questionsWithImages = await Promise.all(
          data.map(async (q) => {
            try {
              const img = await import(`../assets/soal/${theme}/${q.image}.svg`)
              // Shuffle options ONCE when loading
              const shuffledOpts = [...q.options].sort(() => Math.random() - 0.5)
              return {
                ...q,
                imageUrl: img.default,
                shuffledOptions: shuffledOpts
              }
            } catch (e) {
              console.error(`Failed to load image for ${q.correctAnswer}`)
              const shuffledOpts = [...q.options].sort(() => Math.random() - 0.5)
              return {
                ...q,
                imageUrl: null,
                shuffledOptions: shuffledOpts
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

  // Handle timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimeUp(true)
      console.log('Time is up!')
      return
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1
        if (newTime <= 0) {
          setIsTimeUp(true)
          console.log('Time is up!')
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  // Handle timer timeout
  const handleTimeUp = () => {
    console.log('Time is up!')
    setIsTimeUp(true)
  }


 // Auto-progress after showing result
  // Add time to timer (for Waktu Tambahan badge)
  const handleAddTime = () => {
    setTimeLeft(prev => prev + 10)
    setTotalGameTime(prev => prev + 10)
    console.log('Added 10 seconds to timer')
  }

  // Handle Score x2 badge
  const handleDoubleScoreClick = () => {
    if (!doubleScoreUsed) {
      setDoubleScoreActive(true)
      setDoubleScoreUsed(true)
      console.log('Score x2 activated')
    }
  }

  // Handle 50:50 badge
  const handleFiftyFiftyClick = () => {
    if (!fiftyFiftyUsed) {
      setFiftyFiftyActive(true)
      setFiftyFiftyUsed(true)
      console.log('50:50 activated')
    }
  }

  // Auto-redirect to ThemePage when time is up
  useEffect(() => {
    if (!isTimeUp) return

    const timer = setTimeout(() => {
      const targetTheme = themeName || 'daerah'
      navigate(`/theme/${targetTheme}`)
    }, 3000) // Show popup for 3 seconds before redirect

    return () => clearTimeout(timer)
  }, [isTimeUp, themeName, navigate])

  // Auto-progress after showing result
  useEffect(() => {
    if (!showResultOverlay) return

    const timer = setTimeout(() => {
      // Deactivate badges after answering
      setDoubleScoreActive(false)
      setFiftyFiftyActive(false)

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResultOverlay(false)
      } else {

        console.log('Game Finished')
        // halaman score
        navigate('/score', { 
          state: { 
            finalScore: score, 
            history: gameHistory,
            theme: themeName
          } 
        });
      }
    }, 1500)

    return () => clearTimeout(timer)

    // Update nilai
  }, [showResultOverlay, currentQuestionIndex, questions.length, navigate, score, gameHistory])

  // Shuffle answers when question changes
  useEffect(() => {
    if (questions.length === 0) return

    const currentQuestion = questions[currentQuestionIndex]
    // Options are already shuffled at load time
    setShuffledOptions(currentQuestion.shuffledOptions || [])
  }, [currentQuestionIndex, questions])

  const handleAnswerClick = (answer) => {
    if (showResultOverlay || selectedAnswer || isTimeUp) return;

    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    const correct = answer.toUpperCase() === correctAnswer.toUpperCase();
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    
    // Update Skor
    if (correct) {
      const pointsToAdd = doubleScoreActive ? 200 : 100;
      setScore(prev => prev + pointsToAdd); //satu soal 100 poin
    }

    // riwayat untuk AnswerPage
    setGameHistory(prev => [
      ...prev, 
      { 
        id: currentQuestionIndex + 1, 
        kota: correctAnswer, 
        isCorrect: correct, 
        img: questions[currentQuestionIndex].imageUrl 
      }
    ]);

    setShowResultOverlay(true);
  }

  const handleBack = () => {
    const targetTheme = themeName || 'daerah'
    console.log('Back clicked, navigating to:', `/theme/${targetTheme}`)
    navigate(`/theme/${targetTheme}`)
  }

  const currentQuestion = questions[currentQuestionIndex]

  if (!gameStarted || questions.length === 0) {
    return <PageBackground><div className="game-loading">Loading...</div></PageBackground>
  }

  // Apply 50:50 filtering to options
  let displayedOptions = shuffledOptions
  if (fiftyFiftyActive) {
    displayedOptions = shuffledOptions.filter(
      opt => opt === currentQuestion.correctAnswer || opt === currentQuestion.nearAnswer
    )
  }

  return (
    <PageBackground>
      <div className="game-page">
        {/* Timer Bar Component */}
        <TimerBar 
          timeLeft={timeLeft}
          totalTime={totalGameTime}
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
                {displayedOptions.map((answer, index) => {
                  // Check if this option should be hidden by 50:50
                  const isHiddenBy50x50 = fiftyFiftyActive && 
                    answer !== currentQuestion.correctAnswer && 
                    answer !== currentQuestion.nearAnswer

                  return (
                    <GlassCard
                      key={index}
                      as="button"
                      className={`answer-btn ${
                        selectedAnswer === answer 
                          ? isCorrect 
                            ? 'correct' 
                            : 'wrong'
                          : showResultOverlay && answer === currentQuestion.correctAnswer
                          ? 'correct-show'
                          : showResultOverlay
                          ? 'disabled-show'
                          : ''
                      }`}
                      onClick={() => handleAnswerClick(answer)}
                      disabled={showResultOverlay || selectedAnswer || isTimeUp || isHiddenBy50x50}
                      style={isHiddenBy50x50 ? { opacity: 0.3, pointerEvents: 'none' } : {}}
                    >
                      {answer}
                    </GlassCard>
                  )
                })}
              </div>
            </div>

            {/* Right Badge Panel */}
            <div className="badges-panel">
              <button
                className={`badge badge-red ${doubleScoreUsed ? 'badge-used' : ''}`}
                onClick={handleDoubleScoreClick}
                disabled={doubleScoreUsed}
                type="button"
              >
                <span className="badge-text">Skor × 2</span>
                {doubleScoreUsed && <span className="badge-checkmark">✓</span>}
              </button>
              <button
                className={`badge badge-red ${fiftyFiftyUsed ? 'badge-used' : ''}`}
                onClick={handleFiftyFiftyClick}
                disabled={fiftyFiftyUsed}
                type="button"
              >
                <span className="badge-text">50:50</span>
                {fiftyFiftyUsed && <span className="badge-checkmark">✓</span>}
              </button>
              <button 
                className="badge badge-green"
                onClick={handleAddTime}
                type="button"
              >
                <span className="badge-text">Waktu Tambahan</span>
              </button>
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

        {/* Time's Up Popup */}
        {isTimeUp && (
          <div className="timesup-overlay">
            <GlassCard className="timesup-card">
              <div className="timesup-inner">
                <h2 className="timesup-title">Time's Up!</h2>
                <p className="timesup-text">Thank You For Your Fun Games</p>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Bottom Progress Text & Score */}
        <div className="game-progress-text">
          <span>{currentQuestionIndex + 1} dari {questions.length}</span>
          <span className="score-display">Skor: {score}</span>
        </div>
      </div>
    </PageBackground>
  )
}

export default GamePage
