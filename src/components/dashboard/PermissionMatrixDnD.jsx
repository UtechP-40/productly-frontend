"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import LoadingSpinner from '../ui/LoadingSpinner';
import { EnhancedPermissionMatrix } from './EnhancedPermissionMatrix';
import { 
  Shield, 
  AlertTriangle,
  Save,
  X,
  Check,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

/**
 * Permission Matrix Component with Drag and Drop
 * Provides a visual interface for permission assignment with drag-and-drop functionality
 * 
 * @param {Object} props - Component props
 * @param {Object} props.selectedRole - The currently selected role
 * @param {Function} props.onSave - Callback when permissions are saved
 * @param {Function} props.onCancel - Callback when editing is cancelled
 * @param {boolean} props.readOnly - Whether the matrix is in read-only mode
 * @returns {React.ReactNode} Permission matrix component
 */
export function PermissionMatrixDnD({ 
  selectedRole,
  onSave,
  onCancel,
  readOnly = false
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [permissionMatrix, setPermissionMatrix] = useState(null);
  const [editedRole, setEditedRole] = useState(null);
  const [conflictingRoles, setConflictingRoles] = useState([]);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [conflictDetails, setConflictDetails] = useState(null);
  
  // Initialize edited role when selected role changes
  useEffect(() => {
    if (selectedRole) {
      setEditedRole({
        ...selectedRole,
        permissions: [...(selectedRole.permissions || [])]
      });
      
      // Fetch permission matrix
      fetchPermissionMatrix();
      
      // Fetch conflicting roles if not in read-only mode
      if (!readOnly) {
        fetchConflictingRoles(selectedRole._id);
      }
    }
  }, [selectedRole, readOnly]);
  
  // Fetch permission matrix from API
  const fetchPermissionMatrix = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/roles/permissions/matrix');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch permission matrix');
      }
      
      setPermissionMatrix(data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching permission matrix:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch conflicting roles from API
  const fetchConflictingRoles = async (roleId) => {
    try {
      const response = await fetch(`/api/roles/${roleId}/conflicts`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch conflicting roles');
      }
      
      setConflictingRoles(data.data || []);
    } catch (error) {
      console.error('Error fetching conflicting roles:', error);
      // Don't set error state here to avoid blocking the main functionality
    }
  };
  
  // Handle permission change
  const handlePermissionChange = useCallback((permissionId, isChecked) => {
    if (readOnly) return;
    
    setEditedRole(prev => {
      if (!prev) return prev;
      
      const updatedPermissions = isChecked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => 
            typeof p === 'object' ? p._id !== permissionId : p !== permissionId
          );
      
      return {
        ...prev,
        permissions: updatedPermissions
      };
    });
  }, [readOnly]);
  
  // Handle bulk permission change
  const handleBulkPermissionChange = useCallback((permissionIds, isChecked) => {
    if (readOnly) return;
    
    setEditedRole(prev => {
      if (!prev) return prev;
      
      let updatedPermissions;
      
      if (isChecked) {
        // Add permissions that aren't already in the list
        const currentPermissionIds = prev.permissions.map(p => 
          typeof p === 'object' ? p._id : p
        );
        
        const newPermissions = permissionIds.filter(id => !currentPermissionIds.includes(id));
        updatedPermissions = [...prev.permissions, ...newPermissions];
      } else {
        // Remove the specified permissions
        updatedPermissions = prev.permissions.filter(p => {
          const pId = typeof p === 'object' ? p._id : p;
          return !permissionIds.includes(pId);
        });
      }
      
      return {
        ...prev,
        permissions: updatedPermissions
      };
    });
  }, [readOnly]);
  
  // Check for conflicts before saving
  const checkConflicts = async () => {
    if (!editedRole || readOnly) return;
    
    try {
      setSaving(true);
      
      // If we have conflicting roles, check if the edited permissions would cause conflicts
      if (conflictingRoles.length > 0) {
        // Get the current permissions
        const currentPermissions = editedRole.permissions.map(p => 
          typeof p === 'object' ? p._id : p
        );
        
        // Check each conflicting role for permission overlaps
        const conflicts = [];
        
        conflictingRoles.forEach(role => {
          const rolePermissions = role.permissions.map(p => 
            typeof p === 'object' ? p._id : p
          );
          
          // Find overlapping permissions
          const overlapping = currentPermissions.filter(p => rolePermissions.includes(p));
          
          if (overlapping.length > 0) {
            // Find permission details for each overlapping permission
            const detailedOverlaps = overlapping.map(permId => {
              // Find permission details in the matrix
              let permissionDetails = null;
              
              if (permissionMatrix) {
                Object.values(permissionMatrix.permissions).flat().forEach(p => {
                  if (p._id === permId) {
                    permissionDetails = p;
                  }
                });
              }
              
              return {
                id: permId,
                name: permissionDetails ? permissionDetails.name : permId
              };
            });
            
            conflicts.push({
              role: role.name,
              roleId: role._id,
              permissions: detailedOverlaps
            });
          }
        });
        
        if (conflicts.length > 0) {
          setConflictDetails({
            conflicts,
            totalConflicts: conflicts.reduce((acc, curr) => acc + curr.permissions.length, 0)
          });
          setShowConflictDialog(true);
          setSaving(false);
          return;
        }
      }
      
      // No conflicts, proceed with save
      handleSave();
    } catch (error) {
      console.error('Error checking conflicts:', error);
      setError('Failed to check for permission conflicts');
      setSaving(false);
    }
  };
  
  // Handle save
  const handleSave = () => {
    if (!editedRole || readOnly) return;
    
    try {
      setSaving(true);
      
      // Prepare permissions for saving (convert objects to IDs)
      const permissionsToSave = editedRole.permissions.map(p => 
        typeof p === 'object' ? p._id : p
      );
      
      // Call the onSave callback with the updated role
      onSave({
        ...editedRole,
        permissions: permissionsToSave
      });
      
      setError(null);
    } catch (error) {
      console.error('Error saving permissions:', error);
      setError('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };
  
  // Render conflict dialog
  const renderConflictDialog = () => (
    <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-amber-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Permission Conflicts Detected
          </DialogTitle>
          <DialogDescription>
            The permissions you've selected conflict with other roles in your organization.
          </DialogDescription>
        </DialogHeader>
        
        {conflictDetails && (
          <div className="py-4">
            <Alert className="bg-amber-50 border-amber-200 mb-4">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">
                {conflictDetails.totalConflicts} permission conflict{conflictDetails.totalConflicts !== 1 ? 's' : ''} detected
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                <div className="mt-2 max-h-48 overflow-y-auto">
                  {conflictDetails.conflicts.map((conflict, index) => (
                    <div key={index} className="mb-3">
                      <h4 className="font-medium text-amber-800">
                        Role: {conflict.role}
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
                        {conflict.permissions.map((perm, idx) => (
                          <li key={idx}>{perm.name}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
            
            <p className="text-gray-600 text-sm mb-4">
              Continuing will create overlapping permissions between roles. This may lead to users having unintended access levels.
            </p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConflictDialog(false)}>
            <X className="h-4 w-4 mr-2" />
            Review Permissions
          </Button>
          <Button 
            onClick={() => {
              setShowConflictDialog(false);
              handleSave();
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Check className="h-4 w-4 mr-2" />
            Save Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  // If no role is selected, show empty state
  if (!selectedRole) {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Role Selected</h3>
          <p className="text-gray-500 text-center max-w-md">
            Select a role from the list to view and manage its permissions.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          {readOnly ? 'View' : 'Edit'} Permissions: {selectedRole.name}
        </CardTitle>
        <CardDescription>
          {readOnly 
            ? 'View the permissions assigned to this role' 
            : 'Manage permissions for this role using drag and drop or checkboxes'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
                onClick={fetchPermissionMatrix}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <EnhancedPermissionMatrix
          selectedRole={editedRole}
          permissionMatrix={permissionMatrix}
          onPermissionChange={handlePermissionChange}
          onBulkPermissionChange={handleBulkPermissionChange}
          readOnly={readOnly}
          loading={loading}
          conflictingRoles={conflictingRoles}
        />
        
        {!readOnly && (
          <div className="flex items-center justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onCancel} disabled={saving}>
              Cancel
            </Button>
            <Button 
              onClick={checkConflicts} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={saving || loading || !editedRole}
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Permissions
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Conflict Dialog */}
      {renderConflictDialog()}
    </Card>
  );
}