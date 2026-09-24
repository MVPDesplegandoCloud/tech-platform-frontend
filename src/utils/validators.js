/**
 * Validation utilities for form fields
 * Centralized validation logic following DRY principle
 */

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRES_UPPERCASE: true,
  PASSWORD_REQUIRES_NUMBER: true,
  PASSWORD_REQUIRES_SPECIAL_CHAR: true,
  SPECIAL_CHARS: '@$!%*?&',
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, message: string, strength: string }
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    return { isValid: false, message: 'Password is required', strength: 'none' };
  }

  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.push(`at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`);
  }

  if (VALIDATION_RULES.PASSWORD_REQUIRES_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }

  if (VALIDATION_RULES.PASSWORD_REQUIRES_NUMBER && !/\d/.test(password)) {
    errors.push('one number');
  }

  if (VALIDATION_RULES.PASSWORD_REQUIRES_SPECIAL_CHAR && 
      !new RegExp(`[${VALIDATION_RULES.SPECIAL_CHARS}]`).test(password)) {
    errors.push(`one special character (${VALIDATION_RULES.SPECIAL_CHARS})`);
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      message: `Password must include: ${errors.join(', ')}`,
      strength: 'weak',
    };
  }

  return {
    isValid: true,
    message: 'Password is strong',
    strength: 'strong',
  };
};

/**
 * Validates password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Password confirmation
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validates full name
 * @param {string} fullName - Full name to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateFullName = (fullName) => {
  if (!fullName) {
    return { isValid: false, message: 'Full name is required' };
  }

  if (fullName.trim().length < 2) {
    return { isValid: false, message: 'Full name must be at least 2 characters' };
  }

  if (!/^[a-zA-Z\s'-]+$/.test(fullName)) {
    return { isValid: false, message: 'Full name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validates required field
 * @param {string|any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  return { isValid: true, message: '' };
};
