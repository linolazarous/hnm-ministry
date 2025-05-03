import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingSpinner from '@/components/LoadingSpinner';

// Pages
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Livestream from '@/pages/Livestream';
import Donate from '@/admin/Donate';
import Success from '@/public/Success'; // Assuming you've moved these to src
import Cancel from '@/public/Cancel';

// Context
import { AuthProvider } from '@/components/AuthContext';

const App = () => {
  const [livestreamActive, setLivestreamActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize animations and check livestream schedule
  useEffect(() => {
    AOS.init({ duration: 800 });
    checkLivestreamSchedule();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkLivestreamSchedule();
    }, 60000);

    // Simulate loading (replace with actual auth check)
    const loadApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadApp();

    return () => clearInterval(timer);
  }, []);

  const checkLivestreamSchedule = () => {
    const now = currentTime;
    const day = now.getDay(); // 0 = Sunday
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Sunday Service 10AM CAT (8AM UTC)
    if (day === 0 && hours === 8 && minutes >= 0 && minutes <= 59) {
      setLivestreamActive(true);
    } else {
      setLivestreamActive(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app">
          <Header livestreamActive={livestreamActive} />
          
          <main>
            <Routes>
              <Route path="/" element={<Home livestreamActive={livestreamActive} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/livestream" element={<Livestream />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
