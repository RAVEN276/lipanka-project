import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { onAuthStateChanged, signInWithPopup, signOut, updateProfile } from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import LoadingScreen from './Components/LoadingScreen/LoadingScreen.jsx'
import Notification from './Components/Notification/Notification.jsx'

// Lazy load page components for better code splitting
const HeroPage = lazy(() => import('./HeroPage/HeroPage.jsx'))
const ThemePage = lazy(() => import('./ThemePage/ThemePage.jsx'))
const SelectTheme = lazy(() => import('./SelectTheme/SelectTheme.jsx'))
const Credits = lazy(() => import('./Credits/Credits.jsx'))
const GamePage = lazy(() => import('./GamePage/GamePage.jsx'))
const Leaderboard = lazy(() => import('./Leaderboard/Leaderboard.jsx'))
const AnswerPage = lazy(() => import('./AnswerPage/AnswerPage.jsx'))
const ScorePage = lazy(() => import('./ScorePage/ScorePage.jsx'))
const Profile = lazy(() => import('./Profile/Profile.jsx'))
const EditProfile = lazy(() => import('./EditProfile/EditProfile.jsx'))
const SignIn = lazy(() => import('./SignIn/SignIn.jsx'))
const AdminPage = lazy(() => import('./AdminPage/AdminPage.jsx'))
const EditQuestionPage = lazy(() => import('./AdminPage/EditQuestionPage.jsx'))
const GetUID = lazy(() => import('./GetUID/GetUID.jsx'))

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
      const transitionTimer = setTimeout(() => {
        setLoading(true)
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
      // Notification will show after sign in
      showNotification(`Berhasil masuk sebagai ${result.user.displayName}`)
      // Explicit navigation to ensure redirection happens if the route doesn't automatically redirect
      navigate('/')
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
      // Update displayName only; photoURL is stored in Realtime Database
      try {
      await updateProfile(user, {
        displayName: updatedData.displayName
      })
      setUser({ ...user, displayName: updatedData.displayName })
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
      
      <Suspense fallback={<LoadingScreen />}>
        <Routes location={displayLocation}>
          <Route path="/" element={<HeroPage user={user} />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* Protected Game Routes - Require Login */}
          <Route 
            path="/select-theme" 
            element={user ? <SelectTheme /> : <Navigate to="/signin" replace />} 
          />
          <Route 
            path="/theme/:themeName" 
            element={user ? <ThemePage /> : <Navigate to="/signin" replace />} 
          />
          <Route 
            path="/game/:themeName" 
            element={user ? <GamePage /> : <Navigate to="/signin" replace />} 
          />
          <Route 
            path="/answer" 
            element={user ? <AnswerPage /> : <Navigate to="/signin" replace />} 
          />
          <Route 
            path="/score" 
            element={user ? <ScorePage /> : <Navigate to="/signin" replace />} 
          />
          
          {/* Protected Profile Routes */}
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} onLogout={handleSignOut} onEdit={() => navigate('/edit-profile')} /> : <Navigate to="/signin" replace />} 
          />
          <Route 
            path="/edit-profile" 
            element={user ? <EditProfile user={user} onSave={handleUpdateProfile} onCancel={() => navigate(-1)} /> : <Navigate to="/signin" replace />} 
          />
          
          {/* Sign In Route */}
          <Route 
            path="/signin" 
            element={!user ? <SignIn onSignIn={handleSignIn} /> : <Navigate to="/profile" replace />} 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={user ? <AdminPage /> : <Navigate to="/signin" replace />} 
          />
          <Route 
            path="/admin/edit-question" 
            element={user ? <EditQuestionPage /> : <Navigate to="/signin" replace />} 
          />
          <Route 
            path="/get-uid" 
            element={user ? <GetUID /> : <Navigate to="/signin" replace />} 
          />
          
          <Route path="*" element={<HeroPage user={user} />} />
        </Routes>
      </Suspense>

      <Notification 
        message={notification.message}
        show={notification.show}
        onClose={closeNotification}
      />
    </>
  )
}

export default App
