"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { 
  Shield, 
  Check, 
  X, 
  AlertTriangle,
  RefreshCw,
  Lock,
  Info
} from 'lucide-react';

export function PermissionMatrix({ 
  selectedRole, 
  permissionMatrix, 
  onPermissionChange, 
  readOnly = false,
  loading = false 
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  
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
      {/* Category Tabs */}
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="all" className="mr-1 mb-1">
            All Categories
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="mr-1 mb-1">
              {category.replace('_', ' ')}
            </TabsTrigger>
          ))}
        </TabsList>
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
                {permissions.map(permission => (
                  <div 
                    key={permission._id} 
                    className={`flex items-center space-x-2 p-2 rounded-md border ${
                      isPermissionSelected(permission._id) 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-gray-200 bg-white'
                    } ${readOnly ? 'opacity-80' : 'hover:bg-gray-50'}`}
                  >
                    <Checkbox 
                      id={`permission-${permission._id}`}
                      checked={isPermissionSelected(permission._id)}
                      onCheckedChange={(checked) => handlePermissionToggle(permission._id, checked)}
                      disabled={readOnly}
                      className={isPermissionSelected(permission._id) ? 'text-blue-600' : ''}
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={`permission-${permission._id}`} 
                        className={`text-sm font-medium ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {permission.name.toLowerCase().replace(/_/g, ' ')}
                      </label>
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
                ))}
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