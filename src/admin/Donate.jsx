import React, { useState } from 'react';
import StripeButton from '../components/donation/StripeButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import useDonationTiers from '../hooks/useDonationTiers';
import '../css/DonatePage.css';

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { tiers, loading, error: tiersError } = useDonationTiers();

  const handleAmountSelection = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError(null);
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && value > 0)) {
      setCustomAmount(value);
      setSelectedAmount(value ? parseInt(value) : 0);
      setError(null);
    }
  };

  const handleDonationSuccess = () => {
    setIsProcessing(false);
    // Track donation conversion
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-YOUR_TRACKING_ID/Donation',
        value: selectedAmount,
        currency: 'USD'
      });
    }
  };

  const handleDonationError = (err) => {
    setIsProcessing(false);
    setError(err.message || 'Payment failed. Please try again.');
    console.error('Donation error:', err);
  };

  if (loading) return <LoadingSpinner />;
  if (tiersError) return <ErrorMessage message="Failed to load donation options" />;

  return (
    <div className="donate-page">
      <div className="donate-header">
        <h2>Support Our Ministry</h2>
        <p>Your generous gift helps us empower generations through faith in South Sudan</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="donation-options">
        <h3>Select Donation Amount (USD)</h3>
        <div className="amount-tiers">
          {tiers.map((tier) => (
            <button
              key={tier.amount}
              className={`amount-tier ${selectedAmount === tier.amount && !customAmount ? 'selected' : ''}`}
              onClick={() => handleAmountSelection(tier.amount)}
            >
              ${tier.amount}
              {tier.label && <span className="tier-label">{tier.label}</span>}
            </button>
          ))}
        </div>

        <div className="custom-amount">
          <label htmlFor="customAmount">Or enter custom amount:</label>
          <div className="input-group">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              id="customAmount"
              min="1"
              value={customAmount}
              onChange={handleCustomAmount}
              placeholder="Other amount"
            />
          </div>
        </div>
      </div>

      <div className="donation-footer">
        <StripeButton 
          amount={selectedAmount}
          onProcessing={() => setIsProcessing(true)}
          onSuccess={handleDonationSuccess}
          onError={handleDonationError}
          disabled={selectedAmount <= 0 || isProcessing}
        />
        
        {isProcessing && (
          <div className="processing-notice">
            <LoadingSpinner size="small" />
            <span>Processing your secure donation...</span>
          </div>
        )}

        <div className="security-notice">
          <i className="fas fa-lock"></i>
          <span>Secure payment processing by Stripe</span>
        </div>
      </div>

      <div className="donation-benefits">
        <h3>How Your Donation Helps</h3>
        <ul>
          <li><i className="fas fa-child"></i> Support abandoned children</li>
          <li><i className="fas fa-bible"></i> Fund biblical education programs</li>
          <li><i className="fas fa-utensils"></i> Provide daily meals</li>
          <li><i className="fas fa-home"></i> Maintain our children's home</li>
        </ul>
      </div>
    </div>
  );
      }
