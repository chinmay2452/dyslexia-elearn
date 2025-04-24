import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/auth'
import DashboardPage from './pages/dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  )
}

export default App
