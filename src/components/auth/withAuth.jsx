"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * withAuth Higher Order Component
 * Wraps a component with authentication and authorization checks
 * 
 * @param {React.ComponentType} Component - Component to wrap
 * @param {Object} options - Authentication options
 * @param {string[]} [options.requiredRoles] - Optional array of roles allowed to access the component
 * @param {string[]} [options.requiredPermissions] - Optional array of permissions required to access the component
 * @param {string} [options.redirectTo="/auth/login"] - Path to redirect to when authentication fails
 * @param {boolean} [options.loadingFallback=true] - Whether to show loading spinner during authentication check
 * @returns {React.ComponentType} Protected component
 */
export default function withAuth(Component, options = {}) {
  const {
    requiredRoles = [],
    requiredPermissions = [],
    redirectTo = "/auth/login",
    loadingFallback = true
  } = options;

  // Return a new component that includes authentication logic
  return function ProtectedComponent(props) {
    const { user, role, loading, initialized, isAuthenticated, hasRole, hasPermission } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      // Store the current path for redirection after login
      if (!isAuthenticated && initialized && !loading) {
        // Only store path if it's not already a login-related path
        const pathname = window.location.pathname;
        if (!pathname.startsWith('/auth/')) {
          sessionStorage.setItem('redirectAfterLogin', pathname);
        }
      }
    }, [isAuthenticated, initialized, loading]);

    useEffect(() => {
      const checkAuthorization = async () => {
        // Wait until auth is initialized and not loading
        if (!initialized) {
          return;
        }

        // If not authenticated, redirect to login
        if (!isAuthenticated && !loading) {
          const pathname = window.location.pathname;
          router.push(`${redirectTo}?from=${encodeURIComponent(pathname)}`);
          return;
        }

        // If authenticated but we need to check roles/permissions
        if (isAuthenticated && !loading) {
          let authorized = true;

          // Check required roles if specified
          if (requiredRoles.length > 0) {
            authorized = requiredRoles.some(roleName => hasRole(roleName));
          }

          // Check required permissions if specified and still authorized
          if (authorized && requiredPermissions.length > 0) {
            authorized = requiredPermissions.every(permission => hasPermission(permission));
          }

          setIsAuthorized(authorized);

          // If not authorized, redirect to unauthorized page
          if (!authorized) {
            router.push('/unauthorized');
          }
        }

        setIsChecking(false);
      };

      checkAuthorization();
    }, [
      initialized, 
      isAuthenticated, 
      loading, 
      user, 
      role, 
      requiredRoles, 
      requiredPermissions, 
      hasRole, 
      hasPermission, 
      router, 
      redirectTo
    ]);

    // Show loading state while checking authentication
    if ((loading || isChecking) && loadingFallback) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    // Show component only if authenticated and authorized
    return isAuthenticated && (requiredRoles.length === 0 || isAuthorized) ? <Component {...props} /> : null;
  };
}