# RoleBasedComponent Wrapper

The `RoleBasedComponent` wrapper provides dynamic component rendering based on user roles with support for role hierarchy and inheritance.

## Features

- Dynamically renders different components based on user roles
- Supports role hierarchy and inheritance for complex permission structures
- Provides efficient permission caching for performance optimization
- Includes debugging tools for permission troubleshooting
- Handles loading states during authentication checks
- Supports fallback components for users without specific roles

## Usage

### Basic Usage

```jsx
import RoleBasedComponent from '../components/auth/RoleBasedComponent';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import UserDashboard from './UserDashboard';

export default function Dashboard() {
  return (
    <RoleBasedComponent
      components={{
        admin: <AdminDashboard />,
        manager: <ManagerDashboard />,
        user: <UserDashboard />,
        default: <p>Please log in to view your dashboard</p>
      }}
    />
  );
}
```

### With Role Hierarchy

```jsx
import RoleBasedComponent from '../components/auth/RoleBasedComponent';
import AdminControls from './AdminControls';
import ManagerControls from './ManagerControls';
import UserControls from './UserControls';

export default function ControlPanel() {
  // Define role hierarchy: admin inherits manager permissions, manager inherits user permissions
  const roleHierarchy = {
    admin: ['manager'],
    manager: ['user'],
    user: []
  };

  return (
    <RoleBasedComponent
      components={{
        admin: <AdminControls />,
        manager: <ManagerControls />,
        user: <UserControls />,
        default: <p>Access denied</p>
      }}
      roleHierarchy={roleHierarchy}
    />
  );
}
```

### With Debugging Enabled

```jsx
import RoleBasedComponent from '../components/auth/RoleBasedComponent';

export default function DebugView() {
  return (
    <RoleBasedComponent
      components={{
        admin: <div>Admin View</div>,
        manager: <div>Manager View</div>,
        user: <div>User View</div>,
        default: <div>Default View</div>
      }}
      debug={true}
    />
  );
}
```

### Disable Loading Indicator

```jsx
import RoleBasedComponent from '../components/auth/RoleBasedComponent';

export default function QuickLoadComponent() {
  return (
    <RoleBasedComponent
      components={{
        admin: <div>Admin Content</div>,
        user: <div>User Content</div>,
        default: <div>Default Content</div>
      }}
      showLoading={false}
    />
  );
}
```

### Complex Role Hierarchy Example

```jsx
import RoleBasedComponent from '../components/auth/RoleBasedComponent';

export default function OrganizationView() {
  // Complex role hierarchy with multiple inheritance paths
  const roleHierarchy = {
    'super-admin': ['admin', 'system-manager'],
    'admin': ['manager', 'content-editor'],
    'system-manager': ['infrastructure-manager', 'security-manager'],
    'manager': ['team-lead'],
    'team-lead': ['user'],
    'content-editor': ['content-viewer'],
    'infrastructure-manager': ['system-viewer'],
    'security-manager': ['security-viewer'],
    'content-viewer': ['user'],
    'system-viewer': ['user'],
    'security-viewer': ['user'],
    'user': []
  };

  return (
    <RoleBasedComponent
      components={{
        'super-admin': <SuperAdminView />,
        'admin': <AdminView />,
        'system-manager': <SystemManagerView />,
        'manager': <ManagerView />,
        'content-editor': <ContentEditorView />,
        'user': <UserView />,
        default: <GuestView />
      }}
      roleHierarchy={roleHierarchy}
      debug={process.env.NODE_ENV === 'development'}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `components` | Object | (required) | Map of components to render based on roles |
| `components.default` | ReactNode | (required) | Default component to render if no role matches |
| `components[roleName]` | ReactNode | - | Component to render for specific role |
| `roleHierarchy` | Object | `{}` | Role hierarchy definition for inheritance |
| `debug` | boolean | `false` | Whether to show debugging information |
| `showLoading` | boolean | `true` | Whether to show loading state while checking roles |
| `className` | string | `undefined` | Additional CSS classes for the container |

## Role Hierarchy

The role hierarchy is defined as an object where:
- Each key is a role name
- Each value is an array of roles that the key role inherits from

For example:
```js
{
  'admin': ['manager'], // Admin inherits all manager permissions
  'manager': ['user'],  // Manager inherits all user permissions
  'user': []            // User has no inheritance
}
```

With this hierarchy:
- If a user has the 'admin' role, they will see the admin component if available
- If there's no admin component but there is a manager component, they'll see the manager component
- If there's no admin or manager component but there is a user component, they'll see the user component
- If none of these components exist, they'll see the default component

## Debugging

When the `debug` prop is set to `true`, the component will render debugging information including:
- Current user authentication status
- User's role
- Selected component and selection reason
- Available components
- Role hierarchy and inheritance information

This is particularly useful during development to troubleshoot permission issues.

## Notes

- The component uses the `useAuth` hook which must be provided by an `AuthProvider` higher in the component tree
- Role inheritance is calculated once and cached for performance
- The component prevents circular references in role hierarchies
- For simple role-based UI conditionals, consider using the `PermissionGate` component instead
- For route-level protection, use `AuthGuard` instead