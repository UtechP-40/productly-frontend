"use client";

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
  Shield
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

export function DashboardSidebar({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed, 
  currentUser 
}) {
  const navigationItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER', 'TRAINER', 'FIELD_AGENT']
    },
    {
      id: 'tasks',
      label: 'Task Management',
      icon: <CheckSquare className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER', 'FIELD_AGENT']
    },
    {
      id: 'tracking',
      label: 'Live Tracking',
      icon: <MapPin className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER']
    },
    {
      id: 'employees',
      label: 'Employee Directory',
      icon: <Users className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER']
    },
    {
      id: 'ai-trainer',
      label: 'AI Assistant',
      icon: <Brain className="h-5 w-5" />,
      roles: ['OWNER', 'TRAINER']
    },
    {
      id: 'invitations',
      label: 'User Management',
      icon: <UserPlus className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER']
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER']
    },
    {
      id: 'media',
      label: 'Media Gallery',
      icon: <Camera className="h-5 w-5" />,
      roles: ['OWNER', 'MANAGER', 'FIELD_AGENT']
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['OWNER']
    }
  ];

  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  const getRoleBadgeColor = (role) => {
    switch (role) {
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

        {/* User Info */}
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
                  <Badge className={`text-xs border ${getRoleBadgeColor(currentUser.role)}`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {currentUser.role.split('_').join(' ')}
                  </Badge>
                </div>
              </div>
            </div>
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
                <TooltipContent side="right">
                  <div className="p-2">
                    <p className="font-medium">{currentUser.name}</p>
                    <Badge className={`text-xs mt-1 ${getRoleBadgeColor(currentUser.role)}`}>
                      {currentUser.role.split('_').join(' ')}
                    </Badge>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-1 bg-white">
          <div className="space-y-1">
            {filteredNavigation.map((item) => (
              <TooltipProvider key={item.id} delayDuration={100}>
                <Tooltip disableHoverableContent={!collapsed}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className={`w-full justify-start transition-colors ${
                        activeTab === item.id 
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      } ${collapsed ? 'py-5' : 'px-3 py-4'}`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <span className="flex items-center">
                        {item.icon}
                        {!collapsed && <span className="ml-3">{item.label}</span>}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" className="ml-2">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-gray-200 bg-white">
          <TooltipProvider delayDuration={100}>
            <Tooltip disableHoverableContent={!collapsed}>
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