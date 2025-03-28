import { createApp } from 'react-dom';
import App from './components/App.jsx';
import './modules/analytics';
import './modules/prayer-request';

// Initialize Facebook SDK
window.fbAsyncInit = function() {
  FB.init({
    appId: process.env.FB_APP_ID,
    xfbml: true,
    version: 'v18.0'
  });
};

// Mount React app
createApp(App).mount('#app');