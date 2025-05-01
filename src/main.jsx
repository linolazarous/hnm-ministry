import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // Optional CSS file

// Initialize Stripe outside React to make it globally available
window.Stripe = window.Stripe || null;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
