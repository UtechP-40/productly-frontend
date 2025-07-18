"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Create auth context
const AuthContext = createContext({
  user: null,
  role: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  refreshSession: async () => {},
});

/**
 * Auth Provider component to wrap the application
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Fetch current user on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        if (response.data.success) {
          setUser(response.data.data.user);
          setRole(response.data.data.user.organizationRole);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Login function
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @param {boolean} credentials.rememberMe - Remember me option
   * @returns {Promise} Login result
   */
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/login",
        credentials,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Fetch user data after successful login
        await refreshSession();
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed"
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   * @param {boolean} allSessions - Whether to logout from all sessions
   * @returns {Promise} Logout result
   */
  const logout = async (allSessions = false) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/logout",
        { allSessions },
        { withCredentials: true }
      );

      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      
      // Redirect to login page
      router.push("/auth/login");
      
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Logout failed"
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh user session
   * @returns {Promise} Session refresh result
   */
  const refreshSession = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      if (response.data.success) {
        setUser(response.data.data.user);
        setRole(response.data.data.user.organizationRole);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Session refresh error:", error);
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      return {
        success: false,
        message: error.response?.data?.message || "Session refresh failed"
      };
    }
  };

  // Context value
  const value = {
    user,
    role,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 * @returns {Object} Auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default useAuth;