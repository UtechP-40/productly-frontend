"use client";

import { useState, useEffect } from 'react';
import { PermissionMatrixDnD } from '../../../components/dashboard/PermissionMatrixDnD';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Shield, AlertTriangle, RefreshCw, Plus } from 'lucide-react';

export default function PermissionMatrixExample() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('edit');
  
  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);
  
  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/roles');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch roles');
      }
      
      setRoles(data.data.roles || []);
      
      // Select the first role by default
      if (data.data.roles && data.data.roles.length > 0) {
        setSelectedRole(data.data.roles[0]);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };
  
  // Handle permission save
  const handleSavePermissions = async (updatedRole) => {
    try {
      const response = await fetch(`/api/roles/${updatedRole._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updatedRole.name,
          description: updatedRole.description,
          permissions: updatedRole.permissions
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role');
      }
      
      // Refresh roles to get updated data
      fetchRoles();
      
      // Show success message
      alert('Permissions saved successfully');
    } catch (error) {
      console.error('Error saving permissions:', error);
      setError(error.message);
    }
  };
  
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
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }
    
    if (roles.length === 0) {
      return (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Roles Found</h3>
          <p className="text-gray-500 mb-4">
            Create your first role to get started
          </p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        {roles.map((role) => (
          <div 
            key={role._id} 
            className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
              selectedRole && selectedRole._id === role._id 
                ? 'bg-blue-100 border border-blue-300' 
                : 'hover:bg-gray-100 border border-transparent'
            }`}
            onClick={() => handleRoleSelect(role)}
          >
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-3">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{role.name}</h4>
              {role.description && (
                <p className="text-xs text-gray-500">{role.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Permission Matrix Example</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Role List */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Roles
              </CardTitle>
              <CardDescription>
                Select a role to manage permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderRoleList()}
            </CardContent>
          </Card>
        </div>
        
        {/* Permission Matrix */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="edit">Edit Mode</TabsTrigger>
              <TabsTrigger value="readonly">Read-Only Mode</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit">
              <PermissionMatrixDnD
                selectedRole={selectedRole}
                onSave={handleSavePermissions}
                onCancel={() => fetchRoles()}
                readOnly={false}
              />
            </TabsContent>
            
            <TabsContent value="readonly">
              <PermissionMatrixDnD
                selectedRole={selectedRole}
                onSave={() => {}}
                onCancel={() => {}}
                readOnly={true}
              />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">About This Example</AlertTitle>
              <AlertDescription className="text-blue-700">
                <p className="mb-2">
                  This example demonstrates the enhanced permission matrix component with the following features:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Drag-and-drop permission assignment</li>
                  <li>Bulk permission operations</li>
                  <li>Permission conflict detection and resolution</li>
                  <li>Visual categorization of permissions</li>
                  <li>Read-only mode for viewing permissions</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}