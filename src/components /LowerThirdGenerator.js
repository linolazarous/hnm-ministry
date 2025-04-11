import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';

const LowerThirdGenerator = ({
  lowerThird,
  setLowerThird,
  showLowerThird,
  hideLowerThird,
  updateBroadcast
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...lowerThird, [name]: value };
    setLowerThird(updated);
    updateBroadcast({ lowerThird: updated });
  };

  const handleColorChange = (color) => {
    const updated = { ...lowerThird, color: color.hex };
    setLowerThird(updated);
    updateBroadcast({ lowerThird: updated });
  };

  return (
    <div className="control-panel lower-third-panel">
      <div className="panel-header">
        <h3>Lower Third Generator</h3>
      </div>

      <div className="panel-content">
        <div className="form-group">
          <label htmlFor="lower-third-title">Title</label>
          <input
            type="text"
            id="lower-third-title"
            name="title"
            value={lowerThird.title}
            onChange={handleChange}
            placeholder="Speaker name or title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lower-third-subtitle">Subtitle (Optional)</label>
          <input
            type="text"
            id="lower-third-subtitle"
            name="subtitle"
            value={lowerThird.subtitle}
            onChange={handleChange}
            placeholder="Position or scripture reference"
          />
        </div>

        <div className="form-group">
          <label>Color</label>
          <div className="color-picker-container">
            <div 
              className="color-preview"
              style={{ backgroundColor: lowerThird.color }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            {showColorPicker && (
              <div className="color-picker-popup">
                <ChromePicker
                  color={lowerThird.color}
                  onChangeComplete={handleColorChange}
                />
                <button 
                  className="btn btn-small"
                  onClick={() => setShowColorPicker(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={showLowerThird}
            disabled={!lowerThird.title}
          >
            Show Lower Third
          </button>
          <button
            className="btn btn-secondary"
            onClick={hideLowerThird}
          >
            Hide Lower Third
          </button>
        </div>
      </div>
    </div>
  );
};

LowerThirdGenerator.propTypes = {
  lowerThird: PropTypes.shape({
    visible: PropTypes.bool,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    color: PropTypes.string
  }).isRequired,
  setLowerThird: PropTypes.func.isRequired,
  showLowerThird: PropTypes.func.isRequired,
  hideLowerThird: PropTypes.func.isRequired,
  updateBroadcast: PropTypes.func.isRequired
};

export default LowerThirdGenerator;