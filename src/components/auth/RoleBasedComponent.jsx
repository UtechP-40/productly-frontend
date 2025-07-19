"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';
import { cn } from '../../lib/utils';

/**
 * RoleBasedComponent Wrapper
 * Provides dynamic component rendering based on user roles with support for role hierarchy and inheritance
 * 
 * @param {Object} props - Component props
 * @param {Object} props.components - Map of components to render based on roles
 * @param {React.ReactNode} props.components.default - Default component to render if no role matches
 * @param {React.ReactNode} props.components[roleName] - Component to render for specific role
 * @param {Object} props.roleHierarchy - Optional role hierarchy definition for inheritance
 * @param {boolean} props.debug - Whether to show debugging information
 * @param {boolean} props.showLoading - Whether to show loading state while checking roles
 * @param {string} props.className - Additional CSS classes for the container
 * @returns {React.ReactNode} The component corresponding to the user's role
 */
export default function RoleBasedComponent({
  components,
  roleHierarchy = {},
  debug = false,
  showLoading = true,
  className
}) {
  const { user, role, loading, initialized, isAuthenticated } = useAuth();
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [isChecking, setIsChecking] = useState(true);

  // Create a memoized cache of role inheritance
  const roleInheritanceCache = useMemo(() => {
    const cache = {};
    
    // Helper function to recursively build inheritance chain
    const buildInheritanceChain = (roleName, visited = new Set()) => {
      // Prevent circular references
      if (visited.has(roleName)) return [];
      
      visited.add(roleName);
      const inheritedRoles = roleHierarchy[roleName] || [];
      
      // Recursively get inherited roles from parent roles
      const deepInheritedRoles = inheritedRoles.flatMap(
        parentRole => [parentRole, ...buildInheritanceChain(parentRole, new Set(visited))]
      );
      
      // Return unique roles
      return [...new Set(deepInheritedRoles)];
    };
    
    // Build cache for each role
    Object.keys(roleHierarchy).forEach(roleName => {
      cache[roleName] = buildInheritanceChain(roleName);
    });
    
    return cache;
  }, [roleHierarchy]);

  // Check if a user has a role, including through inheritance
  const hasRoleWithInheritance = useCallback((userRole, requiredRole) => {
    if (!userRole || !requiredRole) return false;
    
    // Direct match
    if (userRole.name === requiredRole) return true;
    
    // Check inheritance
    const inheritedRoles = roleInheritanceCache[userRole.name] || [];
    return inheritedRoles.includes(requiredRole);
  }, [roleInheritanceCache]);

  // Select the appropriate component based on user role
  useEffect(() => {
    const selectComponent = () => {
      // Wait until auth is initialized
      if (!initialized) {
        return;
      }

      const debugData = {
        timestamp: new Date().toISOString(),
        userAuthenticated: isAuthenticated,
        userRole: role?.name || 'none',
        availableRoles: Object.keys(components).filter(key => key !== 'default'),
        roleHierarchy: roleHierarchy,
        inheritanceCache: roleInheritanceCache,
      };

      // If not authenticated, use default component
      if (!isAuthenticated || !role) {
        setSelectedComponent('default');
        debugData.selectedComponent = 'default';
        debugData.reason = 'User not authenticated or no role assigned';
        setDebugInfo(debugData);
        setIsChecking(false);
        return;
      }

      // Find the most specific component for the user's role
      const userRoleName = role.name;
      
      // First check for exact role match
      if (components[userRoleName]) {
        setSelectedComponent(userRoleName);
        debugData.selectedComponent = userRoleName;
        debugData.reason = 'Direct role match';
        setDebugInfo(debugData);
        setIsChecking(false);
        return;
      }
      
      // Then check for inherited roles
      const availableRoles = Object.keys(components).filter(key => key !== 'default');
      
      for (const availableRole of availableRoles) {
        if (hasRoleWithInheritance(role, availableRole)) {
          setSelectedComponent(availableRole);
          debugData.selectedComponent = availableRole;
          debugData.reason = `Inherited role match (${userRoleName} inherits ${availableRole})`;
          setDebugInfo(debugData);
          setIsChecking(false);
          return;
        }
      }
      
      // Fallback to default component
      setSelectedComponent('default');
      debugData.selectedComponent = 'default';
      debugData.reason = 'No matching role found, using default';
      setDebugInfo(debugData);
      setIsChecking(false);
    };

    selectComponent();
  }, [
    initialized,
    isAuthenticated,
    role,
    components,
    hasRoleWithInheritance,
    roleInheritanceCache,
    roleHierarchy
  ]);

  // Show loading state while checking roles
  if ((loading || isChecking) && showLoading) {
    return (
      <div className={cn("py-2", className)}>
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  // Render debug information if enabled
  const renderDebugInfo = () => {
    if (!debug) return null;
    
    return (
      <div className="mt-2 p-2 text-xs border border-dashed border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded">
        <details>
          <summary className="font-medium cursor-pointer">RoleBasedComponent Debug Info</summary>
          <div className="mt-1 space-y-1">
            <p><span className="font-medium">User:</span> {debugInfo.userAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
            <p><span className="font-medium">Role:</span> {debugInfo.userRole}</p>
            <p><span className="font-medium">Selected Component:</span> {debugInfo.selectedComponent}</p>
            <p><span className="font-medium">Reason:</span> {debugInfo.reason}</p>
            <p><span className="font-medium">Available Components:</span> {debugInfo.availableRoles?.join(', ') || 'None'}</p>
            
            {Object.keys(roleHierarchy).length > 0 && (
              <div>
                <p className="font-medium">Role Hierarchy:</p>
                <ul className="ml-4 list-disc">
                  {Object.entries(roleHierarchy).map(([role, inherits]) => (
                    <li key={role}>
                      {role} → {inherits.join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </details>
      </div>
    );
  };

  // Render the selected component with debug info if enabled
  return (
    <div className={className}>
      {components[selectedComponent] || components.default || null}
      {debug && renderDebugInfo()}
    </div>
  );
}