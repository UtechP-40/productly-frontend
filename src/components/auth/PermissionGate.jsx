"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';
import { cn } from '../../lib/utils';

/**
 * PermissionGate Component
 * Provides component-level permission checking and conditional rendering based on user roles and permissions
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render when authorized
 * @param {React.ReactNode} props.fallback - Content to render when unauthorized (defaults to null)
 * @param {string[]} props.requiredRoles - Array of roles that can access the content
 * @param {string[]} props.requiredPermissions - Array of permissions required to access the content
 * @param {string} props.requirementType - How to evaluate multiple requirements: "ANY" (OR logic) or "ALL" (AND logic)
 * @param {boolean} props.showLoading - Whether to show loading state while checking permissions
 * @param {string} props.className - Additional CSS classes for the container
 * @returns {React.ReactNode} Protected content or fallback
 */
export default function PermissionGate({
  children,
  fallback = null,
  requiredRoles = [],
  requiredPermissions = [],
  requirementType = "ANY",
  showLoading = true,
  className
}) {
  const { user, role, loading, initialized, isAuthenticated, hasRole, hasPermission } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthorization = () => {
      // Wait until auth is initialized
      if (!initialized) {
        return;
      }

      // If not authenticated, not authorized
      if (!isAuthenticated) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // If no specific requirements, authorized if authenticated
      if (requiredRoles.length === 0 && requiredPermissions.length === 0) {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // Check authorization based on requirement type
      let roleAuthorized = requiredRoles.length === 0;
      let permissionAuthorized = requiredPermissions.length === 0;

      // Check roles if required
      if (requiredRoles.length > 0) {
        roleAuthorized = requiredRoles.some(roleName => hasRole(roleName));
      }

      // Check permissions if required
      if (requiredPermissions.length > 0) {
        permissionAuthorized = requiredPermissions.every(permission => hasPermission(permission));
      }

      // Determine final authorization based on requirement type
      if (requirementType === "ALL") {
        // AND logic - need both role and permission if both are specified
        setIsAuthorized(
          (requiredRoles.length === 0 || roleAuthorized) && 
          (requiredPermissions.length === 0 || permissionAuthorized)
        );
      } else {
        // OR logic - need either role or permission
        setIsAuthorized(
          (requiredRoles.length > 0 && roleAuthorized) || 
          (requiredPermissions.length > 0 && permissionAuthorized) ||
          (requiredRoles.length === 0 && requiredPermissions.length === 0)
        );
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
    requirementType,
    hasRole,
    hasPermission
  ]);

  // Show loading state while checking permissions
  if ((loading || isChecking) && showLoading) {
    return (
      <div className={cn("py-2", className)}>
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  // Show children if authorized, fallback if not
  return (
    <div className={className}>
      {isAuthenticated && isAuthorized ? children : fallback}
    </div>
  );
}