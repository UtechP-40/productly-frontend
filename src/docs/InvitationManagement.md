# Invitation Management

The Invitation Management system allows administrators to invite users to the application with specific roles. It provides functionality for sending individual and bulk invitations, tracking invitation status, and managing pending invitations.

## Components

### InvitationManagement

The main container component that combines all invitation-related functionality.

```jsx
import { InvitationManagement } from '../components/dashboard/invitation';

<InvitationManagement />
```

### InvitationForm

A form for sending individual invitations.

```jsx
import { InvitationForm } from '../components/dashboard/invitation';

<InvitationForm 
  roles={roles} 
  onInvitationSent={handleInvitationSent} 
/>
```

### BulkInvitationForm

A form for sending multiple invitations at once.

```jsx
import { BulkInvitationForm } from '../components/dashboard/invitation';

<BulkInvitationForm 
  roles={roles} 
  onInvitationsSent={handleInvitationsSent} 
/>
```

### InvitationList

A component for displaying and managing invitations.

```jsx
import { InvitationList } from '../components/dashboard/invitation';

<InvitationList roles={roles} />
```

## API Routes

### GET /api/invitations

Fetches all invitations for the current organization.

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 20)
- `status`: Filter by invitation status (optional)
- `sortBy`: Field to sort by (default: createdAt)
- `sortOrder`: Sort direction (default: desc)

### POST /api/invitations

Creates a new invitation or bulk invitations.

Payload for single invitation:
```json
{
  "email": "user@example.com",
  "roleId": "role-id"
}
```

Payload for bulk invitations:
```json
{
  "emails": ["user1@example.com", "user2@example.com"],
  "roleId": "role-id",
  "sendIndividualEmails": false
}
```

### GET /api/invitations/[id]

Fetches a specific invitation by ID.

### DELETE /api/invitations/[id]

Revokes an invitation.

### POST /api/invitations/[id]/resend

Resends an invitation.

## Permissions

The following permissions are required to access invitation management functionality:

- `MANAGE_INVITATIONS`: Required to access the invitation management page

## Invitation Statuses

- `PENDING`: The invitation has been sent but not yet accepted
- `ACCEPTED`: The invitation has been accepted and the user has registered
- `EXPIRED`: The invitation has expired and can no longer be used
- `REVOKED`: The invitation has been manually revoked by an administrator