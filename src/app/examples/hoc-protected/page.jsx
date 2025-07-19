"use client";

import withAuth from '../../../components/auth/withAuth';

/**
 * Example component that will be protected
 */
function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Page (HOC Protected)</h1>
      <p>This content is only visible to authenticated users with admin role.</p>
      <p>This page uses the withAuth HOC pattern instead of the AuthGuard component.</p>
    </div>
  );
}

// Export the component wrapped with authentication
export default withAuth(AdminPage, {
  requiredRoles: ['admin'],
  redirectTo: '/auth/login'
});