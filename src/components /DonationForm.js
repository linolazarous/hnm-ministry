import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaLock, FaDonate, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './DonationForm.css';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [donationType, setDonationType] = useState('one-time');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Predefined donation amounts
  const presetAmounts = [25, 50, 100, 250, 500];

  // Create payment intent when amount changes
  useEffect(() => {
    if (amount >= 5) {
      const createPaymentIntent = async () => {
        try {
          const response = await fetch('/.netlify/functions/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              amount: amount * 100, // Convert to cents
              currency: 'usd',
              metadata: {
                donationType,
                name,
                email
              }
            })
          });
          
          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (err) {
          console.error('Error creating payment intent:', err);
        }
      };

      createPaymentIntent();
    }
  }, [amount, donationType, name, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name,
            email
          }
        },
        receipt_email: email
      });

      if (stripeError) {
        throw stripeError;
      }

      if (paymentIntent.status === 'succeeded') {
        // Track donation in analytics
        if (window.gtag) {
          window.gtag('event', 'conversion', {
            send_to: `${process.env.REACT_APP_GA_TRACKING_ID}/donation`,
            value: amount,
            currency: 'USD',
            transaction_id: paymentIntent.id
          });
        }

        // Call success handler or redirect
        if (onSuccess) {
          onSuccess(paymentIntent);
        } else {
          navigate('/donation-success', { 
            state: { 
              amount, 
              receiptUrl: paymentIntent.receipt_url 
            } 
          });
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-form-container">
      <div className="donation-header">
        <h2><FaDonate /> Support Our Ministry</h2>
        <p>Your generous gift helps us continue our mission</p>
      </div>

      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-group">
          <label>Donation Type</label>
          <div className="donation-type-toggle">
            <button
              type="button"
              className={donationType === 'one-time' ? 'active' : ''}
              onClick={() => setDonationType('one-time')}
            >
              One-Time
            </button>
            <button
              type="button"
              className={donationType === 'monthly' ? 'active' : ''}
              onClick={() => setDonationType('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Donation Amount (USD)</label>
          <div className="amount-buttons">
            {presetAmounts.map((amt) => (
              <button
                type="button"
                key={amt}
                className={amount === amt ? 'active' : ''}
                onClick={() => setAmount(amt)}
              >
                ${amt}
              </button>
            ))}
          </div>
          <div className="custom-amount">
            <span>$</span>
            <input
              type="number"
              min="5"
              step="1"
              value={amount}
              onChange={(e) => setAmount(Math.max(5, parseInt(e.target.value) || 5))}
              placeholder="Other amount"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Payment Details</label>
          <div className="card-element-container">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="submit-button"
          disabled={!stripe || loading || !clientSecret}
        >
          {loading ? (
            <>
              <FaSpinner className="spinner" />
              Processing...
            </>
          ) : (
            <>
              <FaLock /> Donate ${amount}
            </>
          )}
        </button>

        <div className="security-notice">
          <FaLock /> Secure payment processed by Stripe
        </div>
      </form>
    </div>
  );
};

export const DonationForm = ({ onSuccess }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm onSuccess={onSuccess} />
  </Elements>
);

// PropTypes for better documentation
DonationForm.propTypes = {
  onSuccess: PropTypes.func
};

export default DonationForm;
