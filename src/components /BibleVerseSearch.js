import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaBible, FaSearch, FaTimes, FaChevronDown } from 'react-icons/fa';
import './BibleVerseSearch.css';

const BibleVerseSearch = forwardRef(({
  showBible,
  setShowBible,
  verseSearch,
  setVerseSearch,
  translation,
  setTranslation,
  translations,
  suggestions,
  isLoading,
  error,
  handleVerseSearch,
  setSuggestions,
  updateBroadcast,
  currentVerse
}, ref) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = React.useRef(null);

  // Auto-focus input when panel is shown
  useEffect(() => {
    if (showBible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showBible]);

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setVerseSearch(suggestion);
    setSuggestions([]);
    inputRef.current.focus();
  };

  // Clear search and suggestions
  const handleClearSearch = () => {
    setVerseSearch('');
    setSuggestions([]);
    inputRef.current.focus();
  };

  // Submit handler with additional state management
  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
    handleVerseSearch(e);
  };

  // Update broadcast when translation changes
  useEffect(() => {
    updateBroadcast({ translation });
  }, [translation, updateBroadcast]);

  return (
    <div 
      className={`control-panel bible-panel ${showBible ? 'expanded' : ''}`} 
      ref={ref}
      aria-expanded={showBible}
    >
      <div className="panel-header">
        <h3>
          <FaBible className="panel-icon" />
          Bible Verse
        </h3>
        <button 
          onClick={() => setShowBible(!showBible)}
          className={`toggle-btn ${showBible ? 'active' : ''}`}
          aria-label={showBible ? 'Hide Bible verse' : 'Show Bible verse'}
        >
          {showBible ? 'Hide' : 'Show'}
        </button>
      </div>

      {showBible && (
        <div className="panel-content">
          <form onSubmit={handleSubmit} className="verse-search-form">
            <div className="form-group search-group">
              <div className="search-input-container">
                <input
                  ref={inputRef}
                  type="text"
                  value={verseSearch}
                  onChange={(e) => setVerseSearch(e.target.value)}
                  placeholder="Enter Bible reference (e.g., John 3:16)"
                  className="search-input"
                  aria-label="Bible verse search"
                />
                {verseSearch && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              
              {suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((suggestion, index) => (
                    <button
                      type="button"
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                      aria-label={`Select ${suggestion}`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="select-wrapper">
                <select
                  value={translation}
                  onChange={(e) => setTranslation(e.target.value)}
                  className="translation-select"
                  aria-label="Bible translation"
                >
                  {translations.map((trans) => (
                    <option key={trans.id} value={trans.id}>
                      {trans.name}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="select-arrow" />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary search-btn"
                disabled={isLoading || !verseSearch.trim()}
                aria-label="Search Bible verse"
              >
                {isLoading ? (
                  <span className="loading-dots">Searching</span>
                ) : (
                  <>
                    <FaSearch className="search-icon" />
                    Search
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {hasSearched && !error && currentVerse && (
            <div className="current-verse">
              <h4>Current Verse:</h4>
              <blockquote>
                <p>{currentVerse.text}</p>
                <footer>
                  — <cite>{currentVerse.reference} ({translation})</cite>
                </footer>
              </blockquote>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

BibleVerseSearch.propTypes = {
  showBible: PropTypes.bool.isRequired,
  setShowBible: PropTypes.func.isRequired,
  verseSearch: PropTypes.string.isRequired,
  setVerseSearch: PropTypes.func.isRequired,
  translation: PropTypes.string.isRequired,
  setTranslation: PropTypes.func.isRequired,
  translations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  handleVerseSearch: PropTypes.func.isRequired,
  setSuggestions: PropTypes.func.isRequired,
  updateBroadcast: PropTypes.func.isRequired,
  currentVerse: PropTypes.shape({
    text: PropTypes.string,
    reference: PropTypes.string
  })
};

BibleVerseSearch.defaultProps = {
  error: null,
  currentVerse: null
};

export default BibleVerseSearch;
