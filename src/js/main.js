import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';
import { initAnalytics } from './modules/analytics';
import { initPrayerRequest } from './modules/prayer-request';
import { registerServiceWorker } from './lib/service-worker';
import { initErrorTracking } from './lib/error-tracking';
import { loadFacebookSDK } from './lib/social/facebook';
import './styles/main.css';

// Initialize core functionality
function initApp() {
  // Error tracking (Sentry)
  initErrorTracking();
  
  // Performance analytics
  initAnalytics();
  
  // Prayer request module
  initPrayerRequest();
  
  // Facebook SDK initialization
  loadFacebookSDK(process.env.FB_APP_ID);
  
  // Service worker registration
  if (process.env.NODE_ENV === 'production') {
    registerServiceWorker();
  }
}

// DOM Content Loaded handler
document.addEventListener('DOMContentLoaded', () => {
  // Initialize app features
  initApp();
  
  // Create React root
  const container = document.getElementById('app');
  const root = createRoot(container);
  
  // Render application
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});

// Web Vitals Reporting
if (process.env.NODE_ENV === 'production') {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
    }
