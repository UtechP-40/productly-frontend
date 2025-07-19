# AuthGuard Component

The `AuthGuard` component is a higher-order component (HOC) that provides route protection based on authentication status and role/permission requirements.

## Features

- Protects routes from unauthenticated access
- Supports role-based access control
- Supports permission-based access control
- Handles loading states during authentication checks
- Supports nested route protection
- Redirects to login page with return URL
- Stores the current path for redirection after login

## Usage

### Basic Protection (Authentication Only)

```jsx
import AuthGuard from '../components/auth/AuthGuard';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This content is only visible to authenticated users</div>
    </AuthGuard>
  );
}
```

### Role-Based Protection

```jsx
import AuthGuard from '../components/auth/AuthGuard';

export default function AdminPage() {
  return (
    <AuthGuard requiredRoles={['admin']}>
      <div>This content is only visible to users with the admin role</div>
    </AuthGuard>
  );
}
```

### Permission-Based Protection

```jsx
import AuthGuard from '../components/auth/AuthGuard';

export default function UserManagementPage() {
  return (
    <AuthGuard requiredPermissions={['users.manage']}>
      <div>This content is only visible to users with the users.manage permission</div>
    </AuthGuard>
  );
}
```

### Combined Role and Permission Protection

```jsx
import AuthGuard from '../components/auth/AuthGuard';

export default function SettingsPage() {
  return (
    <AuthGuard 
      requiredRoles={['admin', 'manager']} 
      requiredPermissions={['settings.view', 'settings.edit']}
    >
      <div>This content requires specific roles AND permissions</div>
    </AuthGuard>
  );
}
```

### Custom Redirect

```jsx
import AuthGuard from '../components/auth/AuthGuard';

export default function MembersOnlyPage() {
  return (
    <AuthGuard redirectTo="/membership-required">
      <div>Members only content</div>
    </AuthGuard>
  );
}
```

### Disable Loading Fallback

```jsx
import AuthGuard from '../components/auth/AuthGuard';

export default function QuickLoadPage() {
  return (
    <AuthGuard loadingFallback={false}>
      <div>This won't show a loading spinner during auth checks</div>
    </AuthGuard>
  );
}
```

### Layout Protection (Nested Routes)

```jsx
// app/admin/layout.jsx
import AuthGuard from '../components/auth/AuthGuard';

export default function AdminLayout({ children }) {
  return (
    <AuthGuard requiredRoles={['admin']}>
      <div>
        <h1>Admin Area</h1>
        {children} {/* All nested routes are protected */}
      </div>
    </AuthGuard>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | (required) | Content to render when authenticated and authorized |
| `requiredRoles` | string[] | `[]` | Array of role names allowed to access the route |
| `requiredPermissions` | string[] | `[]` | Array of permissions required to access the route |
| `redirectTo` | string | `/auth/login` | Path to redirect to when authentication fails |
| `loadingFallback` | boolean | `true` | Whether to show loading spinner during authentication check |

## Notes

- The component uses the `useAuth` hook which must be provided by an `AuthProvider` higher in the component tree
- When a user is redirected to login, the current path is stored in sessionStorage for redirection after successful login
- If a user doesn't have the required roles/permissions, they are redirected to `/unauthorized`
- The component handles both initial loading state and authorization checking state