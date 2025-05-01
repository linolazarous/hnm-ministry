import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './css/styles.css'

// Initialize Stripe.js (loads asynchronously if not already loaded)
if (!window.Stripe) {
  const script = document.createElement('script')
  script.src = 'https://js.stripe.com/v3/'
  script.async = true
  script.onload = () => {
    window.Stripe = Stripe(import.meta.env.VITE_STRIPE_KEY)
  }
  document.head.appendChild(script)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
