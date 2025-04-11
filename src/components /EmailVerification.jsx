import { useState } from 'react';
import { sendVerificationEmail } from '../../services/userService';
import './EmailVerification.css';

const EmailVerification = ({ user, onVerified }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleResend = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await sendVerificationEmail(user.id);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="email-verification">
      <div className="verification-status">
        <span className={`status ${user.emailVerified ? 'verified' : 'unverified'}`}>
          {user.emailVerified ? 'Verified' : 'Unverified'}
        </span>
        {!user.emailVerified && (
          <button 
            onClick={handleResend} 
            disabled={isLoading}
            className="resend-button"
          >
            {isLoading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        )}
      </div>
      
      {error && <div className="verification-error">{error}</div>}
      {success && (
        <div className="verification-success">
          Verification email sent! Please check your inbox.
        </div>
      )}
    </div>
  );
};

export default EmailVerification;