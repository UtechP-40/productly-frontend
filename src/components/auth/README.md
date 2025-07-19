# Authentication and Authorization Components

This directory contains components for implementing authentication and authorization in the application.

## Components

### AuthGuard

`AuthGuard` is a higher-order component that protects routes based on authentication status and role/permission requirements.

```jsx
import AuthGuard from '../../components/auth/AuthGuard';

export default function ProtectedPage() {
  return (
    <AuthGuard requiredRoles={['admin']}>
      <div>Protected content</div>
    </AuthGuard>
  );
}
```

See [AuthGuard.md](../../docs/AuthGuard.md) for detailed documentation.

### withAuth HOC

`withAuth` is a higher-order component that wraps a component with authentication and authorization checks.

```jsx
import withAuth from '../../components/auth/withAuth';

function AdminPage() {
  return <div>Admin content</div>;
}

export default withAuth(AdminPage, {
  requiredRoles: ['admin']
});
```

## Implementation Details

### Route Protection

Routes can be protected at different levels:

1. **Page-level protection**: Use `AuthGuard` or `withAuth` directly in a page component
2. **Layout-level protection**: Use `AuthGuard` in a layout component to protect all nested routes
3. **API-level protection**: API routes are protected by the middleware

### Authentication Flow

1. User attempts to access a protected route
2. AuthGuard checks if the user is authenticated
3. If not authenticated, the current path is stored and the user is redirected to login
4. After successful login, the user is redirected back to the original path

### Authorization Flow

1. User attempts to access a route with role/permission requirements
2. AuthGuard checks if the user has the required roles/permissions
3. If not authorized, the user is redirected to the unauthorized page

## Usage with Next.js App Router

The authentication components are designed to work with Next.js App Router:

- Use `"use client"` directive in components that use authentication
- Place `AuthGuard` in layout files to protect entire sections
- Use `withAuth` HOC for individual page components

## Security Considerations

- Authentication state is managed by the `useAuth` hook
- Session tokens are stored in HTTP-only cookies
- CSRF protection is implemented for authentication endpoints
- Role and permission checks are performed on both client and server
- Automatic token refresh is implemented to maintain sessions