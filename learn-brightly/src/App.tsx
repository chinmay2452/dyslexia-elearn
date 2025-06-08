import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/auth'
// import DashboardPage from './pages/dashboard'
import DyslexiaTest from './pages/DyslexiaTest'
import { ToastProvider, ToastViewport } from "./components/toast"
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dyslexia-test" element={<DyslexiaTest />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <ToastViewport />
      </ToastProvider>
    </Router>
  )
}

export default App
