import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import logo from '../assets/logo.png';
import BibleVerseSearch from '../components/BibleVerseSearch';
import LivestreamNotes from '../components/LivestreamNotes';
import LivestreamOverlay from '../components/LivestreamOverlay';
import LowerThirdGenerator from '../components/LowerThirdGenerator';
import CountdownTimer from '../components/CountdownTimer';
import { useBroadcast } from '../hooks/useBroadcast';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../hooks/useAuth';
import { BibleAPI } from '../services/BibleAPI';
import { BroadcastAPI } from '../services/BroadcastAPI';
import { formatTime } from '../utils/timeUtils';
import './Livestream.css';

// Constants
const TRANSLATIONS = [
  { id: 'NIV', name: 'New International Version' },
  { id: 'KJV', name: 'King James Version' },
  { id: 'ESV', name: 'English Standard Version' },
  { id: 'NASB', name: 'New American Standard Bible' },
  { id: 'NLT', name: 'New Living Translation' },
  { id: 'MSG', name: 'The Message' },
  { id: 'AMP', name: 'Amplified Bible' },
];

const Livestream = () => {
  // Authentication
  const { user, isAuthenticated, logout } = useAuth();
  const socketRef = useRef(null);
  
  // State management
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useLocalStorage('livestream-notes', '');
  const [showBible, setShowBible] = useState(false);
  const [bibleVerse, setBibleVerse] = useState('');
  const [translation, setTranslation] = useLocalStorage('bible-translation', 'NIV');
  const [verseSearch, setVerseSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('controls');
  const [streamStatus, setStreamStatus] = useState('offline');
  const [viewerCount, setViewerCount] = useState(0);
  const [lowerThird, setLowerThird] = useState({
    visible: false,
    title: '',
    subtitle: '',
    color: '#4a6fa5'
  });

  // Custom hook for broadcast state management
  const { broadcastState, updateBroadcast, syncWithServer } = useBroadcast();

  // Refs
  const notesRef = useRef(null);
  const bibleRef = useRef(null);

  // Memoized values
  const availableTranslations = useMemo(() => TRANSLATIONS, []);
  const isBroadcasting = useMemo(() => streamStatus === 'live', [streamStatus]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!isAuthenticated) return;

    socketRef.current = io(process.env.REACT_APP_WEBSOCKET_URL, {
      auth: { token: user.token },
      transports: ['websocket']
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
      setStreamStatus('connecting');
    });

    socketRef.current.on('stream-status', (status) => {
      setStreamStatus(status);
    });

    socketRef.current.on('viewer-count', (count) => {
      setViewerCount(count);
    });

    socketRef.current.on('broadcast-update', (update) => {
      syncWithServer(update);
    });

    socketRef.current.on('disconnect', () => {
      setStreamStatus('offline');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isAuthenticated, user, syncWithServer]);

  // Fetch initial broadcast state
  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const response = await BroadcastAPI.getCurrentState();
        syncWithServer(response.data);
      } catch (err) {
        console.error('Failed to fetch initial state:', err);
      }
    };

    if (isAuthenticated) {
      fetchInitialState();
    }
  }, [isAuthenticated, syncWithServer]);

  // Debounced verse search
  const debouncedSearch = useCallback(
    debounce(async (searchTerm, version) => {
      if (searchTerm.trim()) {
        setIsLoading(true);
        setError(null);
        
        try {
          const verse = await BibleAPI.getVerse(searchTerm, version);
          setBibleVerse(verse.text);
          updateBroadcast({ 
            bibleVerse: verse.text, 
            bibleReference: searchTerm, 
            translation: version 
          });
        } catch (err) {
          console.error('Error fetching Bible verse:', err);
          setError('Failed to fetch verse. Please try again.');
          setBibleVerse('');
        } finally {
          setIsLoading(false);
        }
      }
    }, 500),
    [updateBroadcast]
  );

  // Handle verse search
  const handleVerseSearch = (e) => {
    e.preventDefault();
    debouncedSearch(verseSearch, translation);
  };

  // Auto-suggest Bible references
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (verseSearch.length > 2) {
        try {
          const results = await BibleAPI.searchReferences(verseSearch);
          setSuggestions(results);
        } catch (err) {
          console.error('Error fetching suggestions:', err);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [verseSearch]);

  // Broadcast control functions
  const startBroadcast = async () => {
    try {
      await BroadcastAPI.startBroadcast();
      setStreamStatus('live');
    } catch (err) {
      console.error('Failed to start broadcast:', err);
    }
  };

  const endBroadcast = async () => {
    try {
      await BroadcastAPI.endBroadcast();
      setStreamStatus('offline');
    } catch (err) {
      console.error('Failed to end broadcast:', err);
    }
  };

  const savePreset = async (presetName) => {
    try {
      await BroadcastAPI.savePreset({
        name: presetName,
        state: broadcastState
      });
    } catch (err) {
      console.error('Failed to save preset:', err);
    }
  };

  // Lower third controls
  const showLowerThird = () => {
    updateBroadcast({ lowerThird: { ...lowerThird, visible: true } });
  };

  const hideLowerThird = () => {
    updateBroadcast({ lowerThird: { ...lowerThird, visible: false } });
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to access the livestream controls.</p>
      </div>
    );
  }

  return (
    <div className="livestream-admin">
      {/* Header with stream status */}
      <header className="livestream-header">
        <img src={logo} alt="Heavenly Nature Ministry Logo" className="livestream-logo" />
        <div className="stream-status">
          <span className={`status-indicator ${streamStatus}`}>
            {streamStatus.toUpperCase()}
          </span>
          <span className="viewer-count">
            {viewerCount} {viewerCount === 1 ? 'viewer' : 'viewers'}
          </span>
          {isBroadcasting ? (
            <button onClick={endBroadcast} className="btn btn-danger">
              End Broadcast
            </button>
          ) : (
            <button onClick={startBroadcast} className="btn btn-success">
              Start Broadcast
            </button>
          )}
        </div>
      </header>

      {/* Main content area */}
      <main className="livestream-main">
        {/* Livestream preview and overlay */}
        <section className="livestream-preview">
          <div className="livestream-embed-container">
            <div className="livestream-embed-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/your-livestream-id?autoplay=1&mute=1`}
                title="Livestream Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="livestream-embed"
              />
            </div>
          </div>

          <LivestreamOverlay 
            showNotes={showNotes}
            notes={notes}
            showBible={showBible}
            bibleVerse={bibleVerse}
            translation={translation}
            verseSearch={verseSearch}
            lowerThird={broadcastState.lowerThird}
          />
        </section>

        {/* Control panels */}
        <section className="livestream-controls">
          <nav className="control-tabs">
            <button 
              className={activeTab === 'controls' ? 'active' : ''}
              onClick={() => setActiveTab('controls')}
            >
              Controls
            </button>
            <button 
              className={activeTab === 'lower-third' ? 'active' : ''}
              onClick={() => setActiveTab('lower-third')}
            >
              Lower Third
            </button>
            <button 
              className={activeTab === 'countdown' ? 'active' : ''}
              onClick={() => setActiveTab('countdown')}
            >
              Countdown
            </button>
            <button 
              className={activeTab === 'presets' ? 'active' : ''}
              onClick={() => setActiveTab('presets')}
            >
              Presets
            </button>
          </nav>

          <div className="tab-content">
            {activeTab === 'controls' && (
              <>
                <LivestreamNotes 
                  showNotes={showNotes}
                  setShowNotes={setShowNotes}
                  notes={notes}
                  setNotes={setNotes}
                  ref={notesRef}
                  updateBroadcast={updateBroadcast}
                />

                <BibleVerseSearch 
                  showBible={showBible}
                  setShowBible={setShowBible}
                  verseSearch={verseSearch}
                  setVerseSearch={setVerseSearch}
                  translation={translation}
                  setTranslation={setTranslation}
                  translations={availableTranslations}
                  suggestions={suggestions}
                  isLoading={isLoading}
                  error={error}
                  handleVerseSearch={handleVerseSearch}
                  setSuggestions={setSuggestions}
                  ref={bibleRef}
                  updateBroadcast={updateBroadcast}
                />
              </>
            )}

            {activeTab === 'lower-third' && (
              <LowerThirdGenerator
                lowerThird={lowerThird}
                setLowerThird={setLowerThird}
                showLowerThird={showLowerThird}
                hideLowerThird={hideLowerThird}
                updateBroadcast={updateBroadcast}
              />
            )}

            {activeTab === 'countdown' && (
              <CountdownTimer 
                updateBroadcast={updateBroadcast}
                isBroadcasting={isBroadcasting}
              />
            )}

            {activeTab === 'presets' && (
              <div className="presets-panel">
                <h3>Save Current State as Preset</h3>
                <div className="preset-form">
                  <input 
                    type="text" 
                    placeholder="Preset name"
                    id="preset-name"
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={() => savePreset(document.getElementById('preset-name').value)}
                  >
                    Save Preset
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Broadcast status debug panel */}
      <details className="debug-panel">
        <summary>Broadcast State</summary>
        <pre>{JSON.stringify(broadcastState, null, 2)}</pre>
      </details>
    </div>
  );
};

Livestream.propTypes = {
  // Add prop types if this component receives any props
};

export default Livestream;
