import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const LivestreamNotes = forwardRef(({
  showNotes,
  setShowNotes,
  notes,
  setNotes,
  updateBroadcast
}, ref) => {
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    updateBroadcast({ notes: newNotes });
  };

  return (
    <div className="control-panel notes-panel" ref={ref}>
      <div className="panel-header">
        <h3>Livestream Notes</h3>
        <button 
          onClick={() => setShowNotes(!showNotes)}
          className={`toggle-btn ${showNotes ? 'active' : ''}`}
        >
          {showNotes ? 'Hide Notes' : 'Show Notes'}
        </button>
      </div>

      {showNotes && (
        <div className="panel-content">
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Type notes to display during livestream..."
            className="notes-textarea"
            rows="6"
          />
          <button 
            onClick={() => {
              setNotes('');
              updateBroadcast({ notes: '' });
            }}
            className="btn btn-secondary"
          >
            Clear Notes
          </button>
        </div>
      )}
    </div>
  );
});

LivestreamNotes.propTypes = {
  showNotes: PropTypes.bool.isRequired,
  setShowNotes: PropTypes.func.isRequired,
  notes: PropTypes.string.isRequired,
  setNotes: PropTypes.func.isRequired,
  updateBroadcast: PropTypes.func.isRequired
};

export default LivestreamNotes;