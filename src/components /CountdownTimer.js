import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaPlay, FaStop, FaUndo, FaClock } from 'react-icons/fa';
import { formatTime, parseTimeString } from '../utils/timeUtils';
import './CountdownTimer.css';

const CountdownTimer = ({ updateBroadcast, isBroadcasting }) => {
  const [targetTime, setTargetTime] = useState(null);
  const [title, setTitle] = useState('Service Starts In');
  const [timeLeft, setTimeLeft] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(30); // Default 30 minutes
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  // Calculate time left and update broadcast
  const updateCountdown = useCallback(() => {
    const now = new Date();
    const difference = targetTime - now;
    
    if (difference <= 0) {
      setTimeLeft(0);
      setIsActive(false);
      updateBroadcast({ 
        countdown: { 
          visible: false,
          active: false,
          timeLeft: 0,
          title
        } 
      });
    } else {
      setTimeLeft(difference);
      updateBroadcast({ 
        countdown: { 
          visible: true,
          active: true,
          timeLeft: difference,
          targetTime: targetTime.toISOString(),
          title
        } 
      });
    }
  }, [targetTime, title, updateBroadcast]);

  // Countdown effect
  useEffect(() => {
    let interval;
    
    if (isActive && targetTime) {
      updateCountdown(); // Immediate update
      interval = setInterval(updateCountdown, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, targetTime, updateCountdown]);

  // Set target time based on duration
  const setTargetFromDuration = (minutes) => {
    const now = new Date();
    const newTargetTime = new Date(now.getTime() + minutes * 60000);
    setTargetTime(newTargetTime);
    setDuration(minutes);
    setShowDurationPicker(false);
  };

  // Start countdown
  const startCountdown = () => {
    if (!targetTime) return;
    
    setIsActive(true);
    updateCountdown();
  };

  // Stop countdown
  const stopCountdown = () => {
    setIsActive(false);
    updateBroadcast({ 
      countdown: { 
        visible: false,
        active: false
      } 
    });
  };

  // Reset countdown
  const resetCountdown = () => {
    setTargetTime(null);
    setTimeLeft(null);
    setIsActive(false);
    updateBroadcast({ 
      countdown: { 
        visible: false,
        active: false
      } 
    });
  };

  // Handle time input change
  const handleTimeChange = (e) => {
    const timeValue = e.target.value;
    if (!timeValue) {
      setTargetTime(null);
      return;
    }

    const newTargetTime = parseTimeString(timeValue);
    if (newTargetTime) {
      setTargetTime(newTargetTime);
    }
  };

  // Handle duration change
  const handleDurationChange = (e) => {
    const minutes = parseInt(e.target.value);
    if (!isNaN(minutes) && minutes > 0) {
      setDuration(minutes);
    }
  };

  // Toggle duration picker
  const toggleDurationPicker = () => {
    setShowDurationPicker(!showDurationPicker);
  };

  return (
    <div className={`control-panel countdown-panel ${isActive ? 'active' : ''}`}>
      <div className="panel-header">
        <h3><FaClock className="panel-icon" /> Countdown Timer</h3>
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

        <div className="time-selection">
          <div className="form-group">
            <label htmlFor="countdown-time">Specific Time</label>
            <input
              type="time"
              id="countdown-time"
              onChange={handleTimeChange}
              disabled={isActive}
            />
          </div>

          <div className="or-divider">OR</div>

          <div className="form-group duration-group">
            <label>Quick Duration</label>
            <button 
              className="duration-toggle"
              onClick={toggleDurationPicker}
              type="button"
            >
              {duration} minutes <FaChevronDown />
            </button>
            
            {showDurationPicker && (
              <div className="duration-picker">
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={handleDurationChange}
                  className="duration-input"
                />
                <span>minutes</span>
                <button
                  type="button"
                  className="btn btn-small"
                  onClick={() => setTargetFromDuration(duration)}
                >
                  Set
                </button>
                <div className="quick-durations">
                  {[5, 10, 15, 30, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      className="btn btn-small"
                      onClick={() => setTargetFromDuration(mins)}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {timeLeft !== null && (
          <div className="countdown-preview">
            <div className="countdown-display">
              {formatTime(timeLeft)}
            </div>
            {title && <div className="countdown-title">{title}</div>}
          </div>
        )}

        <div className="button-group">
          {!isActive ? (
            <>
              <button
                className="btn btn-primary"
                onClick={startCountdown}
                disabled={!targetTime || !isBroadcasting}
              >
                <FaPlay /> Start
              </button>
              <button
                className="btn btn-secondary"
                onClick={resetCountdown}
                disabled={!targetTime}
              >
                <FaUndo /> Reset
              </button>
            </>
          ) : (
            <button
              className="btn btn-stop"
              onClick={stopCountdown}
            >
              <FaStop /> Stop
            </button>
          )}
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
