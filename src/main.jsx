import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/css/style.css'; // Using path alias
import '@/css/main.scss'; // Including your SCSS file

// Error Tracking
import { initErrorTracking } from '@/lib/error-tracking';

// Initialize error tracking
initErrorTracking();

/**
 * Initialize Stripe.js with async loading and fallback
 */
const initializeStripe = () => {
  if (!window.Stripe) {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      if (import.meta.env.VITE_STRIPE_KEY) {
        window.Stripe = Stripe(import.meta.env.VITE_STRIPE_KEY);
      } else {
        console.error('Stripe publishable key is missing');
      }
    };
    script.onerror = () => {
      console.error('Failed to load Stripe.js');
    };
    document.head.appendChild(script);
  }
};

// Initialize Stripe when DOM is loaded
if (document.readyState === 'complete') {
  initializeStripe();
} else {
  window.addEventListener('load', initializeStripe);
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
