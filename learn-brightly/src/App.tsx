import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/auth'
// import DashboardPage from './pages/dashboard'
import DyslexiaTest from './pages/DyslexiaTest'
import { ToastProvider, ToastViewport } from "./components/toast"
import Dashboard from './pages/Dashboard'
import ParentDashboard from './pages/parentdashboard'
import Navigation from './components/Navigation'
import Reading from './pages/Reading'
import Games from './pages/Games'
import Profile from './pages/Profile'
import DyslexiaInfo from './pages/DyslexiaInfo'
import WordMatch from './pages/WordMatch'
import SpellingHero from './pages/SpellingHero'
import StoryBuilder from './pages/StoryBuilder'
import WordBubbles from './pages/WordBubbles'
import HelpSupport from './pages/HelpSupport'
import VideoSection from './components/VideoSection'
import UserTypePage from './pages/usertype'
import VerifyEmail from './pages/VerifyEmail'

function App() {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<UserTypePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/parentdashboard" element={<ParentDashboard />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/word-match" element={<WordMatch />} />
          <Route path="/games/spelling-hero" element={<SpellingHero />} />
          <Route path="/games/story-builder" element={<StoryBuilder />} />
          <Route path="/games/word-bubbles" element={<WordBubbles />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dyslexia" element={<DyslexiaInfo />} />
          <Route path="/dyslexia-test" element={<DyslexiaTest />} />
          <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/video-section" element={<VideoSection />} />
        </Routes>
        <ToastViewport />
        {/* Spacer to prevent overlap with fixed bottom Navigation */}
        <div className="h-24 md:h-20" aria-hidden="true" />
        <Navigation />
      </ToastProvider>
    </Router>
  )
}

export default App
