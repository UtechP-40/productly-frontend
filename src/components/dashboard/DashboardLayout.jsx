"use client";

import { useState } from 'react';
import { DashboardSidebar } from './sidebar';
import DashboardHeader from './DashboardHeader';
import { useAuth } from '../../hooks/useAuth';
import SessionTimeoutModal from './SessionTimeoutModal';

/**
 * DashboardLayout Component
 * Provides a layout with sidebar and header for dashboard pages
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactNode} Dashboard layout component
 */
export default function DashboardLayout({ children }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const { user } = useAuth();
  
  // Mock current user data
  // In a real implementation, this would come from the useAuth hook
  const currentUser = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    role: user?.organizationRole?.name || 'MANAGER',
    avatar: user?.avatar || 'https://github.com/shadcn.png',
  };
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        currentUser={currentUser}
      />
      
      {/* Main content area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header */}
        <DashboardHeader 
          currentUser={currentUser}
          onToggleSidebar={toggleSidebar}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      
      {/* Session timeout modal */}
      <SessionTimeoutModal 
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onExtend={() => {
          // In a real implementation, this would call an API to refresh the token
          setShowSessionModal(false);
        }}
      />
    </div>
  );
}