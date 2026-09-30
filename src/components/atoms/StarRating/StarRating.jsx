import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon/Icon';
import './StarRating.css';

/**
 * StarRating Atom - Interactive star rating component
 * Allows users to rate items from 1-5
 */
const StarRating = ({ 
  value = 0, 
  onChange, 
  readonly = false,
  size = 'md',
  className = '',
  ariaLabel = 'Rating',
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleStarClick = (starValue) => {
    if (!readonly && onChange) {
      onChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (!readonly) {
      setHoverValue(starValue);
    }
  };

  const displayValue = hoverValue || value;

  return (
    <div 
      className={`atom-star-rating atom-star-rating--${size} ${className}`}
      onMouseLeave={() => setHoverValue(0)}
      role="group"
      aria-label={ariaLabel}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`atom-star-rating__star ${
            star <= displayValue ? 'atom-star-rating__star--filled' : ''
          }`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          disabled={readonly}
          aria-label={`${star} stars`}
          aria-pressed={star <= value}
        >
          <Icon name="star" size={size} />
        </button>
      ))}
    </div>
  );
};

StarRating.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default StarRating;
