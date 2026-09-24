import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

/**
 * Input Atom - Basic text input element
 * Foundational component for form fields
 */
const Input = forwardRef(
  (
    {
      type = 'text',
      placeholder = '',
      value = '',
      onChange,
      disabled = false,
      error = false,
      className = '',
      ariaLabel,
      ariaDescribedBy,
      ...rest
    },
    ref
  ) => {
    const inputClass = [
      'atom-input',
      error && 'atom-input--error',
      disabled && 'atom-input--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={inputClass}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...rest}
      />
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
};

export default Input;
