import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatTime } from '../utils/timeUtils';

const CountdownTimer = ({ updateBroadcast, isBroadcasting }) => {
  const [targetTime, setTargetTime] = useState(null);
  const [title, setTitle] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    
    if (isActive && targetTime) {
      interval = setInterval(() => {
        const now = new Date();
        const difference = targetTime - now;
        
        if (difference <= 0) {
          setTimeLeft(0);
          clearInterval(interval);
          setIsActive(false);
        } else {
          setTimeLeft(difference);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, targetTime]);

  const startCountdown = () => {
    if (!targetTime) return;
    
    setIsActive(true);
    updateBroadcast({ 
      countdown: { 
        visible: true,
        targetTime: targetTime.toISOString(),
        title,
        active: true
      } 
    });
  };

  const stopCountdown = () => {
    setIsActive(false);
    updateBroadcast({ 
      countdown: { 
        visible: false,
        active: false
      } 
    });
  };

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':');
    const now = new Date();
    const newTargetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(hours),
      parseInt(minutes)
    );
    
    setTargetTime(newTargetTime);
  };

  return (
    <div className="control-panel countdown-panel">
      <div className="panel-header">
        <h3>Countdown Timer</h3>
      </div>

      <div className="panel-content">
        <div className="form-group">
          <label htmlFor="countdown-title">Event Title</label>
          <input
            type="text"
            id="countdown-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., 'Service Starts In'"
          />
        </div>

        <div className="form-group">
          <label htmlFor="countdown-time">Target Time</label>
          <input
            type="time"
            id="countdown-time"
            onChange={handleTimeChange}
            required
          />
        </div>

        {timeLeft !== null && (
          <div className="countdown-preview">
            <h4>Countdown:</h4>
            <div className="countdown-display">
              {formatTime(timeLeft)}
            </div>
            {title && <p>{title}</p>}
          </div>
        )}

        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={startCountdown}
            disabled={!targetTime || !isBroadcasting}
          >
            Start Countdown
          </button>
          <button
            className="btn btn-secondary"
            onClick={stopCountdown}
          >
            Stop Countdown
          </button>
        </div>
      </div>
    </div>
  );
};

CountdownTimer.propTypes = {
  updateBroadcast: PropTypes.func.isRequired,
  isBroadcasting: PropTypes.bool.isRequired
};

export default CountdownTimer;