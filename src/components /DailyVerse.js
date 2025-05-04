import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaBible, FaSyncAlt } from 'react-icons/fa';
import './DailyVerse.css';

// Cache for storing verses to reduce API calls
const verseCache = new Map();

export async function getDailyVerse(version = 'NIV', reference = 'random') {
  const cacheKey = `${version}-${reference}`;
  
  // Return cached verse if available and not a random request
  if (verseCache.has(cacheKey) && reference !== 'random') {
    return verseCache.get(cacheKey);
  }

  try {
    const endpoint = reference === 'random' 
      ? `https://bible-api.com/random?translation=${version}`
      : `https://bible-api.com/${encodeURIComponent(reference)}?translation=${version}`;

    const res = await fetch(endpoint);
    
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    
    // Validate API response structure
    if (!data.text || !data.reference) {
      throw new Error('Invalid API response format');
    }

    const verseData = {
      text: data.text,
      reference: data.reference,
      version: data.translation_name || version,
      copyright: data.copyright || '',
      date: new Date().toISOString()
    };

    // Cache the verse (except random verses)
    if (reference !== 'random') {
      verseCache.set(cacheKey, verseData);
    }

    return verseData;
  } catch (error) {
    console.error('Failed to fetch daily verse:', error);
    
    // Fallback verse in case of API failure
    return {
      text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      reference: 'John 3:16',
      version: version,
      copyright: '',
      date: new Date().toISOString(),
      isFallback: true
    };
  }
}

const DailyVerse = ({ version = 'NIV', showRefresh = true }) => {
  const [verse, setVerse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchVerse = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const verseData = await getDailyVerse(version);
      setVerse(verseData);
      setLastUpdated(new Date(verseData.date).toLocaleTimeString());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerse();
    
    // Refresh verse at midnight
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0
    );
    const timeUntilMidnight = midnight - now;
    
    const midnightRefresh = setTimeout(fetchVerse, timeUntilMidnight);
    
    return () => clearTimeout(midnightRefresh);
  }, [version]);

  const handleRefresh = () => {
    fetchVerse();
  };

  if (isLoading && !verse) {
    return (
      <div className="daily-verse loading">
        <FaBible className="icon-spin" />
        <p>Loading today's verse...</p>
      </div>
    );
  }

  return (
    <div className="daily-verse">
      <div className="verse-header">
        <h3>
          <FaBible /> Daily Verse
          {showRefresh && (
            <button 
              onClick={handleRefresh}
              className="refresh-btn"
              aria-label="Refresh verse"
              disabled={isLoading}
            >
              <FaSyncAlt className={isLoading ? 'spin' : ''} />
            </button>
          )}
        </h3>
        {lastUpdated && (
          <div className="verse-meta">
            {verse?.version} • {lastUpdated}
          </div>
        )}
      </div>

      {error ? (
        <div className="verse-error">
          <p>Failed to load verse: {error}</p>
          <button onClick={fetchVerse}>Retry</button>
        </div>
      ) : (
        <>
          <blockquote className="verse-text">
            {verse?.text}
          </blockquote>
          <cite className="verse-reference">
            — {verse?.reference}
            {verse?.isFallback && ' (Default)'}
          </cite>
          {verse?.copyright && (
            <div className="verse-copyright">
              {verse.copyright}
            </div>
          )}
        </>
      )}
    </div>
  );
};

DailyVerse.propTypes = {
  version: PropTypes.string,
  showRefresh: PropTypes.bool
};

export default DailyVerse;
