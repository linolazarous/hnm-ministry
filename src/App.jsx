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
import Success from '@/public/Success';
import Cancel from '@/public/Cancel';

// Context
import { AuthProvider } from '@/components/AuthContext';

const App = () => {
  const [livestreamActive, setLivestreamActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aosInitialized, setAosInitialized] = useState(false);

  // Initialize animations with proper configuration
  useEffect(() => {
    try {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
      setAosInitialized(true);
    } catch (err) {
      console.error('AOS initialization failed:', err);
      setError('Animation system failed to load');
    }
  }, []);

  // Check livestream schedule
  useEffect(() => {
    const checkLivestreamSchedule = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Sunday Service 10AM CAT (8AM UTC)
      const isLivestreamTime = day === 0 && hours === 8 && minutes >= 0 && minutes <= 59;
      setLivestreamActive(isLivestreamTime);
      setCurrentTime(now);
    };

    checkLivestreamSchedule();
    const timer = setInterval(checkLivestreamSchedule, 60000);

    return () => clearInterval(timer);
  }, []);

  // Simulate loading (replace with actual auth check)
  useEffect(() => {
    const loadApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load application');
        setLoading(false);
      }
    };

    loadApp();
  }, []);

  // Refresh AOS when route changes
  useEffect(() => {
    if (aosInitialized) {
      AOS.refresh();
    }
  }, [window.location.pathname]);

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
