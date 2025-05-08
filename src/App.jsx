import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import HeroSection from '@/components/HeroSection';
import DailyVerse from '@/components/DailyVerse';
import LivestreamOverlay from '@/components/LivestreamOverlay';
import CountdownTimer from '@/components/CountdownTimer';
import { useBroadcast } from '@/hooks/useBroadcast';
import { useAuth } from '@/components/AuthContext';

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingSpinner from '@/components/LoadingSpinner';

// Pages
import Profile from '@/pages/Profile';
import Livestream from '@/pages/Livestream';
import Donate from '@/admin/Donate';
import Success from '@/public/Success';
import Cancel from '@/public/Cancel';

// Context
import { AuthProvider } from '@/components/AuthContext';

// Utilities
import { initErrorTracking } from '@/lib/error-tracking';

// Global Styles
import '@/css/style.css';
import '@/css/main.scss';

// Initialize error tracking first
initErrorTracking();

function Home({ livestreamActive }) {
  const { user } = useAuth();
  const { isLive, streamDetails } = useBroadcast();
  
  const nextSundayAt9AM = new Date();
  nextSundayAt9AM.setDate(nextSundayAt9AM.getDate() + (7 - nextSundayAt9AM.getDay()) % 7);
  nextSundayAt9AM.setHours(8, 0, 0, 0); // 8AM UTC = 9AM CAT

  return (
    <div className="home-page">
      <HeroSection 
        title="Transforming Lives Through Christ"
        subtitle="John 3:16 - For God so loved the world..."
        backgroundImage="/children-home.jpg"
        ctaText={isLive ? "Join Live Service" : "Watch Sunday Service"}
        ctaLink={isLive ? "/livestream" : null}
      >
        {!isLive && (
          <div className="service-countdown">
            <h3>Next Service Starts In:</h3>
            <CountdownTimer targetDate={nextSundayAt9AM} />
          </div>
        )}
      </HeroSection>

      <section className="content-section">
        <DailyVerse showFullVerse={true} />
        
        {livestreamActive && (
          <LivestreamOverlay 
            sermonTitle={streamDetails?.title || "Sunday Worship Service"}
            preacherName={streamDetails?.preacher || "Pastor John Mundari"}
          />
        )}
      </section>

      {user && (
        <section className="user-greeting">
          <h3>Welcome back, {user.name}</h3>
          <p>Your last visit was {user.lastLogin}</p>
        </section>
      )}
    </div>
  );
}

function App() {
  const [livestreamActive, setLivestreamActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    return () => {
      AOS.refresh();
    };
  }, []);

  // Check livestream schedule
  useEffect(() => {
    const checkLivestreamSchedule = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday
      const hours = now.getHours();
      const minutes = now.getMinutes();

      const isLivestreamTime = day === 0 && hours === 8 && minutes >= 0 && minutes <= 59;
      setLivestreamActive(isLivestreamTime);
      setCurrentTime(now);
    };

    checkLivestreamSchedule();
    const timer = setInterval(checkLivestreamSchedule, 60000);

    return () => clearInterval(timer);
  }, []);

  // Simulate loading
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
    const handleRouteChange = () => {
      AOS.refresh();
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

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
}

/**
 * Stripe.js loader with proper error handling
 */
const loadStripe = async () => {
  if (window.Stripe) return window.Stripe;

  try {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    if (import.meta.env.VITE_STRIPE_KEY) {
      window.Stripe = Stripe(import.meta.env.VITE_STRIPE_KEY);
      return window.Stripe;
    }
    console.error('Stripe publishable key is missing');
    return null;
  } catch (error) {
    console.error('Failed to load Stripe.js', error);
    return null;
  }
};

/**
 * Service Worker Registration
 */
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', { 
        scope: '/' 
      });
      console.log('ServiceWorker registered with scope:', registration.scope);
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  }
};

/**
 * Main Application Initialization
 */
const initializeApp = async () => {
  try {
    const [_, stripe] = await Promise.all([
      document.readyState === 'complete' 
        ? Promise.resolve() 
        : new Promise(resolve => window.addEventListener('load', resolve)),
      loadStripe()
    ]);

    await registerServiceWorker();

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Application initialization failed:', error);
  }
};

initializeApp();

export default App;
