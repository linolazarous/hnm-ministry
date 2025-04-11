import React from 'react';
import PropTypes from 'prop-types';

const LivestreamOverlay = ({
  showNotes,
  notes,
  showBible,
  bibleVerse,
  translation,
  verseSearch,
  lowerThird
}) => {
  return (
    <div className="livestream-overlay">
      {/* Notes Overlay */}
      {showNotes && notes && (
        <div className="overlay-notes">
          <div className="notes-content">
            {notes.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {/* Bible Verse Overlay */}
      {showBible && bibleVerse && (
        <div className="overlay-bible">
          <div className="bible-content">
            <p className="bible-text">{bibleVerse}</p>
            {verseSearch && (
              <p className="bible-reference">
                {verseSearch} ({translation})
              </p>
            )}
          </div>
        </div>
      )}

      {/* Lower Third Overlay */}
      {lowerThird.visible && (
        <div 
          className="overlay-lower-third"
          style={{ backgroundColor: lowerThird.color }}
        >
          <div className="lower-third-content">
            <h3 className="lower-third-title">{lowerThird.title}</h3>
            {lowerThird.subtitle && (
              <p className="lower-third-subtitle">{lowerThird.subtitle}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

LivestreamOverlay.propTypes = {
  showNotes: PropTypes.bool,
  notes: PropTypes.string,
  showBible: PropTypes.bool,
  bibleVerse: PropTypes.string,
  translation: PropTypes.string,
  verseSearch: PropTypes.string,
  lowerThird: PropTypes.shape({
    visible: PropTypes.bool,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    color: PropTypes.string
  })
};

export default LivestreamOverlay;