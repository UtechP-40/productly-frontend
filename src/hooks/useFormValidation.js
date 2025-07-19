/**
 * Form validation hook
 * Provides form validation functionality with error handling
 */

import { useState, useCallback } from 'react';
import { sanitizeObject } from '../utils/validation';
import { addCsrfToken } from '../utils/csrfProtection';

/**
 * Hook for form validation and submission
 * @param {Object} options - Hook options
 * @param {Function} options.validationSchema - Zod validation schema
 * @param {Function} options.onSubmit - Form submission handler
 * @param {Object} options.initialValues - Initial form values
 * @param {boolean} options.enableCsrf - Whether to enable CSRF protection
 * @returns {Object} - Form validation state and handlers
 */
export function useFormValidation({
  validationSchema,
  onSubmit,
  initialValues = {},
  enableCsrf = true
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [touched, setTouched] = useState({});

  /**
   * Handle input change
   * @param {Event} e - Input change event
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const inputValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  /**
   * Handle input blur
   * @param {Event} e - Input blur event
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field
    validateField(name);
  }, [values]);

  /**
   * Validate a specific field
   * @param {string} fieldName - Field name to validate
   * @returns {boolean} - Whether the field is valid
   */
  const validateField = useCallback((fieldName) => {
    try {
      // Create a partial schema for just this field
      const fieldValue = values[fieldName];
      const fieldSchema = validationSchema.shape[fieldName];
      
      if (!fieldSchema) return true;
      
      // Validate just this field
      fieldSchema.parse(fieldValue);
      
      // Clear error for this field
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined
      }));
      
      return true;
    } catch (error) {
      // Set error for this field
      const fieldError = error.errors?.[0]?.message || 'Invalid value';
      
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldError
      }));
      
      return false;
    }
  }, [values, validationSchema]);

  /**
   * Validate all form fields
   * @returns {boolean} - Whether the form is valid
   */
  const validateForm = useCallback(() => {
    try {
      // Validate all fields
      validationSchema.parse(values);
      
      // Clear all errors
      setErrors({});
      
      return true;
    } catch (error) {
      // Set errors for each field
      const fieldErrors = {};
      
      error.errors?.forEach(err => {
        const fieldName = err.path?.[0];
        if (fieldName) {
          fieldErrors[fieldName] = err.message;
        }
      });
      
      setErrors(fieldErrors);
      
      // Mark all fields with errors as touched
      setTouched(prev => ({
        ...prev,
        ...Object.keys(fieldErrors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      }));
      
      return false;
    }
  }, [values, validationSchema]);

  /**
   * Handle form submission
   * @param {Event} e - Form submission event
   */
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    
    // Clear submit error
    setSubmitError('');
    
    // Validate form
    const isValid = validateForm();
    
    if (!isValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Sanitize form values
      const sanitizedValues = sanitizeObject(values);
      
      // Add CSRF token if enabled
      const submissionValues = enableCsrf 
        ? addCsrfToken(sanitizedValues) 
        : sanitizedValues;
      
      // Submit form
      await onSubmit(submissionValues);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Set submit error
      setSubmitError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, enableCsrf]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitError('');
  }, [initialValues]);

  /**
   * Set a specific field value
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    validateField,
    validateForm,
    resetForm,
    setFieldValue,
    setValues
  };
}