import React from 'react';
import PropTypes from 'prop-types';
import './Label.css';

/**
 * Label Atom - Text label for form inputs
 * Ensures accessibility with proper htmlFor attribute
 */
const Label = ({ htmlFor, children, required = false, className = '', ...rest }) => {
  return (
    <label htmlFor={htmlFor} className={`atom-label ${className}`} {...rest}>
      {children}
      {required && <span className="atom-label__required" aria-label="required">*</span>}
    </label>
  );
};

Label.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Label;
