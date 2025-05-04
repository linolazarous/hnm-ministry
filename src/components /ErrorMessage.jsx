import React from 'react';
import PropTypes from 'prop-types';
import { 
  FaExclamationCircle, 
  FaRedo, 
  FaTimes,
  FaInfoCircle
} from 'react-icons/fa';
import './ErrorMessage.css';

const ErrorMessage = ({ 
  message, 
  onRetry, 
  onDismiss,
  severity = 'error',
  className = '',
  retryText = 'Try Again',
  dismissText = 'Dismiss',
  showIcon = true
}) => {
  const getSeverityClass = () => {
    switch (severity) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'error';
    }
  };

  const getIcon = () => {
    switch (severity) {
      case 'warning':
        return <FaExclamationCircle className="icon" />;
      case 'info':
        return <FaInfoCircle className="icon" />;
      case 'success':
        return <FaCheckCircle className="icon" />;
      default:
        return <FaExclamationCircle className="icon" />;
    }
  };

  return (
    <div 
      className={`error-message ${getSeverityClass()} ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="message-content">
        {showIcon && (
          <div className="icon-container">
            {getIcon()}
          </div>
        )}
        
        <div className="text-content">
          {typeof message === 'string' ? (
            <p>{message}</p>
          ) : (
            <div className="message-body">{message}</div>
          )}
        </div>
      </div>

      <div className="action-buttons">
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="retry-button"
            aria-label={retryText}
          >
            <FaRedo className="button-icon" />
            {retryText}
          </button>
        )}
        
        {onDismiss && (
          <button 
            onClick={onDismiss} 
            className="dismiss-button"
            aria-label={dismissText}
          >
            <FaTimes className="button-icon" />
            {dismissText}
          </button>
        )}
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  onRetry: PropTypes.func,
  onDismiss: PropTypes.func,
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  className: PropTypes.string,
  retryText: PropTypes.string,
  dismissText: PropTypes.string,
  showIcon: PropTypes.bool
};

export default ErrorMessage;
