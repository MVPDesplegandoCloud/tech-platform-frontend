import { useState, useCallback } from 'react';

/**
 * useForm Hook - Manages form state and events
 * Handles form data, touched fields, and change events
 * 
 * @param {object} initialState - Initial form values
 * @returns {object} - Form state and handlers
 */
export const useForm = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [touched, setTouched] = useState(
    Object.keys(initialState).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {})
  );

  /**
   * Handles input changes
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  /**
   * Handles field blur to mark as touched
   */
  const handleBlur = useCallback((fieldName) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  }, []);

  /**
   * Resets form to initial state
   */
  const reset = useCallback(() => {
    setFormData(initialState);
    setTouched(
      Object.keys(initialState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {})
    );
  }, [initialState]);

  /**
   * Sets specific field value
   */
  const setFieldValue = useCallback((fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  return {
    formData,
    touched,
    handleChange,
    handleBlur,
    reset,
    setFieldValue,
  };
};

export default useForm;
