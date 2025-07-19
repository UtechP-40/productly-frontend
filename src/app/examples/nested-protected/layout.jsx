"use client";

import AuthGuard from '../../../components/auth/AuthGuard';

/**
 * Example of a protected layout using AuthGuard
 * This protects all nested routes under /examples/nested-protected/
 */
export default function ProtectedLayout({ children }) {
  return (
    <AuthGuard>
      <div className="container mx-auto py-4">
        <div className="bg-muted p-4 mb-4 rounded-lg">
          <h2 className="font-semibold">Protected Area</h2>
          <p className="text-sm text-muted-foreground">
            This entire section is protected by AuthGuard at the layout level
          </p>
        </div>
        {children}
      </div>
    </AuthGuard>
  );
}