"use client";

import AuthGuard from '../../../components/auth/AuthGuard';

/**
 * Example of a protected page using AuthGuard
 */
export default function ProtectedPage() {
  return (
    <AuthGuard requiredRoles={['admin', 'manager']}>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
        <p>This content is only visible to authenticated users with admin or manager roles.</p>
      </div>
    </AuthGuard>
  );
}