/**
 * Authentication API client
 * Handles all authentication-related API requests with validation and sanitization
 */

import axios from 'axios';
import { sanitizeObject, validateLoginForm, validateRegistrationForm, isValidInvitationToken } from './validation';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for validation and sanitization
api.interceptors.request.use(
  (config) => {
    // Don't sanitize GET requests
    if (config.method.toLowerCase() === 'get') {
      return config;
    }
    
    // Sanitize request data for POST, PUT, PATCH requests
    if (config.data) {
      config.data = sanitizeObject(config.data);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status
      const status = error.response.status;
      
      // Handle authentication errors
      if (status === 401) {
        // Session expired or unauthorized
        // You could trigger a logout or redirect to login here
        console.error('Authentication error: Session expired or unauthorized');
      } else if (status === 403) {
        // Forbidden - user doesn't have permission
        console.error('Authorization error: Insufficient permissions');
      } else if (status === 429) {
        // Rate limiting
        console.error('Rate limit exceeded. Please try again later.');
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error('Network error: No response received from server');
    }
    
    return Promise.reject(error);
  }
);

/**
 * Authentication API methods
 */
const authApi = {
  /**
   * Login with email and password
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @param {boolean} credentials.rememberMe - Remember me option
   * @returns {Promise} - API response
   */
  login: async (credentials) => {
    // Validate login form data
    const validation = validateLoginForm(credentials);
    if (!validation.isValid) {
      return Promise.reject({
        message: 'Invalid form data',
        errors: validation.errors
      });
    }
    
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error) {
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Register a new user with invitation token
   * @param {Object} userData - User registration data
   * @param {string} userData.firstName - User first name
   * @param {string} userData.lastName - User last name
   * @param {string} userData.password - User password
   * @param {string} userData.token - Invitation token
   * @returns {Promise} - API response
   */
  register: async (userData) => {
    // Validate registration form data
    const validation = validateRegistrationForm(userData);
    if (!validation.isValid) {
      return Promise.reject({
        message: 'Invalid form data',
        errors: validation.errors
      });
    }
    
    try {
      const response = await api.post('/register', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password,
        invitationToken: userData.token
      });
      return response.data;
    } catch (error) {
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Verify an invitation token
   * @param {string} token - Invitation token
   * @returns {Promise} - API response
   */
  verifyInvitation: async (token) => {
    // Validate token format
    if (!isValidInvitationToken(token)) {
      return Promise.reject({
        message: 'Invalid invitation token format'
      });
    }
    
    try {
      const response = await api.get(`/verify-invitation?token=${encodeURIComponent(token)}`);
      return response.data;
    } catch (error) {
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || 'Failed to verify invitation. Please try again.';
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Logout the current user
   * @param {boolean} allSessions - Whether to logout from all sessions
   * @returns {Promise} - API response
   */
  logout: async (allSessions = false) => {
    try {
      const response = await api.post('/logout', { allSessions });
      return response.data;
    } catch (error) {
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || 'Logout failed. Please try again.';
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Get current user information
   * @returns {Promise} - API response
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || 'Failed to get user information.';
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Verify if the current session is valid
   * @param {boolean} includeUser - Whether to include user data in the response
   * @returns {Promise} - API response
   */
  verifySession: async (includeUser = false) => {
    try {
      const response = await api.get(`/verify-session${includeUser ? '?includeUser=true' : ''}`);
      return response.data;
    } catch (error) {
      // For session verification, we don't throw an error
      // Instead, return an object indicating the session is invalid
      return {
        success: false,
        data: {
          valid: false
        },
        message: 'Invalid or expired session'
      };
    }
  },
  
  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Promise} - API response
   */
  validatePassword: async (password) => {
    try {
      const response = await api.post('/validate-password', { password });
      return response.data;
    } catch (error) {
      // Extract error message from response if available
      return {
        success: false,
        data: error.response?.data?.data || {
          valid: false,
          score: 0,
          feedback: {
            warning: 'Password is too weak',
            suggestions: ['Use a stronger password']
          }
        },
        message: error.response?.data?.message || 'Password validation failed'
      };
    }
  }
};

export default authApi;