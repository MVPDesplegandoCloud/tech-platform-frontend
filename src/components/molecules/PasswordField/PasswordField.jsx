import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';
import ErrorMessage from '../../atoms/ErrorMessage/ErrorMessage';
import Icon from '../../atoms/Icon/Icon';
import './PasswordField.css';

/**
 * PasswordField Molecule - Password input with visibility toggle
 * Enhances UX with show/hide password functionality
 */
const PasswordField = forwardRef(
  (
    {
      id,
      label,
      placeholder = 'Enter password',
      value,
      onChange,
      error,
      errorMessage,
      disabled = false,
      required = false,
      hint,
      className = '',
      ariaLabel,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const errorId = error ? `${id}-error` : undefined;
    const hintId = hint ? `${id}-hint` : undefined;
    const ariaDescribedBy = [errorId, hintId].filter(Boolean).join(' ');

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={`molecule-password-field ${className}`}>
        {label && (
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
        )}

        <div className="molecule-password-field__input-wrapper">
          <Input
            ref={ref}
            id={id}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            error={error}
            ariaLabel={ariaLabel || label}
            ariaDescribedBy={ariaDescribedBy || undefined}
            {...rest}
          />

          <button
            type="button"
            className="molecule-password-field__toggle"
            onClick={handleTogglePassword}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            <Icon name={showPassword ? 'eyeOff' : 'eye'} size="sm" />
          </button>
        </div>

        {error && errorMessage && (
          <ErrorMessage id={errorId} message={errorMessage} />
        )}

        {hint && !error && (
          <p id={hintId} className="molecule-password-field__hint">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';

PasswordField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  hint: PropTypes.string,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default PasswordField;
