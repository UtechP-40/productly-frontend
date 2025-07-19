"use client";

import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Table } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../ui/alert-dialog';
import { Select } from '../../ui/select';
import { Input } from '../../ui/input';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { useToast } from '../../../hooks/use-toast';

/**
 * Format date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Get status badge variant based on invitation status
 * @param {string} status - Invitation status
 * @returns {string} Badge variant
 */
function getStatusBadgeVariant(status) {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'ACCEPTED':
      return 'success';
    case 'EXPIRED':
      return 'secondary';
    case 'REVOKED':
      return 'destructive';
    default:
      return 'default';
  }
}

/**
 * InvitationList Component
 * Displays and manages user invitations
 * 
 * @param {Object} props - Component props
 * @param {Array} props.roles - Available roles for mapping role IDs to names
 * @returns {React.ReactNode} Invitation list component
 */
export default function InvitationList({ roles = [] }) {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Role map for quick lookups
  const roleMap = roles.reduce((acc, role) => {
    acc[role.id] = role.name;
    return acc;
  }, {});

  // Fetch invitations
  const fetchInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (statusFilter) {
        queryParams.append('status', statusFilter);
      }
      
      const response = await fetch(`/api/invitations?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch invitations');
      }
      
      const data = await response.json();
      
      setInvitations(data.invitations || []);
      setPagination({
        page: data.page || 1,
        limit: data.limit || 10,
        total: data.total || 0,
        totalPages: data.totalPages || 0
      });
    } catch (error) {
      console.error('Error fetching invitations:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchInvitations();
  }, [pagination.page, pagination.limit, statusFilter]);

  // Handle resend invitation
  const handleResendInvitation = async (invitationId) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/resend`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to resend invitation');
      }
      
      toast({
        title: 'Invitation Resent',
        description: 'The invitation has been resent successfully',
        variant: 'success'
      });
      
      // Refresh the list
      fetchInvitations();
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Handle revoke invitation
  const handleRevokeInvitation = async (invitationId) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok && response.status !== 204) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to revoke invitation');
      }
      
      toast({
        title: 'Invitation Revoked',
        description: 'The invitation has been revoked successfully',
        variant: 'success'
      });
      
      // Refresh the list
      fetchInvitations();
    } catch (error) {
      console.error('Error revoking invitation:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Filter invitations by search term
  const filteredInvitations = invitations.filter(invitation => 
    invitation.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium">Invitations</h3>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto"
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="EXPIRED">Expired</option>
            <option value="REVOKED">Revoked</option>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      ) : filteredInvitations.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No invitations found
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <thead>
                <tr>
                  <th className="w-[200px]">Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Invited By</th>
                  <th>Expires</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvitations.map((invitation) => (
                  <tr key={invitation.id}>
                    <td className="font-medium">{invitation.email}</td>
                    <td>{roleMap[invitation.roleId] || 'Unknown Role'}</td>
                    <td>
                      <Badge variant={getStatusBadgeVariant(invitation.status)}>
                        {invitation.status}
                      </Badge>
                    </td>
                    <td>{invitation.invitedBy?.name || 'System'}</td>
                    <td>{formatDate(invitation.expiresAt)}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {invitation.status === 'PENDING' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResendInvitation(invitation.id)}
                            >
                              Resend
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  Revoke
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to revoke the invitation sent to {invitation.email}?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRevokeInvitation(invitation.id)}
                                  >
                                    Revoke
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}