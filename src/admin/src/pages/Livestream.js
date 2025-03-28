// admin/src/pages/Livestream.js
import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import axios from 'axios';

const Livestream = () => {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [showBible, setShowBible] = useState(false);
  const [bibleVerse, setBibleVerse] = useState('');
  const [translation, setTranslation] = useState('NIV');
  const [verseSearch, setVerseSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Available Bible translations (YouVersion supported versions)
  const translations = [
    { id: 'NIV', name: 'New International Version' },
    { id: 'KJV', name: 'King James Version' },
    { id: 'ESV', name: 'English Standard Version' },
    { id: 'NASB', name: 'New American Standard Bible' },
    { id: 'NLT', name: 'New Living Translation' },
    { id: 'MSG', name: 'The Message' },
    { id: 'AMP', name: 'Amplified Bible' },
  ];

  // Fetch Bible verse from YouVersion API (mock implementation)
  const fetchBibleVerse = async (reference, version) => {
    try {
      // In a real implementation, you would use the YouVersion API
      // This is a mock implementation for demonstration
      console.log(`Fetching ${reference} in ${version}`);
      
      // Mock response
      const mockVerses = {
        'John 3:16': {
          NIV: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
          KJV: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
          ESV: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
        },
        'Psalm 23:1': {
          NIV: 'The LORD is my shepherd, I lack nothing.',
          KJV: 'The LORD is my shepherd; I shall not want.',
          ESV: 'The LORD is my shepherd; I shall not want.',
        },
        // Add more mock verses as needed
      };

      const verseText = mockVerses[reference]?.[version] || 
                       `Verse not found for ${reference} in ${version}. Please try another reference.`;
      
      setBibleVerse(verseText);
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      setBibleVerse('Error loading verse. Please try again.');
    }
  };

  // Handle verse search
  const handleVerseSearch = (e) => {
    e.preventDefault();
    if (verseSearch.trim()) {
      fetchBibleVerse(verseSearch, translation);
    }
  };

  // Auto-suggest Bible references (mock implementation)
  useEffect(() => {
    if (verseSearch.length > 2) {
      // In a real app, you would fetch suggestions from YouVersion API
      const mockSuggestions = [
        'John 3:16',
        'Psalm 23:1',
        'Romans 8:28',
        'Philippians 4:13',
        'Matthew 11:28',
      ].filter(ref => ref.toLowerCase().includes(verseSearch.toLowerCase()));
      
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [verseSearch]);

  return (
    <div style={styles.container}>
      <img src={logo} alt="Heavenly Nature Ministry Logo" style={styles.logo} />
      <h2>Livestream Management</h2>
      
      {/* Livestream Embed */}
      <div style={styles.livestreamContainer}>
        <iframe
          width="100%"
          height="500"
          src="https://www.youtube.com/embed/your-livestream-id"
          title="Livestream"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Controls Section */}
      <div style={styles.controls}>
        {/* Notes Controls */}
        <div style={styles.controlGroup}>
          <button 
            onClick={() => setShowNotes(!showNotes)}
            style={showNotes ? styles.activeButton : styles.button}
          >
            {showNotes ? 'Hide Notes' : 'Show Notes'}
          </button>
          {showNotes && (
            <div style={styles.notesInputContainer}>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type notes to display during livestream..."
                style={styles.notesInput}
              />
              <button 
                onClick={() => setNotes('')}
                style={styles.button}
              >
                Clear Notes
              </button>
            </div>
          )}
        </div>

        {/* Bible Verse Controls */}
        <div style={styles.controlGroup}>
          <button 
            onClick={() => setShowBible(!showBible)}
            style={showBible ? styles.activeButton : styles.button}
          >
            {showBible ? 'Hide Bible Verse' : 'Show Bible Verse'}
          </button>
          {showBible && (
            <div style={styles.bibleControls}>
              <form onSubmit={handleVerseSearch} style={styles.searchForm}>
                <input
                  type="text"
                  value={verseSearch}
                  onChange={(e) => setVerseSearch(e.target.value)}
                  placeholder="Enter Bible reference (e.g., John 3:16)"
                  style={styles.searchInput}
                />
                <select
                  value={translation}
                  onChange={(e) => setTranslation(e.target.value)}
                  style={styles.translationSelect}
                >
                  {translations.map((trans) => (
                    <option key={trans.id} value={trans.id}>{trans.name}</option>
                  ))}
                </select>
                <button type="submit" style={styles.button}>Search</button>
              </form>
              
              {suggestions.length > 0 && (
                <div style={styles.suggestionsContainer}>
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      style={styles.suggestion}
                      onClick={() => {
                        setVerseSearch(suggestion);
                        setSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overlay Display Area */}
      <div style={styles.overlayContainer}>
        {showNotes && notes && (
          <div style={styles.notesDisplay}>
            <h4>Livestream Notes:</h4>
            <p>{notes}</p>
          </div>
        )}
        {showBible && bibleVerse && (
          <div style={styles.bibleDisplay}>
            <h4>Bible Verse ({translation}):</h4>
            <p>{bibleVerse}</p>
            {verseSearch && <small>Reference: {verseSearch}</small>}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    height: '50px',
    marginBottom: '20px',
  },
  livestreamContainer: {
    marginBottom: '30px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  controlGroup: {
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '8px',
    minWidth: '300px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#4a6fa5',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    margin: '5px',
  },
  activeButton: {
    padding: '10px 15px',
    backgroundColor: '#3a5a8a',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    margin: '5px',
    fontWeight: 'bold',
  },
  notesInputContainer: {
    marginTop: '10px',
  },
  notesInput: {
    width: '100%',
    minHeight: '100px',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginBottom: '10px',
  },
  bibleControls: {
    marginTop: '10px',
  },
  searchForm: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
  },
  searchInput: {
    flex: '1',
    minWidth: '200px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  translationSelect: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
  },
  suggestionsContainer: {
    marginTop: '10px',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #ddd',
    maxHeight: '150px',
    overflowY: 'auto',
  },
  suggestion: {
    padding: '8px 10px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
  },
  suggestionHover: {
    backgroundColor: '#f0f0f0',
  },
  overlayContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'left',
    marginTop: '20px',
  },
  notesDisplay: {
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  },
  bibleDisplay: {
    marginTop: '15px',
  },
};

export default Livestream;