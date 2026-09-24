import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';
import ErrorMessage from '../../atoms/ErrorMessage/ErrorMessage';
import './FormField.css';

/**
 * FormField Molecule - Combines Label, Input, and Error message
 * Handles the complete form field interaction pattern
 */
const FormField = forwardRef(
  (
    {
      id,
      label,
      type = 'text',
      placeholder,
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
    const errorId = error ? `${id}-error` : undefined;
    const hintId = hint ? `${id}-hint` : undefined;
    const ariaDescribedBy = [errorId, hintId].filter(Boolean).join(' ');

    return (
      <div className={`molecule-form-field ${className}`}>
        {label && (
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
        )}
        
        <Input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          error={error}
          ariaLabel={ariaLabel || label}
          ariaDescribedBy={ariaDescribedBy || undefined}
          {...rest}
        />

        {error && errorMessage && (
          <ErrorMessage id={errorId} message={errorMessage} />
        )}

        {hint && !error && (
          <p id={hintId} className="molecule-form-field__hint">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  hint: PropTypes.string,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default FormField;
