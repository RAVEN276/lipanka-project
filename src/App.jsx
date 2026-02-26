import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { onAuthStateChanged, signInWithPopup, signOut, updateProfile } from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import HeroPage from './HeroPage/HeroPage.jsx'
import ThemePage from './ThemePage/ThemePage.jsx'
import SelectTheme from './SelectTheme/SelectTheme.jsx'
import Credits from './Credits/Credits.jsx'
import GamePage from './GamePage/GamePage.jsx'
import Leaderboard from './Leaderboard/Leaderboard.jsx'
import AnswerPage from './AnswerPage/AnswerPage.jsx'
import ScorePage from './ScorePage/ScorePage.jsx'
import LoadingScreen from './Components/LoadingScreen/LoadingScreen.jsx'
import Notification from './Components/Notification/Notification.jsx'
import Profile from './Profile/Profile.jsx'
import EditProfile from './EditProfile/EditProfile.jsx'
import SignIn from './SignIn/SignIn.jsx'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Auth State
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Route Transition State
  const [loading, setLoading] = useState(false)
  const [displayLocation, setDisplayLocation] = useState(location)
  
  // Notification State
  const [notification, setNotification] = useState({ show: false, message: '' })

  const showNotification = (message) => {
    setNotification({ show: true, message })
  }

  const closeNotification = () => {
    setNotification({ ...notification, show: false })
  }

  // Handle Route Transitions
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setLoading(true)
      
      // Wait for exit animation or just a delay
      const transitionTimer = setTimeout(() => {
        setDisplayLocation(location)
        
        // Wait for enter animation
        setTimeout(() => {
           setLoading(false)
        }, 800) 
      }, 500)
      
      return () => clearTimeout(transitionTimer)
    }
  }, [location, displayLocation])

  // Handle Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      showNotification(`Selamat datang, ${result.user.displayName}!`)
    } catch (error) {
      console.error("Error signing in: ", error)
      alert("Failed to sign in. Please try again.")
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      showNotification("Anda berhasil logout!")
      navigate('/')
    } catch (error) {
      console.error("Error signing out: ", error)
    }
  }

  const handleUpdateProfile = async (updatedData) => {
      if (!user) return
      // Firebase update is handled inside EditProfile via ref, but we update display name in Auth
      // Actually EditProfile props are (user, onSave, onCancel)
      try {
        await updateProfile(user, {
            displayName: updatedData.displayName,
            photoURL: updatedData.photoURL
        })
        setUser({...user, ...updatedData})
        navigate(-1)
      } catch (e) {
          console.error("Update profile failed", e)
      }
  }

  if (authLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      {loading && (
        <LoadingScreen />
      )}
      
      <Routes location={displayLocation}>
        <Route path="/" element={<HeroPage />} />
        <Route path="/select-theme" element={<SelectTheme />} />
        <Route path="/theme/:themeName" element={<ThemePage />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/game/:themeName" element={<GamePage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/answer" element={<AnswerPage />} />
        <Route path="/score" element={<ScorePage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/profile" 
          element={user ? <Profile user={user} onLogout={handleSignOut} onEdit={() => navigate('/edit-profile')} /> : <Navigate to="/signin" replace />} 
        />
        <Route 
          path="/edit-profile" 
          element={user ? <EditProfile user={user} onSave={handleUpdateProfile} onCancel={() => navigate(-1)} /> : <Navigate to="/signin" replace />} 
        />
        <Route 
          path="/signin" 
          element={!user ? <SignIn onSignIn={handleSignIn} /> : <Navigate to="/profile" replace />} 
        />
        
        <Route path="*" element={<HeroPage />} />
      </Routes>

      <Notification 
        message={notification.message}
        show={notification.show}
        onClose={closeNotification}
      />
    </>
  )
}

export default App
