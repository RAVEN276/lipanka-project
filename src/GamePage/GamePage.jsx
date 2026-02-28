import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ref, get } from 'firebase/database'
import PageBackground from '../Components/PageBackground/PageBackground'
import GlassCard from '../Components/GlassCard/GlassCard'
import TimerBar from '../Components/TimerBar/TimerBar'
import LoadingScreen from '../Components/LoadingScreen/LoadingScreen'
import { database } from '../firebase'
import { shuffleArray } from '../utils/shuffleArray'
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
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [shuffledOptions, setShuffledOptions] = useState([])
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [gameHistory, setGameHistory] = useState([]); // Untuk menyimpan data buat AnswerPage
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [totalGameTime, setTotalGameTime] = useState(GAME_DURATION)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Audio ref
  const timerAudioRef = useRef(new Audio('/audio/timer.mp3'))

  // Configure audio looping
  useEffect(() => {
    const audio = timerAudioRef.current
    audio.loop = true
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])
  
  // Badge states
  const [score, setScore] = useState(0)
  const [doubleScoreActive, setDoubleScoreActive] = useState(false)
  const [doubleScoreUsed, setDoubleScoreUsed] = useState(false)
  const [fiftyFiftyActive, setFiftyFiftyActive] = useState(false)
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false)
  const [addTimeUsed, setAddTimeUsed] = useState(false)


  // Load questions based on theme from Realtime Database
  useEffect(() => {
    let isMounted = true

    const loadQuestions = async () => {
      const theme = themeName || 'daerah'
      
      if (isMounted) {
        setLoadingQuestions(true)
        setLoadError('')
        setGameStarted(false)

        // Reset per-game state when theme changes
        setQuestions([])
        setCurrentQuestionIndex(0)
        setSelectedAnswer(null)
        setShowResultOverlay(false)
        setIsCorrect(false)
        setScore(0)
        setGameHistory([])
        setIsTimeUp(false)
        setTimeLeft(GAME_DURATION)
        setTotalGameTime(GAME_DURATION)
        setDoubleScoreActive(false)
        setDoubleScoreUsed(false)
        setFiftyFiftyActive(false)
        setFiftyFiftyUsed(false)
        setAddTimeUsed(false)
      }

      try {
        const questionsRef = ref(database, `questions/${theme}`)
        const snapshot = await get(questionsRef)

        if (!isMounted) return

        if (!snapshot.exists()) {
          setQuestions([])
          setGameStarted(true)
          return
        }

        const rawData = snapshot.val()
        const questionList = Array.isArray(rawData)
          ? rawData
          : Object.values(rawData)

        const shuffledQuestions = shuffleArray(questionList)

        // Pre-load all images to avoid layout shift or white screens
        // Since images are now WebP (smaller), we can load them upfront
        const questionsWithImages = await Promise.all(
          shuffledQuestions.map(async (q) => {
            const shuffledOpts = shuffleArray(q.options || [])

<<<<<<< HEAD
            return {
              ...q,
              imageUrl: q.imageUrl || null,
              shuffledOptions: shuffledOpts
=======
            if (q.imageUrl) {
              return {
                ...q,
                image: imageName,
                imageUrl: q.imageUrl,
                shuffledOptions: shuffledOpts
              }
            }

            if (!imageName) {
              return {
                ...q,
                image: imageName,
                imageUrl: null,
                shuffledOptions: shuffledOpts
              }
            }

            try {
              // Try loading webp first (as requested), fallback to checking logic if needed
              // Note: Dynamic imports only work if the file actually exists at build time
              // The user said they converted "svg to webp", so we assume the file name base is the same but ext is .webp
              const img = await import(`../assets/soal/${theme}/${imageName}.webp`)
              return {
                ...q,
                image: imageName,
                imageUrl: img.default,
                shuffledOptions: shuffledOpts
              }
            } catch (error) {
              // Fallback or error handling if webp not found
              console.error(`Failed to load image for ${q.correctAnswer} (trying .webp):`, error)
              return {
                ...q,
                image: imageName,
                imageUrl: null,
                shuffledOptions: shuffledOpts
              }
>>>>>>> Panji
            }
          })
        )

        if (isMounted) {
          setQuestions(questionsWithImages)
          setGameStarted(true)
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to load questions:', error)
          setLoadError('Gagal memuat soal. Coba lagi nanti.')
        }
      } finally {
        if (isMounted) {
          setLoadingQuestions(false)
        }
      }
    }

    loadQuestions()

    return () => {
      isMounted = false
    }
  }, [themeName])

  // Handle background timer audio
  useEffect(() => {
    const audio = timerAudioRef.current
    const shouldPlay = gameStarted && !isTimeUp && !showResultOverlay && !isProcessing && timeLeft > 0

    if (shouldPlay) {
      if (audio.paused) {
        audio.play().catch(e => console.log('Background audio play error:', e))
      }
    } else {
      audio.pause()
      if (isTimeUp || timeLeft <= 0) {
        audio.currentTime = 0
      }
    }
  }, [gameStarted, isTimeUp, showResultOverlay, isProcessing, timeLeft])

  // Handle timer countdown
  const processingTimeOut = useRef(false)

  // Reset processing flag when moving to a new question
  useEffect(() => {
    processingTimeOut.current = false
  }, [currentQuestionIndex])

  useEffect(() => {
    if (loadingQuestions || isTimeUp || showResultOverlay || isProcessing || questions.length === 0) return

    if (timeLeft <= 0) {
      if (processingTimeOut.current) return
      processingTimeOut.current = true

      const currentQuestion = questions[currentQuestionIndex]
      const incorrectAudio = new Audio('/audio/incorrect.mp3')
      incorrectAudio.play().catch(e => console.error('Audio play failed', e))

      setIsCorrect(false)
      setSelectedAnswer('Waktu Habis!')

      setGameHistory(prev => {
        if (prev.some(h => h.id === currentQuestionIndex + 1)) return prev

        return [
          ...prev,
          {
            id: currentQuestionIndex + 1,
            kota: currentQuestion.correctAnswer,
            isCorrect: false,
            img: currentQuestion.imageUrl
          }
        ]
      })

      setShowResultOverlay(true)
      return
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, isTimeUp, showResultOverlay, isProcessing, currentQuestionIndex, questions, loadingQuestions])

  // When question index changes, ensuring clean slate
  useEffect(() => {
    setTimeLeft(GAME_DURATION)
    setTotalGameTime(GAME_DURATION)
    setIsTimeUp(false) // Ensure global time up flag is off for per-question timer
  }, [currentQuestionIndex])

 // Auto-progress after showing result
  // Add time to timer (for Waktu Tambahan badge)
  const handleAddTime = () => {
    if (!addTimeUsed) {
      const audio = new Audio('/audio/fragment.mp3')
      audio.play().catch(e => console.error('Audio play failed', e))

      setTimeLeft(prev => prev + 10)
      setTotalGameTime(prev => prev + 10)
      setAddTimeUsed(true)
      console.log('Added 10 seconds to timer')
    }
  }

  // Handle Score x2 badge
  const handleDoubleScoreClick = () => {
    if (!doubleScoreUsed) {
      const audio = new Audio('/audio/fragment.mp3')
      audio.play().catch(e => console.error('Audio play failed', e))

      setDoubleScoreActive(true)
      setDoubleScoreUsed(true)
      console.log('Score x2 activated')
    }
  }

  // Handle 50:50 badge
  const handleFiftyFiftyClick = () => {
    if (!fiftyFiftyUsed) {
      const audio = new Audio('/audio/fragment.mp3')
      audio.play().catch(e => console.error('Audio play failed', e))

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
        // Explicitly reset timer state before hiding overlay to prevent race condition
        // where the timer effect sees timeLeft=0 on the new question
        setTimeLeft(GAME_DURATION)
        setTotalGameTime(GAME_DURATION)
        
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
  }, [showResultOverlay, currentQuestionIndex, questions.length, navigate, score, gameHistory, themeName])

  // Shuffle answers when question changes
  useEffect(() => {
    if (questions.length === 0) return

    const currentQuestion = questions[currentQuestionIndex]
    // Options are already shuffled at load time
    setShuffledOptions(currentQuestion.shuffledOptions || [])
  }, [currentQuestionIndex, questions])

  const handleAnswerClick = (answer) => {
    if (showResultOverlay || selectedAnswer || isTimeUp || isProcessing) return;

    // Start suspense sequence
    setIsProcessing(true);
    setSelectedAnswer(answer);

    // Play drumroll sound immediately
    const drumroll = new Audio('/audio/drumroll.mp3');
    drumroll.play().catch(error => console.error('Error playing drumroll:', error));

    // Wait for 3 seconds before showing result
    setTimeout(() => {
      // Stop drumroll
      drumroll.pause();
      drumroll.currentTime = 0;

      const correctAnswer = questions[currentQuestionIndex].correctAnswer;
      const correct = answer.toUpperCase() === correctAnswer.toUpperCase();

      // Play result sound
      const audio = new Audio(correct ? '/audio/correct.mp3' : '/audio/incorrect.mp3');
      audio.play().catch(error => console.error('Error playing sound:', error));
      
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

      setIsProcessing(false);
      setShowResultOverlay(true);
    }, 3000);
  }

  const currentQuestion = questions[currentQuestionIndex]

  if (loadingQuestions) {
    // Show LoadingScreen. Duration 200 is default, we can just omit it or keep it short.
    // If we want it to "feel" complete, 200 is fine because the loading logic waits for images now.
    return <LoadingScreen />
  }

  if (loadError) {
    return <PageBackground><div className="game-loading">{loadError}</div></PageBackground>
  }

  if (!gameStarted || questions.length === 0) {
    return <PageBackground><div className="game-loading">Belum ada soal untuk tema ini.</div></PageBackground>
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
                          ? isProcessing 
                            ? 'processing-answer'
                            : isCorrect 
                              ? 'correct' 
                              : 'wrong'
                          : showResultOverlay && answer === currentQuestion.correctAnswer
                          ? 'correct-show'
                          : showResultOverlay || isProcessing
                          ? 'disabled-show'
                          : ''
                      }`}
                      onClick={() => handleAnswerClick(answer)}
                      disabled={showResultOverlay || selectedAnswer || isTimeUp || isHiddenBy50x50 || isProcessing}
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
                className={`badge badge-red ${addTimeUsed ? 'badge-used' : ''}`}
                onClick={handleAddTime}
                disabled={addTimeUsed}
                type="button"
              >
                <span className="badge-text">Waktu Tambahan</span>
                {addTimeUsed && <span className="badge-checkmark">✓</span>}
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

        {/* Suspense / Processing Overlay */}
        {isProcessing && (
          <div className="result-overlay">
            <GlassCard className="result-card suspense">
              <div className="result-inner">
                 {currentQuestion.imageUrl && (
                  <img 
                    src={currentQuestion.imageUrl} 
                    alt="Checking..." 
                    className="result-image"
                  />
                )}
                <p className="result-text">{selectedAnswer}</p>
                 <div className="result-icon-wrapper">
                  <span className="suspense-icon">?</span>
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
