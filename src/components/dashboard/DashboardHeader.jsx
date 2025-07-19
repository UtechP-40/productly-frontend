"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  Bell, 
  Settings, 
  LogOut, 
  User, 
  Shield, 
  Clock, 
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '../ui/tooltip';
import { cn } from '../../lib/utils';

/**
 * DashboardHeader Component
 * Displays user session information and provides session management controls
 * 
 * @param {Object} props - Component props
 * @param {Object} props.currentUser - Current user object
 * @param {Function} props.onToggleSidebar - Function to toggle sidebar
 * @returns {React.ReactNode} Dashboard header component
 */
export default function DashboardHeader({ currentUser, onToggleSidebar }) {
  const { user, role, logout, hasRole } = useAuth();
  const router = useRouter();
  
  // Session timeout warning state
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(null);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Session timeout interval reference
  const sessionTimeoutRef = useRef(null);
  
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

  // Initialize session timeout tracking
  useEffect(() => {
    // Mock session expiry time (30 minutes from now)
    // In a real implementation, this would come from the JWT expiry
    const mockSessionExpiry = new Date();
    mockSessionExpiry.setMinutes(mockSessionExpiry.getMinutes() + 30);
    
    // Function to update session time remaining
    const updateSessionTime = () => {
      const now = new Date();
      const timeRemaining = mockSessionExpiry - now;
      
      // Convert to minutes and seconds
      const minutesRemaining = Math.floor(timeRemaining / 60000);
      const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);
      
      setSessionTimeRemaining({
        minutes: minutesRemaining,
        seconds: secondsRemaining,
        total: timeRemaining
      });
      
      // Show warning when less than 5 minutes remaining
      if (timeRemaining < 300000 && !showSessionWarning) {
        setShowSessionWarning(true);
      }
      
      // Clear interval when session expires
      if (timeRemaining <= 0) {
        clearInterval(sessionTimeoutRef.current);
        // Auto logout when session expires
        logout();
      }
    };
    
    // Update immediately and then every second
    updateSessionTime();
    sessionTimeoutRef.current = setInterval(updateSessionTime, 1000);
    
    // Mock available roles for the user
    // In a real implementation, this would come from the user object
    if (user && role) {
      // For demo purposes, we'll add the current role and some mock roles
      const mockRoles = [
        { name: role.name, id: '1' }
      ];
      
      // Add some mock roles based on the current role
      if (role.name === 'OWNER') {
        mockRoles.push({ name: 'MANAGER', id: '2' });
      } else if (role.name === 'MANAGER') {
        mockRoles.push({ name: 'FIELD_AGENT', id: '3' });
      }
      
      setAvailableRoles(mockRoles);
      setSelectedRole(role.name);
    }
    
    // Cleanup interval on unmount
    return () => {
      if (sessionTimeoutRef.current) {
        clearInterval(sessionTimeoutRef.current);
      }
    };
  }, [user, role, logout, showSessionWarning]);
  
  // Handle session extension
  const handleExtendSession = () => {
    // In a real implementation, this would call an API to refresh the token
    // For now, we'll just reset our mock timer
    const newExpiry = new Date();
    newExpiry.setMinutes(newExpiry.getMinutes() + 30);
    
    // Reset warning state
    setShowSessionWarning(false);
    
    // Show confirmation message
    alert('Session extended for 30 minutes');
  };
  
  // Handle role switching
  const handleRoleSwitch = (roleName) => {
    // In a real implementation, this would call an API to switch roles
    // For now, we'll just update the state
    setSelectedRole(roleName);
    
    // Show confirmation message
    alert(`Switched to role: ${roleName}`);
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Format time remaining as MM:SS
  const formatTimeRemaining = () => {
    if (!sessionTimeRemaining) return '00:00';
    
    const minutes = String(sessionTimeRemaining.minutes).padStart(2, '0');
    const seconds = String(sessionTimeRemaining.seconds).padStart(2, '0');
    
    return `${minutes}:${seconds}`;
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      {/* Left side - Title and breadcrumb */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      {/* Right side - User session info and controls */}
      <div className="flex items-center gap-4">
        {/* Session timeout warning */}
        {showSessionWarning && (
          <div className="hidden md:flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">Session expires in {formatTimeRemaining()}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800"
              onClick={handleExtendSession}
            >
              Extend
            </Button>
          </div>
        )}

        {/* Notifications */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                <span className="sr-only">Notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Role switcher (for multi-role users) */}
        {availableRoles.length > 1 && (
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Shield className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">{selectedRole}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Switch Role</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableRoles.map((availableRole) => (
                <DropdownMenuItem
                  key={availableRole.id}
                  className={cn(
                    "cursor-pointer",
                    selectedRole === availableRole.name && "bg-muted"
                  )}
                  onClick={() => handleRoleSwitch(availableRole.name)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  <span>{availableRole.name}</span>
                  {selectedRole === availableRole.name && (
                    <span className="ml-auto">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8 border-2 border-blue-200">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback className="bg-blue-100 text-blue-900">
                  {currentUser?.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                <Badge className={`mt-1 w-fit text-xs ${getRoleBadgeColor(currentUser?.role)}`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {currentUser?.role?.split('_').join(' ')}
                </Badge>
              </div>
            </div>
            <DropdownMenuSeparator />
            
            {/* Session information */}
            <div className="px-2 py-1.5">
              <div className="text-xs text-muted-foreground mb-1">Session Info</div>
              <div className="flex items-center justify-between text-xs">
                <span>Session expires in:</span>
                <span className="font-mono">{formatTimeRemaining()}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}