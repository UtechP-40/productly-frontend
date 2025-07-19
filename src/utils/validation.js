/**
 * Validation and sanitization utilities for frontend authentication
 * Provides functions to validate and sanitize user input before sending to the API
 */

/**
 * Sanitizes a string by trimming and removing potentially dangerous characters
 * @param {string} input - The input string to sanitize
 * @returns {string} - The sanitized string
 */
export const sanitizeString = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  // Trim whitespace
  let sanitized = input.trim();
  
  // Remove potentially dangerous characters (script tags, etc.)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  return sanitized;
};

/**
 * Sanitizes an email address
 * @param {string} email - The email to sanitize
 * @returns {string} - The sanitized email
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  
  // Trim whitespace and convert to lowercase
  return email.trim().toLowerCase();
};

/**
 * Validates an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password strength
 * @param {string} password - The password to validate
 * @returns {Object} - Object containing validation result and feedback
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      score: 0,
      feedback: {
        warning: "Password is required",
        suggestions: ["Please enter a password"]
      }
    };
  }
  
  // Check minimum length
  if (password.length < 8) {
    return {
      isValid: false,
      score: 1,
      feedback: {
        warning: "Password is too short",
        suggestions: ["Use at least 8 characters"]
      }
    };
  }
  
  // Initialize score
  let score = 0;
  const feedback = {
    warning: "",
    suggestions: []
  };
  
  // Check for various character types
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
  
  // Increment score based on character types
  if (hasLowercase) score++;
  if (hasUppercase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChars) score++;
  
  // Additional score for length
  if (password.length >= 12) score++;
  
  // Generate feedback based on score
  if (score < 3) {
    feedback.warning = "Password is weak";
    if (!hasLowercase) feedback.suggestions.push("Add lowercase letters");
    if (!hasUppercase) feedback.suggestions.push("Add uppercase letters");
    if (!hasNumbers) feedback.suggestions.push("Add numbers");
    if (!hasSpecialChars) feedback.suggestions.push("Add special characters");
  } else if (score < 4) {
    feedback.warning = "Password is moderate";
    if (!hasSpecialChars) feedback.suggestions.push("Add special characters for stronger password");
    if (password.length < 12) feedback.suggestions.push("Use a longer password for better security");
  }
  
  return {
    isValid: score >= 3,
    score,
    feedback
  };
};

/**
 * Validates an invitation token format
 * @param {string} token - The token to validate
 * @returns {boolean} - Whether the token format is valid
 */
export const isValidInvitationToken = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  // Token should be alphanumeric and have a reasonable length
  return /^[A-Za-z0-9_-]{20,128}$/.test(token);
};

/**
 * Sanitizes an object by sanitizing all string properties
 * @param {Object} data - The object to sanitize
 * @returns {Object} - The sanitized object
 */
export const sanitizeObject = (data) => {
  if (!data || typeof data !== 'object') return {};
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else {
        sanitized[key] = sanitizeString(value);
      }
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Validates login form data
 * @param {Object} data - The login form data
 * @returns {Object} - Object containing validation result and errors
 */
export const validateLoginForm = (data) => {
  const errors = {};
  
  // Validate email
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Invalid email format";
  }
  
  // Validate password
  if (!data.password) {
    errors.password = "Password is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates registration form data
 * @param {Object} data - The registration form data
 * @returns {Object} - Object containing validation result and errors
 */
export const validateRegistrationForm = (data) => {
  const errors = {};
  
  // Validate first name
  if (!data.firstName) {
    errors.firstName = "First name is required";
  } else if (data.firstName.length > 50) {
    errors.firstName = "First name cannot exceed 50 characters";
  }
  
  // Validate last name
  if (!data.lastName) {
    errors.lastName = "Last name is required";
  } else if (data.lastName.length > 50) {
    errors.lastName = "Last name cannot exceed 50 characters";
  }
  
  // Validate password
  if (!data.password) {
    errors.password = "Password is required";
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.feedback.warning;
    }
  }
  
  // Validate password confirmation
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  
  // Validate invitation token
  if (!data.token) {
    errors.token = "Invitation token is required";
  } else if (!isValidInvitationToken(data.token)) {
    errors.token = "Invalid invitation token format";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};