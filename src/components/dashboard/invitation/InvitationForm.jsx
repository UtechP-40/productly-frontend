"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select } from '../../ui/select';
import { Label } from '../../ui/label';
import { Alert } from '../../ui/alert';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { useToast } from '../../../hooks/use-toast';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Validation schema for a single invitation
const invitationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  roleId: z.string().min(1, 'Please select a role')
});

/**
 * InvitationForm Component
 * Form for inviting users with role selection
 * 
 * @param {Object} props - Component props
 * @param {Array} props.roles - Available roles for selection
 * @param {Function} props.onInvitationSent - Callback when invitation is sent successfully
 * @returns {React.ReactNode} Invitation form component
 */
export default function InvitationForm({ roles = [], onInvitationSent }) {
  const { toast } = useToast();
  const [successMessage, setSuccessMessage] = useState('');

  // Form validation setup
  const {
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  } = useFormValidation({
    validationSchema: invitationSchema,
    initialValues: {
      email: '',
      roleId: ''
    },
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/invitations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send invitation');
        }

        // Show success message
        setSuccessMessage(`Invitation sent to ${values.email}`);
        toast({
          title: 'Invitation Sent',
          description: `An invitation has been sent to ${values.email}`,
          variant: 'success'
        });

        // Reset form
        resetForm();

        // Call callback if provided
        if (onInvitationSent) {
          onInvitationSent(data);
        }
      } catch (error) {
        console.error('Error sending invitation:', error);
        throw error;
      }
    }
  });

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <h3 className="text-lg font-medium">Invite User</h3>
      
      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}
      
      {submitError && (
        <Alert variant="destructive" className="mb-4">
          {submitError}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="user@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
            aria-invalid={!!(touched.email && errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {touched.email && errors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="roleId">Role</Label>
          <Select
            id="roleId"
            name="roleId"
            value={values.roleId}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.roleId && errors.roleId}
            aria-invalid={!!(touched.roleId && errors.roleId)}
            aria-describedby={errors.roleId ? "role-error" : undefined}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </Select>
          {touched.roleId && errors.roleId && (
            <p id="role-error" className="text-sm text-destructive">
              {errors.roleId}
            </p>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Sending...
              </>
            ) : (
              'Send Invitation'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}