"use client";

import { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import AuthGuard from '../../../components/auth/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../hooks/useAuth';
import { Shield, Clock, AlertCircle } from 'lucide-react';

/**
 * Example dashboard page demonstrating the dashboard header with session information
 */
export default function DashboardExample() {
  const { user, role, getSessionInfo, extendSession } = useAuth();
  const [sessionInfo, setSessionInfo] = useState(null);
  
  // Get current session information
  const handleCheckSession = () => {
    const info = getSessionInfo();
    setSessionInfo(info);
  };
  
  // Extend current session
  const handleExtendSession = async () => {
    try {
      const result = await extendSession();
      if (result.success) {
        alert('Session extended successfully');
        handleCheckSession();
      } else {
        alert(`Failed to extend session: ${result.message}`);
      }
    } catch (error) {
      console.error('Error extending session:', error);
      alert('An error occurred while extending the session');
    }
  };
  
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Dashboard Example</h1>
          <p className="text-muted-foreground">
            This page demonstrates the dashboard header with user session information.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* User Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Current authenticated user details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Name</h3>
                    <p>{user?.name || 'Not available'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p>{user?.email || 'Not available'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Role</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span>{role?.name || 'Not available'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Session Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Session Information</CardTitle>
                <CardDescription>Current session status and controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessionInfo ? (
                    <>
                      <div>
                        <h3 className="font-medium">Time Remaining</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span className="font-mono">
                            {sessionInfo.timeRemaining?.formatted || '00:00'}
                          </span>
                        </div>
                      </div>
                      
                      {sessionInfo.showWarning && (
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800">Session Expiring Soon</p>
                            <p className="text-sm text-amber-700">
                              Your session will expire in {sessionInfo.timeRemaining?.formatted || '00:00'}.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      Click "Check Session" to view session information.
                    </p>
                  )}
                  
                  <div className="flex flex-col gap-2 pt-2">
                    <Button onClick={handleCheckSession}>
                      Check Session
                    </Button>
                    <Button variant="outline" onClick={handleExtendSession}>
                      Extend Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Header Features Card */}
            <Card>
              <CardHeader>
                <CardTitle>Header Features</CardTitle>
                <CardDescription>Dashboard header functionality</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Current user role display</li>
                  <li>Session timeout warnings</li>
                  <li>Role switching for multi-role users</li>
                  <li>Session management controls</li>
                  <li>User profile dropdown</li>
                  <li>Logout functionality</li>
                </ul>
                <div className="mt-4">
                  <p className="text-sm">
                    The header automatically shows a warning when your session is about to expire
                    and provides options to extend it.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}