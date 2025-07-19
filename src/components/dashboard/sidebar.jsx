"use client";

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { 
  LayoutDashboard,
  CheckSquare,
  MapPin,
  Users,
  Brain,
  UserPlus,
  BarChart3,
  Camera,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertCircle,
  Lock,
  Info
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { useAuth } from '../../hooks/useAuth';

export function DashboardSidebar({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed, 
  currentUser 
}) {
  const { hasPermission, hasRole, role } = useAuth();
  const [permissionTooltipVisible, setPermissionTooltipVisible] = useState(false);
  
  // Define navigation items with required permissions
  const navigationItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER', 'TRAINER', 'FIELD_AGENT'],
      permissions: ['dashboard:view'],
      description: 'View organization dashboard and key metrics'
    },
    {
      id: 'tasks',
      label: 'Task Management',
      icon: <CheckSquare className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER', 'FIELD_AGENT'],
      permissions: ['tasks:view'],
      description: 'Manage and track tasks across the organization'
    },
    {
      id: 'tracking',
      label: 'Live Tracking',
      icon: <MapPin className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER'],
      permissions: ['tracking:view'],
      description: 'Track field agents and assets in real-time'
    },
    {
      id: 'employees',
      label: 'Employee Directory',
      icon: <Users className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER'],
      permissions: ['users:view'],
      description: 'View and manage organization employees'
    },
    {
      id: 'ai-trainer',
      label: 'AI Assistant',
      icon: <Brain className="h-5 w-5" />,
      roles: ['OWNER', 'TRAINER'],
      permissions: ['ai:access'],
      description: 'Configure and train AI assistants'
    },
    {
      id: 'invitations',
      label: 'User Management',
      icon: <UserPlus className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER'],
      permissions: ['users:invite'],
      description: 'Invite and manage user access'
    },
    {
      id: 'roles',
      label: 'Role Management',
      icon: <Shield className="h-5 w-5" />,
      roles: ['OWNER'],
      permissions: ['roles:manage'],
      description: 'Create and configure organization roles'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER'],
      permissions: ['analytics:view'],
      description: 'View detailed analytics and reports'
    },
    {
      id: 'media',
      label: 'Media Gallery',
      icon: <Camera className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER', 'FIELD_AGENT'],
      permissions: ['media:view'],
      description: 'Access organization media files'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['OWNER'],
      permissions: ['settings:manage'],
      description: 'Configure organization settings'
    }
  ];

  // Filter navigation items based on user permissions
  const filteredNavigation = navigationItems.filter(item => {
    // Check if user has any of the required roles
    const hasRequiredRole = item.roles.some(roleName => hasRole(roleName));
    
    // Check if user has all required permissions
    const hasRequiredPermissions = item.permissions.every(permission => 
      hasPermission(permission)
    );
    
    // Show item if user has either the role or all required permissions
    return hasRequiredRole || hasRequiredPermissions;
  });

  // Get role badge color based on role name
  const getRoleBadgeColor = (roleName) => {
    switch (roleName) {
      case 'OWNER':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'MANAGER':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'TRAINER':
        return 'bg-gray-100 text-gray-900 border-gray-300';
      case 'FIELD_AGENT':
        return 'bg-gray-50 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 shadow-sm ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-black">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Productly AI
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 text-white hover:bg-gray-800 hover:text-white"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* User Info with Role and Permissions */}
        {!collapsed ? (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-blue-200">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-blue-100 text-blue-900">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className={`text-xs border ${getRoleBadgeColor(currentUser.role)} cursor-pointer`}>
                          <Shield className="h-3 w-3 mr-1" />
                          {currentUser.role.split('_').join(' ')}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="w-64 p-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Role: {currentUser.role.split('_').join(' ')}</span>
                          </div>
                          {role && role.permissions && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-500 mb-1">Permissions:</p>
                              <div className="flex flex-wrap gap-1">
                                {role.permissions.slice(0, 3).map((permission, index) => (
                                  <Badge key={index} variant="outline" className="text-xs py-0">
                                    {typeof permission === 'string' ? permission : permission.name}
                                  </Badge>
                                ))}
                                {role.permissions.length > 3 && (
                                  <Badge variant="outline" className="text-xs py-0">
                                    +{role.permissions.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={() => setPermissionTooltipVisible(!permissionTooltipVisible)}
                        >
                          <Info className="h-3 w-3 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        View your permissions
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            
            {/* Permission details panel */}
            {permissionTooltipVisible && (
              <div className="mt-3 p-2 bg-gray-100 rounded-md text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Your Access Permissions</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4" 
                    onClick={() => setPermissionTooltipVisible(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                </div>
                {role && role.permissions && (
                  <div className="max-h-24 overflow-y-auto">
                    {role.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center py-1">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <span>{typeof permission === 'string' ? permission : permission.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-10 w-10 border-2 border-blue-200 cursor-pointer">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-900">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="right" className="w-64 p-3">
                  <div className="space-y-2">
                    <p className="font-medium">{currentUser.name}</p>
                    <Badge className={`text-xs ${getRoleBadgeColor(currentUser.role)}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {currentUser.role.split('_').join(' ')}
                    </Badge>
                    
                    {role && role.permissions && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Permissions:</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs py-0">
                              {typeof permission === 'string' ? permission : permission.name}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs py-0">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Navigation with Permission Indicators */}
        <nav className="flex-1 overflow-y-auto py-2 px-1 bg-white">
          {/* Section headers for better organization */}
          {!collapsed && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Navigation
              </h3>
            </div>
          )}
          
          <div className="space-y-1">
            {filteredNavigation.map((item) => {
              // Check if user has direct permission for this item
              const hasDirectPermission = item.permissions.every(permission => 
                hasPermission(permission)
              );
              
              // Check if user has role-based access
              const hasRoleAccess = item.roles.some(roleName => 
                hasRole(roleName)
              );
              
              return (
                <TooltipProvider key={item.id} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Button
                          variant={activeTab === item.id ? "default" : "ghost"}
                          className={`w-full justify-start transition-colors ${
                            activeTab === item.id 
                              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                          } ${collapsed ? 'py-5' : 'px-3 py-4'}`}
                          onClick={() => setActiveTab(item.id)}
                        >
                          <span className="flex items-center justify-between w-full">
                            <span className="flex items-center">
                              {item.icon}
                              {!collapsed && <span className="ml-3">{item.label}</span>}
                            </span>
                            
                            {/* Permission indicator for expanded view */}
                            {!collapsed && (
                              <span className="flex items-center">
                                {hasDirectPermission && (
                                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1" 
                                       title="Direct permission access" />
                                )}
                                {!hasDirectPermission && hasRoleAccess && (
                                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-1" 
                                       title="Role-based access" />
                                )}
                              </span>
                            )}
                          </span>
                        </Button>
                        
                        {/* Permission indicator for collapsed view */}
                        {collapsed && (hasDirectPermission || hasRoleAccess) && (
                          <div 
                            className={`absolute top-1 right-1 h-2 w-2 rounded-full ${
                              hasDirectPermission ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                          />
                        )}
                      </div>
                    </TooltipTrigger>
                    
                    <TooltipContent side={collapsed ? "right" : "bottom"} className="w-64 p-3">
                      <div className="space-y-2">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-1">
                          {hasDirectPermission && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                              Direct Permission
                            </Badge>
                          )}
                          {hasRoleAccess && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              Role Access
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-1">
                          <p className="font-medium">Required Permissions:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.permissions.map((permission, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className={`text-xs ${
                                  hasPermission(permission) 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-gray-50 text-gray-500 border-gray-200'
                                }`}
                              >
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </nav>

        {/* Footer with Session Controls */}
        <div className="p-2 border-t border-gray-200 bg-white">
          {!collapsed && (
            <div className="mb-2 px-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Account
              </h3>
            </div>
          )}
          
          {/* Role indicator in footer */}
          {!collapsed && (
            <div className="px-3 py-2 mb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Current Role</span>
                <Badge className={`text-xs ${getRoleBadgeColor(currentUser.role)}`}>
                  {currentUser.role.split('_').join(' ')}
                </Badge>
              </div>
            </div>
          )}
          
          {/* Logout button */}
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-700 hover:text-white hover:bg-red-500 ${
                    collapsed ? 'px-3 py-5' : 'px-3 py-4'
                  }`}
                >
                  <LogOut className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Sign Out</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="ml-2">
                  Sign Out
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}