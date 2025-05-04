import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';  // Using path alias (correct)
import '@/css/style.css'; // Global CSS
import '@/css/main.scss'; // Global SCSS
import { initErrorTracking } from '@/lib/error-tracking';

// Initialize error tracking first
initErrorTracking();

/**
 * Load Stripe.js asynchronously with proper error handling
 */
const loadStripe = () => {
  return new Promise((resolve) => {
    if (window.Stripe) {
      return resolve(window.Stripe);
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      if (import.meta.env.VITE_STRIPE_KEY) {
        window.Stripe = Stripe(import.meta.env.VITE_STRIPE_KEY);
        resolve(window.Stripe);
      } else {
        console.error('Stripe publishable key is missing');
        resolve(null);
      }
    };
    script.onerror = () => {
      console.error('Failed to load Stripe.js');
      resolve(null);
    };
    document.head.appendChild(script);
  });
};

/**
 * Register Service Worker with scope validation
 */
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  }
};

// DOM Content Loaded Handler
const initializeApp = async () => {
  try {
    // Parallel initialization
    await Promise.all([
      loadStripe(),
      new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve);
        }
      })
    ]);

    // Register service worker after Stripe loads
    registerServiceWorker();

    // Render React app
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Application initialization failed:', error);
  }
};

// Start the application
initializeApp();
