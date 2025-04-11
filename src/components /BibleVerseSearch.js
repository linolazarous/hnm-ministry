import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

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
  updateBroadcast
}, ref) => {
  return (
    <div className="control-panel bible-panel" ref={ref}>
      <div className="panel-header">
        <h3>Bible Verse</h3>
        <button 
          onClick={() => setShowBible(!showBible)}
          className={`toggle-btn ${showBible ? 'active' : ''}`}
        >
          {showBible ? 'Hide Verse' : 'Show Verse'}
        </button>
      </div>

      {showBible && (
        <div className="panel-content">
          <form onSubmit={handleVerseSearch} className="verse-search-form">
            <div className="form-group">
              <input
                type="text"
                value={verseSearch}
                onChange={(e) => setVerseSearch(e.target.value)}
                placeholder="Enter Bible reference (e.g., John 3:16)"
                className="search-input"
              />
              {suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="suggestion-item"
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

            <div className="form-row">
              <select
                value={translation}
                onChange={(e) => {
                  setTranslation(e.target.value);
                  updateBroadcast({ translation: e.target.value });
                }}
                className="translation-select"
              >
                {translations.map((trans) => (
                  <option key={trans.id} value={trans.id}>
                    {trans.name}
                  </option>
                ))}
              </select>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {error && <div className="error-message">{error}</div>}
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
  translations: PropTypes.array.isRequired,
  suggestions: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  handleVerseSearch: PropTypes.func.isRequired,
  setSuggestions: PropTypes.func.isRequired,
  updateBroadcast: PropTypes.func.isRequired
};

export default BibleVerseSearch;