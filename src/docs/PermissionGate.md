# PermissionGate Component

The `PermissionGate` component provides component-level permission checking and conditional rendering based on user roles and permissions.

## Features

- Conditionally renders content based on user roles and permissions
- Supports both role-based and permission-based access control
- Provides customizable fallback content for unauthorized users
- Supports flexible permission logic with "ANY" (OR) or "ALL" (AND) requirements
- Handles loading states during authentication checks
- Lightweight alternative to route-level AuthGuard for component-level control

## Usage

### Basic Usage (Authentication Only)

```jsx
import PermissionGate from '../components/auth/PermissionGate';

export default function MyPage() {
  return (
    <div>
      <h1>Welcome to My Page</h1>
      
      <PermissionGate>
        <p>This content is only visible to authenticated users</p>
      </PermissionGate>
      
      <p>This content is visible to everyone</p>
    </div>
  );
}
```

### Role-Based Rendering

```jsx
import PermissionGate from '../components/auth/PermissionGate';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <PermissionGate requiredRoles={['admin']}>
        <div className="admin-panel">
          <h2>Admin Controls</h2>
          {/* Admin-only content */}
        </div>
      </PermissionGate>
      
      <PermissionGate requiredRoles={['user', 'manager']}>
        <div className="user-content">
          <h2>User Content</h2>
          {/* Content for users and managers */}
        </div>
      </PermissionGate>
    </div>
  );
}
```

### Permission-Based Rendering

```jsx
import PermissionGate from '../components/auth/PermissionGate';

export default function UserManagement() {
  return (
    <div>
      <h1>User Management</h1>
      
      <PermissionGate requiredPermissions={['users.view']}>
        <UserList />
      </PermissionGate>
      
      <PermissionGate requiredPermissions={['users.create']}>
        <AddUserButton />
      </PermissionGate>
      
      <PermissionGate requiredPermissions={['users.delete']}>
        <DeleteUserButton />
      </PermissionGate>
    </div>
  );
}
```

### Custom Fallback Content

```jsx
import PermissionGate from '../components/auth/PermissionGate';

export default function Reports() {
  return (
    <div>
      <h1>Reports</h1>
      
      <PermissionGate 
        requiredPermissions={['reports.financial']}
        fallback={<p>You don't have permission to view financial reports.</p>}
      >
        <FinancialReports />
      </PermissionGate>
    </div>
  );
}
```

### Combined Requirements with AND Logic

```jsx
import PermissionGate from '../components/auth/PermissionGate';

export default function Settings() {
  return (
    <div>
      <h1>System Settings</h1>
      
      <PermissionGate 
        requiredRoles={['admin']}
        requiredPermissions={['settings.security']}
        requirementType="ALL" // Requires BOTH the role AND the permission
      >
        <SecuritySettings />
      </PermissionGate>
    </div>
  );
}
```

### Combined Requirements with OR Logic

```jsx
import PermissionGate from '../components/auth/PermissionGate';

export default function ContentEditor() {
  return (
    <div>
      <h1>Content Editor</h1>
      
      <PermissionGate 
        requiredRoles={['admin', 'editor']}
        requiredPermissions={['content.edit']}
        requirementType="ANY" // Requires EITHER the role OR the permission
      >
        <Editor />
      </PermissionGate>
    </div>
  );
}
```

### Disable Loading Indicator

```jsx
import PermissionGate from '../components/auth/PermissionGate';

export default function QuickLoadComponent() {
  return (
    <PermissionGate 
      requiredPermissions={['feature.access']}
      showLoading={false}
    >
      <div>This won't show a loading spinner during permission checks</div>
    </PermissionGate>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | (required) | Content to render when authorized |
| `fallback` | ReactNode | `null` | Content to render when unauthorized |
| `requiredRoles` | string[] | `[]` | Array of roles that can access the content |
| `requiredPermissions` | string[] | `[]` | Array of permissions required to access the content |
| `requirementType` | string | `"ANY"` | How to evaluate multiple requirements: "ANY" (OR logic) or "ALL" (AND logic) |
| `showLoading` | boolean | `true` | Whether to show loading state while checking permissions |
| `className` | string | `undefined` | Additional CSS classes for the container |

## Notes

- The component uses the `useAuth` hook which must be provided by an `AuthProvider` higher in the component tree
- Unlike `AuthGuard`, this component doesn't handle navigation or redirection
- For route-level protection, use `AuthGuard` instead
- For component-level permission checks, use `PermissionGate`
- The component will render `null` if unauthorized and no fallback is provided