"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Select } from '../../ui/select';
import { Label } from '../../ui/label';
import { Alert } from '../../ui/alert';
import { Checkbox } from '../../ui/checkbox';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { useToast } from '../../../hooks/use-toast';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Validation schema for bulk invitations
const bulkInvitationSchema = z.object({
  emails: z.string().min(1, 'Please enter at least one email address'),
  roleId: z.string().min(1, 'Please select a role'),
  sendIndividualEmails: z.boolean().optional()
});

/**
 * BulkInvitationForm Component
 * Form for inviting multiple users at once
 * 
 * @param {Object} props - Component props
 * @param {Array} props.roles - Available roles for selection
 * @param {Function} props.onInvitationsSent - Callback when invitations are sent successfully
 * @returns {React.ReactNode} Bulk invitation form component
 */
export default function BulkInvitationForm({ roles = [], onInvitationsSent }) {
  const { toast } = useToast();
  const [successMessage, setSuccessMessage] = useState('');
  const [invalidEmails, setInvalidEmails] = useState([]);

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
    resetForm,
    setFieldValue
  } = useFormValidation({
    validationSchema: bulkInvitationSchema,
    initialValues: {
      emails: '',
      roleId: '',
      sendIndividualEmails: false
    },
    onSubmit: async (values) => {
      try {
        // Parse and validate emails
        const emailList = values.emails
          .split(/[\n,;]/)
          .map(email => email.trim())
          .filter(email => email.length > 0);
        
        // Validate each email
        const validEmails = [];
        const invalidEmails = [];
        
        emailList.forEach(email => {
          if (EMAIL_REGEX.test(email)) {
            validEmails.push(email);
          } else {
            invalidEmails.push(email);
          }
        });
        
        // If there are invalid emails, show them and don't proceed
        if (invalidEmails.length > 0) {
          setInvalidEmails(invalidEmails);
          throw new Error(`${invalidEmails.length} invalid email(s) found`);
        }
        
        // Prepare request payload
        const payload = {
          emails: validEmails,
          roleId: values.roleId,
          sendIndividualEmails: values.sendIndividualEmails
        };
        
        // Send invitation request
        const response = await fetch('/api/invitations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send invitations');
        }

        // Show success message
        const successMsg = `${validEmails.length} invitation(s) sent successfully`;
        setSuccessMessage(successMsg);
        toast({
          title: 'Invitations Sent',
          description: successMsg,
          variant: 'success'
        });

        // Reset form and invalid emails
        resetForm();
        setInvalidEmails([]);

        // Call callback if provided
        if (onInvitationsSent) {
          onInvitationsSent(data);
        }
      } catch (error) {
        console.error('Error sending invitations:', error);
        throw error;
      }
    }
  });

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <h3 className="text-lg font-medium">Bulk Invite Users</h3>
      
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
      
      {invalidEmails.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <p>The following emails are invalid:</p>
          <ul className="list-disc pl-5 mt-2">
            {invalidEmails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="emails">Email Addresses</Label>
          <p className="text-sm text-muted-foreground">
            Enter multiple email addresses separated by commas, semicolons, or new lines
          </p>
          <Textarea
            id="emails"
            name="emails"
            placeholder="user1@example.com, user2@example.com, user3@example.com"
            rows={5}
            value={values.emails}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.emails && errors.emails}
            aria-invalid={!!(touched.emails && errors.emails)}
            aria-describedby={errors.emails ? "emails-error" : undefined}
          />
          {touched.emails && errors.emails && (
            <p id="emails-error" className="text-sm text-destructive">
              {errors.emails}
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
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sendIndividualEmails"
            name="sendIndividualEmails"
            checked={values.sendIndividualEmails}
            onCheckedChange={(checked) => setFieldValue('sendIndividualEmails', checked)}
          />
          <Label htmlFor="sendIndividualEmails" className="cursor-pointer">
            Send individual emails (instead of BCC)
          </Label>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Sending...
              </>
            ) : (
              'Send Invitations'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}