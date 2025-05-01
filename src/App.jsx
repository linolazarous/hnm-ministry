import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Sermons from './pages/Sermons'
import Donate from './pages/Donate'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import ScrollToTop from './components/ScrollToTop'
import AOS from 'aos'
import 'aos/dist/aos.css'

const App = () => {
  const [livestreamActive, setLivestreamActive] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Check if current time matches livestream schedule
  useEffect(() => {
    AOS.init({ duration: 800 })
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      checkLivestreamSchedule()
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const checkLivestreamSchedule = () => {
    const now = currentTime
    const day = now.getDay() // 0 = Sunday
    const hours = now.getHours()
    const minutes = now.getMinutes()

    // Sunday Service 10AM CAT (8AM UTC)
    if (day === 0 && hours === 8 && minutes >= 0 && minutes <= 59) {
      setLivestreamActive(true)
    } else {
      setLivestreamActive(false)
    }
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Header livestreamActive={livestreamActive} />
        
        <main>
          <Routes>
            <Route path="/" element={<Home livestreamActive={livestreamActive} />} />
            <Route path="/about" element={<About />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
