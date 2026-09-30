import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon/Icon';
import './ErrorMessage.css';

/**
 * ErrorMessage Atom - Displays validation or error messages
 * Accessible error feedback
 */
const ErrorMessage = ({ id, message, className = '', ...rest }) => {
  if (!message) return null;

  return (
    <div id={id} className={`atom-error-message ${className}`} role="alert" {...rest}>
      <Icon name="error" size="sm" ariaLabel="error" />
      <span className="atom-error-message__text">{message}</span>
    </div>
  );
};

ErrorMessage.propTypes = {
  id: PropTypes.string,
  message: PropTypes.string,
  className: PropTypes.string,
};

export default ErrorMessage;
