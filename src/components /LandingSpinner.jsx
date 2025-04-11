import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = '#4a6fa5' }) => {
  const sizes = {
    small: '1.5rem',
    medium: '3rem',
    large: '5rem'
  };

  return (
    <div className="loading-spinner" style={{ width: sizes[size], height: sizes[size] }}>
      <div className="spinner" style={{ borderColor: `${color} transparent transparent transparent` }} />
    </div>
  );
};

export default LoadingSpinner;