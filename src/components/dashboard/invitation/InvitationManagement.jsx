"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Alert } from '../../ui/alert';
import LoadingSpinner from '../../ui/LoadingSpinner';
import InvitationForm from './InvitationForm';
import BulkInvitationForm from './BulkInvitationForm';
import InvitationList from './InvitationList';

/**
 * InvitationManagement Component
 * Main component for managing user invitations
 * 
 * @returns {React.ReactNode} Invitation management component
 */
export default function InvitationManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('single');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch roles for the invitation forms
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/roles');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch roles');
        }
        
        const data = await response.json();
        setRoles(data.roles || []);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoles();
  }, []);

  // Handle invitation sent event
  const handleInvitationSent = () => {
    // Trigger a refresh of the invitation list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">User Invitations</h2>
        <p className="text-muted-foreground">
          Invite users to your organization and manage existing invitations.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Invitations</CardTitle>
              <CardDescription>
                Invite users to join your organization with specific roles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single">Single Invitation</TabsTrigger>
                  <TabsTrigger value="bulk">Bulk Invitations</TabsTrigger>
                </TabsList>
                <TabsContent value="single" className="mt-4">
                  <InvitationForm 
                    roles={roles} 
                    onInvitationSent={handleInvitationSent} 
                  />
                </TabsContent>
                <TabsContent value="bulk" className="mt-4">
                  <BulkInvitationForm 
                    roles={roles} 
                    onInvitationsSent={handleInvitationSent} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Manage Invitations</CardTitle>
              <CardDescription>
                View, resend, and revoke pending invitations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvitationList 
                roles={roles} 
                key={refreshTrigger} // Force re-render when refreshTrigger changes
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}