import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/auth'
// import DashboardPage from './pages/dashboard'
import DyslexiaTest from './pages/DyslexiaTest'
import { ToastProvider, ToastViewport } from "./components/toast"
import Dashboard from './pages/Dashboard'
import Navigation from './components/Navigation'
import Reading from './pages/Reading'
import Games from './pages/Games'
import Profile from './pages/Profile'
import DyslexiaInfo from './pages/DyslexiaInfo'
import WordMatch from './pages/WordMatch'
import SpellingHero from './pages/SpellingHero'
import StoryBuilder from './pages/StoryBuilder'
import WordBubbles from './pages/WordBubbles'

function App() {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/word-match" element={<WordMatch />} />
          <Route path="/games/spelling-hero" element={<SpellingHero />} />
          <Route path="/games/story-builder" element={<StoryBuilder />} />
          <Route path="/games/word-bubbles" element={<WordBubbles />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dyslexia" element={<DyslexiaInfo />} />
          <Route path="/dyslexia-test" element={<DyslexiaTest />} />
        </Routes>
        <ToastViewport />
        <Navigation />
      </ToastProvider>
    </Router>
  )
}

export default App
