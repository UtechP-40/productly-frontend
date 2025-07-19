"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * AuthGuard Higher Order Component
 * Protects routes based on authentication status and role requirements
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 * @param {string[]} [props.requiredRoles] - Optional array of roles allowed to access the route
 * @param {string[]} [props.requiredPermissions] - Optional array of permissions required to access the route
 * @param {string} [props.redirectTo="/auth/login"] - Path to redirect to when authentication fails
 * @param {boolean} [props.loadingFallback=true] - Whether to show loading spinner during authentication check
 * @returns {React.ReactNode} Protected component or redirect
 */
export default function AuthGuard({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  redirectTo = "/auth/login",
  loadingFallback = true
}) {
  const { user, role, loading, initialized, isAuthenticated, hasRole, hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Store the current path for redirection after login
    if (!isAuthenticated && initialized && !loading) {
      // Only store path if it's not already a login-related path
      if (!pathname.startsWith('/auth/')) {
        sessionStorage.setItem('redirectAfterLogin', pathname);
      }
    }
  }, [pathname, isAuthenticated, initialized, loading]);

  useEffect(() => {
    const checkAuthorization = async () => {
      // Wait until auth is initialized and not loading
      if (!initialized) {
        return;
      }

      // If not authenticated, redirect to login
      if (!isAuthenticated && !loading) {
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
    redirectTo,
    pathname
  ]);

  // Show loading state while checking authentication
  if ((loading || isChecking) && loadingFallback) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show children only if authenticated and authorized
  return isAuthenticated && (requiredRoles.length === 0 || isAuthorized) ? children : null;
}