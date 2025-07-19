/**
 * Authentication hook for managing user authentication state
 * Provides login, register, logout, and session verification functionality
 */

import { useState, useEffect, useContext, createContext } from 'react';
import { useRouter } from 'next/navigation';
import authApi from '../utils/authApi';

// Create authentication context
const AuthContext = createContext(null);

/**
 * AuthProvider component to wrap application with authentication context
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  // Initialize authentication state on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Verify current session and get user data
        const result = await authApi.verifySession(true);
        
        if (result.success && result.data.valid && result.data.user) {
          setUser(result.data.user);
          setRole(result.data.role);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  /**
   * Login with email and password
   * @param {Object} credentials - Login credentials
   * @returns {Object} - Login result
   */
  const login = async (credentials) => {
    setLoading(true);
    
    try {
      const result = await authApi.login(credentials);
      
      if (result.success) {
        setUser(result.data.user);
        
        // If role information is available
        if (result.data.user?.organizationRole) {
          // Fetch role details if not included in the response
          try {
            const sessionResult = await authApi.verifySession(true);
            if (sessionResult.success && sessionResult.data.role) {
              setRole(sessionResult.data.role);
            }
          } catch (roleError) {
            console.error('Error fetching role details:', roleError);
          }
        }
      }
      
      return {
        success: result.success,
        message: result.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user with invitation token
   * @param {Object} userData - User registration data
   * @returns {Object} - Registration result
   */
  const register = async (userData) => {
    setLoading(true);
    
    try {
      const result = await authApi.register(userData);
      
      if (result.success) {
        setUser(result.data.user);
        
        // If role information is available
        if (result.data.organizationRole) {
          setRole(result.data.organizationRole);
        }
      }
      
      return {
        success: result.success,
        message: result.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout the current user
   * @param {boolean} allSessions - Whether to logout from all sessions
   * @returns {Object} - Logout result
   */
  const logout = async (allSessions = false) => {
    setLoading(true);
    
    try {
      const result = await authApi.logout(allSessions);
      
      // Clear user state regardless of API result
      setUser(null);
      setRole(null);
      
      // Redirect to login page
      router.push('/auth/login');
      
      return {
        success: true,
        message: result.message || 'Logout successful'
      };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still clear user state even if API call fails
      setUser(null);
      setRole(null);
      
      // Redirect to login page
      router.push('/auth/login');
      
      return {
        success: false,
        message: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean} - Whether user has the permission
   */
  const hasPermission = (permission) => {
    if (!user || !role || !role.permissions) {
      return false;
    }
    
    return role.permissions.some(p => 
      typeof p === 'string' ? p === permission : p.name === permission
    );
  };

  /**
   * Check if user has a specific role
   * @param {string} roleName - Role name to check
   * @returns {boolean} - Whether user has the role
   */
  const hasRole = (roleName) => {
    if (!user || !role) {
      return false;
    }
    
    return role.name === roleName;
  };

  // Context value
  const value = {
    user,
    role,
    loading,
    initialized,
    login,
    register,
    logout,
    hasPermission,
    hasRole,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 * @returns {Object} - Authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}