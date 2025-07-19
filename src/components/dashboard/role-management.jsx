"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { PermissionMatrix } from './permission-matrix';
import { 
  Shield, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Users, 
  Settings, 
  AlertTriangle,
  Filter,
  RefreshCw,
  Lock,
  UserPlus
} from 'lucide-react';

export function RoleManagement() {
  // State for roles and permissions
  const [roles, setRoles] = useState([]);
  const [permissionMatrix, setPermissionMatrix] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for role form
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: []
  });
  
  // State for filtering and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRoles, setTotalRoles] = useState(0);
  
  // Fetch roles and permission matrix on component mount
  useEffect(() => {
    fetchRoles();
    fetchPermissionMatrix();
  }, [currentPage]);
  
  // Filter roles based on search query
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/roles?page=${currentPage}&limit=10`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch roles');
      }
      
      setRoles(data.data.roles);
      setTotalPages(data.data.pagination.pages);
      setTotalRoles(data.data.pagination.total);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch permission matrix from API
  const fetchPermissionMatrix = async () => {
    try {
      const response = await fetch('/api/roles/permissions/matrix');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch permission matrix');
      }
      
      setPermissionMatrix(data.data);
    } catch (error) {
      console.error('Error fetching permission matrix:', error);
      setError(error.message);
    }
  };
  
  // Create a new role
  const createRole = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRole)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create role');
      }
      
      // Reset form and refresh roles
      setNewRole({
        name: '',
        description: '',
        permissions: []
      });
      
      setIsCreateDialogOpen(false);
      fetchRoles();
    } catch (error) {
      console.error('Error creating role:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing role
  const updateRole = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/roles/${currentRole._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: currentRole.name,
          description: currentRole.description,
          permissions: currentRole.permissions.map(p => typeof p === 'object' ? p._id : p)
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role');
      }
      
      setIsEditDialogOpen(false);
      fetchRoles();
    } catch (error) {
      console.error('Error updating role:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a role
  const deleteRole = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/roles/${currentRole._id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete role');
      }
      
      setIsDeleteDialogOpen(false);
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle permission toggle for role creation/editing
  const handlePermissionToggle = (permissionId, isChecked, isEditing = false) => {
    if (isEditing) {
      // For editing existing role
      const updatedPermissions = isChecked
        ? [...currentRole.permissions, permissionId]
        : currentRole.permissions.filter(p => 
            (typeof p === 'object' ? p._id !== permissionId : p !== permissionId)
          );
      
      setCurrentRole({
        ...currentRole,
        permissions: updatedPermissions
      });
    } else {
      // For creating new role
      const updatedPermissions = isChecked
        ? [...newRole.permissions, permissionId]
        : newRole.permissions.filter(p => p !== permissionId);
      
      setNewRole({
        ...newRole,
        permissions: updatedPermissions
      });
    }
  };
  
  // Check if a permission is selected
  const isPermissionSelected = (permissionId, isEditing = false) => {
    if (isEditing && currentRole) {
      return currentRole.permissions.some(p => 
        typeof p === 'object' ? p._id === permissionId : p === permissionId
      );
    }
    
    return newRole.permissions.includes(permissionId);
  };
  
  // Open edit dialog with role data
  const openEditDialog = (role) => {
    setCurrentRole({
      ...role,
      permissions: role.permissions.map(p => typeof p === 'object' ? p : p)
    });
    setIsEditDialogOpen(true);
  };
  
  // Open delete dialog with role data
  const openDeleteDialog = (role) => {
    setCurrentRole(role);
    setIsDeleteDialogOpen(true);
  };
  
  // Render permission categories and checkboxes
  const renderPermissionCheckboxes = (isEditing = false) => {
    if (!permissionMatrix) return null;
    
    return (
      <div className="space-y-6">
        {permissionMatrix.categories.map((category) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">{category.replace('_', ' ')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {permissionMatrix.permissions[category].map((permission) => (
                <div key={permission._id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${isEditing ? 'edit' : 'new'}-${permission._id}`}
                    checked={isPermissionSelected(permission._id, isEditing)}
                    onCheckedChange={(checked) => handlePermissionToggle(permission._id, checked, isEditing)}
                  />
                  <label 
                    htmlFor={`${isEditing ? 'edit' : 'new'}-${permission._id}`} 
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {permission.name.toLowerCase().replace(/_/g, ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render role creation dialog
  const renderCreateRoleDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Create New Role
          </DialogTitle>
          <DialogDescription>
            Define a new role with specific permissions for your organization
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 flex-grow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
              <Input
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                placeholder="e.g., Content Manager"
                className="border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Input
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                placeholder="Brief description of this role"
                className="border-gray-300"
              />
            </div>
          </div>
          
          <div className="flex-grow overflow-hidden">
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div className="border rounded-md">
              <PermissionMatrix 
                selectedRole={newRole}
                permissionMatrix={permissionMatrix}
                onPermissionChange={(permissionId, isChecked) => handlePermissionToggle(permissionId, isChecked, false)}
                loading={!permissionMatrix}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={createRole} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!newRole.name || newRole.permissions.length === 0}
          >
            Create Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  // Render role edit dialog
  const renderEditRoleDialog = () => (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Edit className="h-5 w-5 mr-2 text-blue-600" />
            Edit Role
          </DialogTitle>
          <DialogDescription>
            Update role details and permissions
          </DialogDescription>
        </DialogHeader>
        
        {currentRole && (
          <div className="flex flex-col space-y-4 flex-grow overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <Input
                  value={currentRole.name}
                  onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
                  placeholder="e.g., Content Manager"
                  className="border-gray-300"
                  disabled={currentRole.isSystemRole}
                />
                {currentRole.isSystemRole && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    System roles cannot be renamed
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Input
                  value={currentRole.description || ''}
                  onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
                  placeholder="Brief description of this role"
                  className="border-gray-300"
                />
              </div>
            </div>
            
            <div className="flex-grow overflow-hidden">
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div className="border rounded-md">
                <PermissionMatrix 
                  selectedRole={currentRole}
                  permissionMatrix={permissionMatrix}
                  onPermissionChange={(permissionId, isChecked) => handlePermissionToggle(permissionId, isChecked, true)}
                  loading={!permissionMatrix}
                  readOnly={currentRole?.isSystemRole}
                />
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={updateRole} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!currentRole || !currentRole.name || currentRole.permissions.length === 0}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  // Render role delete confirmation dialog
  const renderDeleteRoleDialog = () => (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delete Role
          </AlertDialogTitle>
          <AlertDialogDescription>
            {currentRole && (
              <>
                Are you sure you want to delete the role <strong>{currentRole.name}</strong>?
                <br />
                This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={deleteRole}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  
  // Render role list
  const renderRoleList = () => {
    if (loading && roles.length === 0) {
      return (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Roles</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button 
            onClick={() => {
              setError(null);
              fetchRoles();
              fetchPermissionMatrix();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }
    
    if (filteredRoles.length === 0) {
      return (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Roles Found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Try adjusting your search criteria' : 'Create your first role to get started'}
          </p>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredRoles.map((role) => (
          <div 
            key={role._id} 
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium text-gray-900">{role.name}</h4>
                  {role.isSystemRole && (
                    <Badge className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                      <Lock className="h-3 w-3 mr-1" />
                      System
                    </Badge>
                  )}
                </div>
                {role.description && (
                  <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-xs text-gray-600">
                    {role.permissions?.length || 0} permissions
                  </Badge>
                  <Badge variant="outline" className="text-xs text-gray-600 flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {role.userCount || 0} users
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => openEditDialog(role)}
              >
                <Edit className="h-4 w-4 text-gray-500" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => openDeleteDialog(role)}
                disabled={role.isSystemRole || (role.userCount && role.userCount > 0)}
              >
                <Trash2 className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
        ))}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Showing {filteredRoles.length} of {totalRoles} roles
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Role Management</h2>
          <p className="text-gray-600">Create and manage roles with specific permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          {renderCreateRoleDialog()}
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 border-gray-300"
            />
          </div>
        </div>
      </div>
      
      {/* Role List */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Roles
          </CardTitle>
          <CardDescription>
            Manage roles and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderRoleList()}
        </CardContent>
      </Card>
      
      {/* Edit and Delete Dialogs */}
      {renderEditRoleDialog()}
      {renderDeleteRoleDialog()}
    </div>
  );
}