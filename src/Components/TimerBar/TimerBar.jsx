import React, { useState, useEffect } from 'react'

/**
 * TimerBar Component - Real Countdown Timer with Progress Bar
 * Progress bar fills from LEFT TO RIGHT
 * @param {number} totalTime - Total time in seconds (default: 300 = 5 minutes)
 * @param {function} onTimeUp - Callback when timer reaches 0
 * @returns {JSX.Element}
 */
const TimerBar = ({ totalTime = 60, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(totalTime)

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp()
      return
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1
        if (newTime <= 0) {
          if (onTimeUp) onTimeUp()
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, onTimeUp])

  // Calculate percentage for progress bar width
  // Bar fills from LEFT TO RIGHT as time decreases
  const percentage = (timeLeft / totalTime) * 100

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div className="fixed top-5 left-0 right-0 z-20 w-full px-10 flex justify-center">
      <div className="w-full max-w-3xl flex items-center gap-6">
        {/* Time Display */}
        <span className="text-2xl font-bold text-gray-900 whitespace-nowrap drop-shadow-sm min-w-[80px]">
          {formattedTime}
        </span>

        {/* Progress Bar Container - Full Width Track */}
        <div className="flex-1 h-3 bg-gray-400/40 rounded-full overflow-hidden shadow-md">
          {/* Progress Bar Fill - Grows from LEFT TO RIGHT */}
          <div
            className="h-full bg-black rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default TimerBar
