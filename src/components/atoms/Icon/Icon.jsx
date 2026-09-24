import React from 'react';
import PropTypes from 'prop-types';
import './Icon.css';

/**
 * Icon Atom - SVG icon component
 * Simple, scalable icon rendering
 */
const Icon = ({ name, size = 'md', className = '', ariaLabel, ...rest }) => {
  const iconClass = [`atom-icon`, `atom-icon--${size}`, className]
    .filter(Boolean)
    .join(' ');

  const icons = {
    eye: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    eyeOff: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  };

  return (
    <span className={iconClass} aria-label={ariaLabel} {...rest}>
      {icons[name] || icons.check}
    </span>
  );
};

Icon.propTypes = {
  name: PropTypes.oneOf(['eye', 'eyeOff', 'check', 'error']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Icon;
