import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/**
 * Button Atom - Basic interactive element
 * Smallest reusable component in the design system
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  onClick,
  className = '',
  ariaLabel,
  ...rest
}) => {
  const buttonClass = [
    'atom-button',
    `atom-button--${variant}`,
    `atom-button--${size}`,
    disabled && 'atom-button--disabled',
    isLoading && 'atom-button--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || isLoading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading && <span className="atom-button__spinner" />}
      <span className="atom-button__text">{children}</span>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Button;
