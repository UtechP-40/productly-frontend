/**
 * CSRF Protection Utilities
 * Provides functions for generating and validating CSRF tokens
 */

/**
 * Generate a random CSRF token
 * @returns {string} - Random CSRF token
 */
export const generateCsrfToken = () => {
  // Generate a random string of 32 characters
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Store CSRF token in session storage
 * @param {string} token - CSRF token to store
 */
export const storeCsrfToken = (token) => {
  sessionStorage.setItem('csrfToken', token);
};

/**
 * Get stored CSRF token from session storage
 * @returns {string|null} - Stored CSRF token or null if not found
 */
export const getCsrfToken = () => {
  return sessionStorage.getItem('csrfToken');
};

/**
 * Generate and store a new CSRF token
 * @returns {string} - New CSRF token
 */
export const refreshCsrfToken = () => {
  const token = generateCsrfToken();
  storeCsrfToken(token);
  return token;
};

/**
 * Validate a CSRF token against the stored token
 * @param {string} token - CSRF token to validate
 * @returns {boolean} - Whether the token is valid
 */
export const validateCsrfToken = (token) => {
  const storedToken = getCsrfToken();
  return storedToken && token === storedToken;
};

/**
 * Add CSRF token to form data
 * @param {Object} formData - Form data to add token to
 * @returns {Object} - Form data with CSRF token
 */
export const addCsrfToken = (formData) => {
  // Get or generate CSRF token
  let token = getCsrfToken();
  if (!token) {
    token = refreshCsrfToken();
  }
  
  // Add token to form data
  return {
    ...formData,
    csrfToken: token
  };
};

/**
 * Create a CSRF protected form submission handler
 * @param {Function} submitHandler - Original form submission handler
 * @returns {Function} - CSRF protected form submission handler
 */
export const withCsrfProtection = (submitHandler) => {
  return (formData) => {
    // Add CSRF token to form data
    const protectedData = addCsrfToken(formData);
    
    // Call original submit handler with protected data
    return submitHandler(protectedData);
  };
};