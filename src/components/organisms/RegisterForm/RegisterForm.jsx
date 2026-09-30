import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import FormField from '../../molecules/FormField/FormField';
import PasswordField from '../../molecules/PasswordField/PasswordField';
import Button from '../../atoms/Button/Button';
import ErrorMessage from '../../atoms/ErrorMessage/ErrorMessage';
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '../../../utils/validators';
import useForm from '../../../hooks/useForm';
import './RegisterForm.css';

/**
 * RegisterForm Organism - Complete registration form with validation
 * Handles complex form logic and user interactions
 */
const RegisterForm = ({ onSubmit, isLoading = false, serverError = null }) => {
  const initialFormState = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [generalError, setGeneralError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const {
    formData,
    touched,
    handleChange,
    handleBlur,
    reset,
  } = useForm(initialFormState);

  /**
   * Validates a specific field
   */
  const validateField = useCallback((fieldName, value) => {
    let validation;

    switch (fieldName) {
      case 'fullName':
        validation = validateFullName(value);
        break;
      case 'email':
        validation = validateEmail(value);
        break;
      case 'password':
        validation = validatePassword(value);
        break;
      case 'confirmPassword':
        validation = validatePasswordConfirmation(formData.password, value);
        break;
      default:
        validation = { isValid: true, message: '' };
    }

    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: validation,
    }));

    return validation.isValid;
  }, [formData.password]);

  /**
   * Validates entire form
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const validation = validateField(field, formData[field]);
      if (!validation) {
        isValid = false;
        newErrors[field] = fieldErrors[field] || { isValid: false };
      }
    });

    return isValid;
  }, [formData, fieldErrors, validateField]);

  /**
   * Handles form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      setGeneralError('Please fix the errors above');
      return;
    }

    try {
      await onSubmit({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      reset();
    } catch (error) {
      setGeneralError(error.message || 'Registration failed. Please try again.');
    }
  };

  /**
   * Handles field blur to show validation errors
   */
  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    handleBlur(name);
    validateField(name, value);
  };

  return (
    <form className="organism-register-form" onSubmit={handleSubmit} noValidate>
      {(generalError || serverError) && (
        <ErrorMessage message={generalError || serverError} className="organism-register-form__error" />
      )}

      <FormField
        id="fullName"
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={handleChange}
        onBlur={handleFieldBlur}
        error={touched.fullName && !fieldErrors.fullName?.isValid}
        errorMessage={fieldErrors.fullName?.message}
        required
      />

      <FormField
        id="email"
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleFieldBlur}
        error={touched.email && !fieldErrors.email?.isValid}
        errorMessage={fieldErrors.email?.message}
        required
      />

      <PasswordField
        id="password"
        label="Password"
        placeholder="Create a strong password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleFieldBlur}
        error={touched.password && !fieldErrors.password?.isValid}
        errorMessage={fieldErrors.password?.message}
        hint="Min 8 chars, 1 uppercase, 1 number, 1 special char (@$!%*?&)"
        required
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Re-enter your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleFieldBlur}
        error={touched.confirmPassword && !fieldErrors.confirmPassword?.isValid}
        errorMessage={fieldErrors.confirmPassword?.message}
        required
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
        className="organism-register-form__submit"
      >
        {isLoading ? 'Creating account...' : 'Register'}
      </Button>

      <p className="organism-register-form__footer">
        Already have an account?{' '}
        <a href="/login" className="organism-register-form__link">
          Sign in here
        </a>
      </p>
    </form>
  );
};

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  serverError: PropTypes.string,
};

export default RegisterForm;
