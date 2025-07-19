"use client";

import { AuthProvider } from '../hooks/useAuth';

/**
 * AuthProviderWrapper component
 * Wraps the application with the AuthProvider
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactNode} Wrapped children with AuthProvider
 */
export default function AuthProviderWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}