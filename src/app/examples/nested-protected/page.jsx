"use client";

/**
 * Example of a page within a protected layout
 * This page is automatically protected by the parent layout's AuthGuard
 */
export default function NestedProtectedPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Nested Protected Page</h1>
      <p>This page is protected by the parent layout's AuthGuard.</p>
    </div>
  );
}