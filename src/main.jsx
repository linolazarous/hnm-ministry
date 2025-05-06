import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Main App Component
import App from '@/App';

// Global Styles
import '@/css/style.css';
import '@/css/main.scss';

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

// Utilities
import { initErrorTracking } from '@/lib/error-tracking';

// Initialize error tracking first
initErrorTracking();

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
    // Wait for DOM and Stripe to load
    const [_, stripe] = await Promise.all([
      document.readyState === 'complete' 
        ? Promise.resolve() 
        : new Promise(resolve => window.addEventListener('load', resolve)),
      loadStripe()
    ]);

    // Register service worker
    await registerServiceWorker();

    // Render the app
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Application initialization failed:', error);
    // You could render a fallback UI here if needed
  }
};

// Start the application
initializeApp();
