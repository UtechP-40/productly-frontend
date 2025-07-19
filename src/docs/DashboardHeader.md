# DashboardHeader Component

The `DashboardHeader` component displays user session information and provides session management controls in the dashboard interface.

## Features

- Displays current user role and profile information
- Shows session timeout warnings with countdown timer
- Provides session extension functionality
- Supports role switching for users with multiple roles
- Includes user profile dropdown with quick actions
- Integrates with authentication system for secure session management

## Usage

### Basic Usage with DashboardLayout

```jsx
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AuthGuard from '../components/auth/AuthGuard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <h1>Dashboard Content</h1>
        <p>Your dashboard content goes here</p>
      </DashboardLayout>
    </AuthGuard>
  );
}
```

### Standalone Usage

```jsx
import { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../hooks/useAuth';

export default function CustomDashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock current user data
  const currentUser = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    role: user?.organizationRole?.name || 'MANAGER',
    avatar: user?.avatar || 'https://github.com/shadcn.png',
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        currentUser={currentUser}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <main className="p-6">
        {/* Your custom dashboard content */}
      </main>
    </div>
  );
}
```

## Session Management

The header component integrates with the session management system to:

1. Display the time remaining in the current session
2. Show warnings when the session is about to expire
3. Provide a button to extend the session
4. Automatically log out when the session expires

### Session Timeout Warning

When a session is about to expire (default: 5 minutes before expiry), the header displays a warning with:

- A countdown timer showing the remaining time
- An "Extend" button to refresh the session

### Session Extension

Clicking the "Extend" button in the warning or in the user dropdown menu will:

1. Call the authentication API to refresh the token
2. Reset the session timeout timer
3. Hide the warning notification
4. Allow the user to continue working without interruption

## Role Switching

For users with multiple roles, the header provides a role switcher dropdown that:

1. Shows all available roles for the current user
2. Indicates the currently active role
3. Allows switching between roles without logging out
4. Updates permissions and access rights immediately after switching

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentUser` | Object | (required) | Current user information object |
| `currentUser.name` | string | - | User's display name |
| `currentUser.email` | string | - | User's email address |
| `currentUser.role` | string | - | User's current role |
| `currentUser.avatar` | string | - | URL to user's avatar image |
| `onToggleSidebar` | Function | - | Function to toggle sidebar visibility |

## Integration with Authentication System

The component uses the `useAuth` hook to:

- Access current user information
- Monitor session status
- Handle session extension
- Manage role switching
- Process logout requests

## Customization

The header can be customized by:

- Modifying the styling using Tailwind CSS classes
- Extending the user dropdown menu with additional options
- Configuring session timeout durations in the session manager
- Adding or removing features based on application requirements