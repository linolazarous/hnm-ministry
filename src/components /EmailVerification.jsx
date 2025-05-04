import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaTimesCircle, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { sendVerificationEmail, checkVerificationStatus } from '../../services/userService';
import useInterval from '../../hooks/useInterval';
import './EmailVerification.css';

const EmailVerification = ({ user, onVerified }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // Check verification status periodically if not verified
  useInterval(() => {
    if (!user.emailVerified && !isChecking) {
      checkVerification();
    }
  }, 30000); // Check every 30 seconds

  const checkVerification = async () => {
    setIsChecking(true);
    try {
      const updatedUser = await checkVerificationStatus(user.id);
      if (updatedUser.emailVerified && onVerified) {
        onVerified();
      }
    } catch (err) {
      console.error('Verification check failed:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await sendVerificationEmail(user.id);
      setSuccess(true);
      setCountdown(60); // 60 second cooldown
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className={`email-verification ${user.emailVerified ? 'verified' : 'unverified'}`}>
      <div className="verification-header">
        <h3>
          {user.emailVerified ? (
            <>
              <FaCheckCircle className="icon verified-icon" />
              Email Verified
            </>
          ) : (
            <>
              <FaTimesCircle className="icon unverified-icon" />
              Email Not Verified
            </>
          )}
        </h3>
      </div>

      <div className="verification-body">
        {user.emailVerified ? (
          <p className="verification-message">
            Your email address <strong>{user.email}</strong> has been successfully verified.
          </p>
        ) : (
          <>
            <p className="verification-message">
              Please verify your email address <strong>{user.email}</strong> to access all features.
            </p>
            
            <div className="verification-actions">
              <button 
                onClick={handleResend} 
                disabled={isLoading || countdown > 0}
                className="resend-button"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="icon-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                  </>
                )}
              </button>
            </div>

            <div className="verification-help">
              <p>Didn't receive the email?</p>
              <ul>
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email address</li>
                <li>Contact support if you continue having issues</li>
              </ul>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="verification-error">
          {error}
        </div>
      )}

      {success && (
        <div className="verification-success">
          <p>
            Verification email sent! Please check your inbox at <strong>{user.email}</strong>.
          </p>
          <p>
            The link will expire in 24 hours.
          </p>
        </div>
      )}
    </div>
  );
};

EmailVerification.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    emailVerified: PropTypes.bool.isRequired
  }).isRequired,
  onVerified: PropTypes.func
};

export default EmailVerification;
