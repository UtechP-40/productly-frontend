"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  Shield, 
  AlertTriangle,
  Lock,
  Info,
  Check,
  X,
  MoveHorizontal,
  Layers,
  Copy,
  CheckSquare,
  Square,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Enhanced Permission Matrix Component
 * Provides a visual interface for permission assignment with drag-and-drop functionality
 * 
 * @param {Object} props - Component props
 * @param {Object} props.selectedRole - The currently selected role
 * @param {Object} props.permissionMatrix - The permission matrix data
 * @param {Function} props.onPermissionChange - Callback when permissions change
 * @param {Function} props.onBulkPermissionChange - Callback for bulk permission changes
 * @param {boolean} props.readOnly - Whether the matrix is in read-only mode
 * @param {boolean} props.loading - Whether the matrix is loading
 * @param {Array} props.conflictingRoles - Array of roles that have conflicting permissions
 * @returns {React.ReactNode} Enhanced permission matrix component
 */
export function EnhancedPermissionMatrix({ 
  selectedRole, 
  permissionMatrix, 
  onPermissionChange,
  onBulkPermissionChange,
  readOnly = false,
  loading = false,
  conflictingRoles = []
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [draggedPermission, setDraggedPermission] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [showConflicts, setShowConflicts] = useState(false);
  const dropZoneRef = useRef(null);
  
  // Initialize selected permissions when role changes
  useEffect(() => {
    setSelectedPermissions([]);
    setShowBulkActions(false);
    
    // Check for conflicts when role changes
    if (selectedRole && conflictingRoles.length > 0) {
      const newConflicts = detectConflicts();
      setConflicts(newConflicts);
      setShowConflicts(newConflicts.length > 0);
    } else {
      setConflicts([]);
      setShowConflicts(false);
    }
  }, [selectedRole, conflictingRoles]);
  
  // If no permission matrix is provided, show loading or empty state
  if (!permissionMatrix && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Permission Matrix Not Available</h3>
        <p className="text-gray-500 mb-4">Unable to load permission data.</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500 mt-4">Loading permissions...</p>
      </div>
    );
  }
  
  // Get all categories from the permission matrix
  const categories = permissionMatrix.categories || [];
  
  // Check if a permission is selected for the current role
  const isPermissionSelected = (permissionId) => {
    if (!selectedRole || !selectedRole.permissions) return false;
    
    return selectedRole.permissions.some(p => 
      typeof p === 'object' ? p._id === permissionId : p === permissionId
    );
  };
  
  // Handle permission toggle
  const handlePermissionToggle = (permissionId, isChecked) => {
    if (readOnly) return;
    onPermissionChange(permissionId, isChecked);
  };
  
  // Handle permission selection for bulk actions
  const handlePermissionSelection = (permissionId) => {
    if (readOnly) return;
    
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };
  
  // Handle bulk permission actions
  const handleBulkAction = (action) => {
    if (readOnly || selectedPermissions.length === 0) return;
    
    switch (action) {
      case 'add':
        onBulkPermissionChange(selectedPermissions, true);
        break;
      case 'remove':
        onBulkPermissionChange(selectedPermissions, false);
        break;
      default:
        break;
    }
    
    // Clear selection after bulk action
    setSelectedPermissions([]);
    setShowBulkActions(false);
  };
  
  // Handle select all permissions in a category
  const handleSelectAllInCategory = (category) => {
    if (readOnly) return;
    
    const categoryPermissions = category === 'all' 
      ? Object.values(permissionMatrix.permissions).flat().map(p => p._id)
      : permissionMatrix.permissions[category].map(p => p._id);
    
    setSelectedPermissions(categoryPermissions);
    setShowBulkActions(true);
  };
  
  // Handle drag start
  const handleDragStart = (e, permission) => {
    if (readOnly) return;
    
    setDraggedPermission(permission);
    e.dataTransfer.setData('text/plain', permission._id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add a custom drag image
    const dragImage = document.createElement('div');
    dragImage.className = 'bg-blue-100 border border-blue-300 rounded p-2 text-sm text-blue-800';
    dragImage.textContent = permission.name;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 10, 10);
    
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };
  
  // Handle drag over
  const handleDragOver = (e) => {
    if (readOnly) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('bg-blue-50', 'border-blue-300');
    }
  };
  
  // Handle drag leave
  const handleDragLeave = () => {
    if (readOnly) return;
    
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('bg-blue-50', 'border-blue-300');
    }
  };
  
  // Handle drop
  const handleDrop = (e) => {
    if (readOnly) return;
    
    e.preventDefault();
    
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('bg-blue-50', 'border-blue-300');
    }
    
    const permissionId = e.dataTransfer.getData('text/plain');
    
    if (permissionId && draggedPermission) {
      // Check if permission is already assigned
      const isAlreadyAssigned = isPermissionSelected(permissionId);
      
      // If not already assigned, add it
      if (!isAlreadyAssigned) {
        onPermissionChange(permissionId, true);
      }
    }
    
    setDraggedPermission(null);
  };
  
  // Detect permission conflicts
  const detectConflicts = () => {
    if (!selectedRole || !selectedRole.permissions || !conflictingRoles.length) {
      return [];
    }
    
    const detectedConflicts = [];
    
    // Check each permission in the selected role
    selectedRole.permissions.forEach(permission => {
      const permId = typeof permission === 'object' ? permission._id : permission;
      
      // Check against each potentially conflicting role
      conflictingRoles.forEach(role => {
        const conflictingPermissions = role.permissions.filter(p => {
          const pId = typeof p === 'object' ? p._id : p;
          return pId === permId;
        });
        
        if (conflictingPermissions.length > 0) {
          detectedConflicts.push({
            permission: permId,
            role: role.name,
            roleId: role._id
          });
        }
      });
    });
    
    return detectedConflicts;
  };
  
  // Filter permissions by category
  const getFilteredPermissions = () => {
    if (activeCategory === 'all') {
      return permissionMatrix.categories.reduce((acc, category) => {
        return {
          ...acc,
          [category]: permissionMatrix.permissions[category]
        };
      }, {});
    }
    
    return {
      [activeCategory]: permissionMatrix.permissions[activeCategory]
    };
  };
  
  const filteredPermissions = getFilteredPermissions();
  
  return (
    <div className="space-y-4">
      {/* Conflict Alert */}
      {showConflicts && conflicts.length > 0 && (
        <Alert className="bg-amber-50 border-amber-200 mb-4">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Permission Conflicts Detected</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p className="mb-2">
              This role has {conflicts.length} permission{conflicts.length > 1 ? 's' : ''} that conflict with other roles.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-amber-300 text-amber-800 hover:bg-amber-100"
              onClick={() => setShowConflicts(!showConflicts)}
            >
              {showConflicts ? 'Hide Details' : 'Show Details'}
            </Button>
            
            {showConflicts && (
              <div className="mt-2 max-h-32 overflow-y-auto text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  {conflicts.map((conflict, index) => {
                    // Find permission details
                    let permissionName = conflict.permission;
                    Object.values(permissionMatrix.permissions).flat().forEach(p => {
                      if (p._id === conflict.permission) {
                        permissionName = p.name;
                      }
                    });
                    
                    return (
                      <li key={index}>
                        <span className="font-medium">{permissionName}</span> conflicts with role <span className="font-medium">{conflict.role}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Bulk Actions */}
      {showBulkActions && selectedPermissions.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <div className="flex items-center">
            <CheckSquare className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">
              {selectedPermissions.length} permission{selectedPermissions.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
              onClick={() => handleBulkAction('add')}
            >
              <Check className="h-3 w-3 mr-1" />
              Grant All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
              onClick={() => handleBulkAction('remove')}
            >
              <X className="h-3 w-3 mr-1" />
              Revoke All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
              onClick={() => setSelectedPermissions([])}
            >
              <X className="h-3 w-3 mr-1" />
              Clear Selection
            </Button>
          </div>
        </div>
      )}
      
      {/* Drop Zone for Drag and Drop */}
      {!readOnly && (
        <div 
          ref={dropZoneRef}
          className="border-2 border-dashed border-gray-300 rounded-md p-4 mb-4 transition-colors"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-gray-500">
            <MoveHorizontal className="h-6 w-6 mb-2" />
            <p className="text-sm font-medium">Drag permissions here to assign them to the role</p>
            <p className="text-xs mt-1">Or use checkboxes for individual selection</p>
          </div>
        </div>
      )}
      
      {/* Category Tabs */}
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <div className="flex items-center justify-between mb-2">
          <TabsList className="mb-2 flex flex-wrap">
            <TabsTrigger value="all" className="mr-1 mb-1">
              All Categories
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="mr-1 mb-1">
                {category.replace('_', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {!readOnly && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleSelectAllInCategory(activeCategory)}
              >
                <CheckSquare className="h-3 w-3 mr-1" />
                Select All
              </Button>
              {selectedPermissions.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setShowBulkActions(!showBulkActions)}
                >
                  <Layers className="h-3 w-3 mr-1" />
                  {showBulkActions ? 'Hide' : 'Show'} Bulk Actions
                </Button>
              )}
            </div>
          )}
        </div>
      </Tabs>
      
      {/* Permissions Grid */}
      <ScrollArea className="h-[calc(100vh-350px)] pr-4">
        <div className="space-y-6">
          {Object.entries(filteredPermissions).map(([category, permissions]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                {category.replace('_', ' ')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {permissions.map(permission => {
                  const isSelected = isPermissionSelected(permission._id);
                  const isInBulkSelection = selectedPermissions.includes(permission._id);
                  
                  // Check if this permission has conflicts
                  const hasConflict = conflicts.some(c => c.permission === permission._id);
                  
                  return (
                    <div 
                      key={permission._id} 
                      className={cn(
                        "flex items-center space-x-2 p-2 rounded-md border transition-colors",
                        isSelected ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white',
                        isInBulkSelection ? 'ring-2 ring-blue-300' : '',
                        hasConflict ? 'border-amber-200' : '',
                        readOnly ? 'opacity-80' : 'hover:bg-gray-50',
                        !readOnly && 'cursor-grab active:cursor-grabbing'
                      )}
                      draggable={!readOnly}
                      onDragStart={(e) => handleDragStart(e, permission)}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`permission-${permission._id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => handlePermissionToggle(permission._id, checked)}
                          disabled={readOnly}
                          className={cn(
                            isSelected ? 'text-blue-600' : '',
                            hasConflict ? 'border-amber-400' : ''
                          )}
                        />
                        
                        {!readOnly && (
                          <Checkbox 
                            id={`select-${permission._id}`}
                            checked={isInBulkSelection}
                            onCheckedChange={() => handlePermissionSelection(permission._id)}
                            className="border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <label 
                                htmlFor={`permission-${permission._id}`} 
                                className={cn(
                                  "text-sm font-medium",
                                  readOnly ? 'cursor-default' : 'cursor-pointer',
                                  hasConflict ? 'text-amber-800' : 'text-gray-800'
                                )}
                              >
                                {permission.name.toLowerCase().replace(/_/g, ' ')}
                                {hasConflict && (
                                  <AlertTriangle className="inline-block h-3 w-3 ml-1 text-amber-500" />
                                )}
                              </label>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{permission.description || permission.name}</p>
                              {hasConflict && (
                                <p className="text-amber-600 text-xs mt-1">
                                  This permission conflicts with other roles
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        {permission.description && (
                          <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                        )}
                      </div>
                      
                      {permission.isSystemPermission && (
                        <Badge variant="outline" className="text-xs border-amber-200 bg-amber-50 text-amber-700">
                          <Lock className="h-3 w-3 mr-1" />
                          System
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Permission Count Summary */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {selectedRole && selectedRole.permissions ? (
            <span>
              <span className="font-medium">{selectedRole.permissions.length}</span> permissions selected
            </span>
          ) : (
            <span>No permissions selected</span>
          )}
        </div>
        
        {readOnly && (
          <Badge variant="outline" className="text-xs border-gray-200 bg-gray-50 text-gray-700">
            <Info className="h-3 w-3 mr-1" />
            Read-only view
          </Badge>
        )}
      </div>
    </div>
  );
}