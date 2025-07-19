/**
 * Session Manager Utility
 * Handles session timeout tracking and management
 */

import authApi from './authApi';

class SessionManager {
  constructor() {
    this.sessionTimeoutId = null;
    this.warningTimeoutId = null;
    this.sessionDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
    this.warningTime = 5 * 60 * 1000; // 5 minutes before expiry
    this.listeners = [];
    this.lastActivity = Date.now();
    this.isActive = false;
  }

  /**
   * Initialize session tracking
   * @param {Object} options - Configuration options
   * @param {number} options.sessionDuration - Session duration in milliseconds
   * @param {number} options.warningTime - Warning time before expiry in milliseconds
   */
  initialize(options = {}) {
    // Clear any existing timers
    this.clearTimers();
    
    // Set options
    if (options.sessionDuration) {
      this.sessionDuration = options.sessionDuration;
    }
    
    if (options.warningTime) {
      this.warningTime = options.warningTime;
    }
    
    // Start tracking
    this.startTracking();
  }

  /**
   * Start tracking user activity and session timeout
   */
  startTracking() {
    // Set initial activity time
    this.lastActivity = Date.now();
    this.isActive = true;
    
    // Set up activity listeners
    this.setupActivityListeners();
    
    // Start session timeout
    this.resetTimers();
  }

  /**
   * Stop tracking user activity and session timeout
   */
  stopTracking() {
    this.clearTimers();
    this.removeActivityListeners();
    this.isActive = false;
  }

  /**
   * Set up activity listeners to track user activity
   */
  setupActivityListeners() {
    // Track user activity events
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const activityHandler = () => {
      this.updateActivity();
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, activityHandler, { passive: true });
    });
    
    // Store the handler for later removal
    this.activityHandler = activityHandler;
    this.activityEvents = activityEvents;
  }

  /**
   * Remove activity listeners
   */
  removeActivityListeners() {
    if (this.activityHandler && this.activityEvents) {
      this.activityEvents.forEach(event => {
        document.removeEventListener(event, this.activityHandler);
      });
    }
  }

  /**
   * Update last activity time and reset timers
   */
  updateActivity() {
    this.lastActivity = Date.now();
    this.resetTimers();
  }

  /**
   * Reset session and warning timers
   */
  resetTimers() {
    this.clearTimers();
    
    // Set warning timeout
    const timeUntilWarning = this.sessionDuration - this.warningTime;
    this.warningTimeoutId = setTimeout(() => {
      this.notifyListeners('warning', {
        timeRemaining: this.warningTime
      });
    }, timeUntilWarning);
    
    // Set session timeout
    this.sessionTimeoutId = setTimeout(() => {
      this.notifyListeners('timeout', {});
    }, this.sessionDuration);
  }

  /**
   * Clear all timers
   */
  clearTimers() {
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
    }
    
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
    }
  }

  /**
   * Extend the current session
   * @returns {Promise} - API response
   */
  async extendSession() {
    try {
      // Call API to refresh token
      const response = await authApi.refreshToken();
      
      // Reset timers
      this.resetTimers();
      
      // Notify listeners
      this.notifyListeners('extended', {});
      
      return response;
    } catch (error) {
      console.error('Failed to extend session:', error);
      throw error;
    }
  }

  /**
   * Get time remaining in session
   * @returns {Object} - Time remaining information
   */
  getTimeRemaining() {
    const now = Date.now();
    const elapsed = now - this.lastActivity;
    const remaining = Math.max(0, this.sessionDuration - elapsed);
    
    // Convert to minutes and seconds
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return {
      total: remaining,
      minutes,
      seconds,
      formatted: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    };
  }

  /**
   * Add event listener
   * @param {Function} listener - Event listener function
   */
  addEventListener(listener) {
    if (typeof listener === 'function' && !this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
  }

  /**
   * Remove event listener
   * @param {Function} listener - Event listener function to remove
   */
  removeEventListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of an event
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in session listener:', error);
      }
    });
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager;