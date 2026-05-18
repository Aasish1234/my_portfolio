import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Skills from './pages/Skills'

function App() {
  // State to control the loading screen
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate a loading delay of 2.5 seconds (2500 milliseconds)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    // Cleanup the timer
    return () => clearTimeout(timer)
  }, [])

  // 1. WHAT SHOWS WHILE LOADING
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          {/* A simple CSS spinner */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h1 className="text-xl font-semibold tracking-widest animate-pulse">LOADING PORTFOLIO...</h1>
        </div>
      </div>
    )
  }

  // 2. WHAT SHOWS AFTER LOADING FINISHES
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white font-sans">
        
        {/* Navigation Bar */}
        <nav className="flex justify-center gap-8 p-6 bg-gray-900 border-b border-gray-800">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-blue-400 transition-colors">About</Link>
          <Link to="/skills" className="hover:text-blue-400 transition-colors">Skills</Link>
        </nav>

        {/* Where the page components get rendered */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
          </Routes>
        </main>

      </div>
    </Router>
  )
}

export default App