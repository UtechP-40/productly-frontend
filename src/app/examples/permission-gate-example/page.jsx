"use client";

import { useState } from 'react';
import PermissionGate from '../../../components/auth/PermissionGate';
import AuthGuard from '../../../components/auth/AuthGuard';

/**
 * Example page demonstrating the PermissionGate component
 */
export default function PermissionGateExample() {
  const [activeTab, setActiveTab] = useState('basic');

  // Example tabs to demonstrate different PermissionGate use cases
  const tabs = [
    { id: 'basic', label: 'Basic Usage' },
    { id: 'roles', label: 'Role-Based' },
    { id: 'permissions', label: 'Permission-Based' },
    { id: 'fallback', label: 'With Fallback' },
    { id: 'combined', label: 'Combined Logic' },
  ];

  return (
    <AuthGuard>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">PermissionGate Examples</h1>
        <p className="mb-6">
          This page demonstrates different ways to use the PermissionGate component for component-level
          permission checking and conditional rendering.
        </p>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6 border rounded-lg">
          {/* Basic Usage Example */}
          {activeTab === 'basic' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
              <p className="mb-4">
                The most basic usage of PermissionGate only checks if the user is authenticated:
              </p>

              <div className="p-4 bg-muted/50 rounded-md mb-4">
                <PermissionGate>
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-md">
                    <p className="font-medium">Authenticated Content</p>
                    <p className="text-sm text-muted-foreground">
                      This content is only visible to authenticated users.
                    </p>
                  </div>
                </PermissionGate>
              </div>

              <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                <code>{`<PermissionGate>
  <div>
    <p>Authenticated Content</p>
    <p>This content is only visible to authenticated users.</p>
  </div>
</PermissionGate>`}</code>
              </pre>
            </div>
          )}

          {/* Role-Based Example */}
          {activeTab === 'roles' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Role-Based Rendering</h2>
              <p className="mb-4">
                You can conditionally render content based on user roles:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-md">
                  <PermissionGate requiredRoles={['admin']}>
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                      <p className="font-medium">Admin Content</p>
                      <p className="text-sm text-muted-foreground">
                        This content is only visible to users with the admin role.
                      </p>
                    </div>
                  </PermissionGate>
                </div>

                <div className="p-4 bg-muted/50 rounded-md">
                  <PermissionGate requiredRoles={['user', 'manager']}>
                    <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                      <p className="font-medium">User or Manager Content</p>
                      <p className="text-sm text-muted-foreground">
                        This content is visible to users with either the user or manager role.
                      </p>
                    </div>
                  </PermissionGate>
                </div>
              </div>

              <pre className="mt-4 p-4 bg-muted rounded-md overflow-x-auto">
                <code>{`<PermissionGate requiredRoles={['admin']}>
  <div>Admin-only content</div>
</PermissionGate>

<PermissionGate requiredRoles={['user', 'manager']}>
  <div>Content for users and managers</div>
</PermissionGate>`}</code>
              </pre>
            </div>
          )}

          {/* Permission-Based Example */}
          {activeTab === 'permissions' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Permission-Based Rendering</h2>
              <p className="mb-4">
                You can conditionally render content based on specific permissions:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-md">
                  <PermissionGate requiredPermissions={['users.view']}>
                    <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-md">
                      <p className="font-medium">User Viewer</p>
                      <p className="text-sm text-muted-foreground">
                        This content requires the users.view permission.
                      </p>
                    </div>
                  </PermissionGate>
                </div>

                <div className="p-4 bg-muted/50 rounded-md">
                  <PermissionGate requiredPermissions={['users.manage']}>
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-md">
                      <p className="font-medium">User Manager</p>
                      <p className="text-sm text-muted-foreground">
                        This content requires the users.manage permission.
                      </p>
                    </div>
                  </PermissionGate>
                </div>
              </div>

              <pre className="mt-4 p-4 bg-muted rounded-md overflow-x-auto">
                <code>{`<PermissionGate requiredPermissions={['users.view']}>
  <div>Content for users with view permission</div>
</PermissionGate>

<PermissionGate requiredPermissions={['users.manage']}>
  <div>Content for users with manage permission</div>
</PermissionGate>`}</code>
              </pre>
            </div>
          )}

          {/* Fallback Example */}
          {activeTab === 'fallback' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">With Fallback Content</h2>
              <p className="mb-4">
                You can provide fallback content to display when the user doesn't have the required permissions:
              </p>

              <div className="p-4 bg-muted/50 rounded-md">
                <PermissionGate
                  requiredPermissions={['reports.financial']}
                  fallback={
                    <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
                      <p className="font-medium">Access Denied</p>
                      <p className="text-sm text-muted-foreground">
                        You don't have permission to view financial reports.
                      </p>
                    </div>
                  }
                >
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-md">
                    <p className="font-medium">Financial Reports</p>
                    <p className="text-sm text-muted-foreground">
                      This content shows financial reports for authorized users.
                    </p>
                  </div>
                </PermissionGate>
              </div>

              <pre className="mt-4 p-4 bg-muted rounded-md overflow-x-auto">
                <code>{`<PermissionGate
  requiredPermissions={['reports.financial']}
  fallback={
    <div>
      <p>Access Denied</p>
      <p>You don't have permission to view financial reports.</p>
    </div>
  }
>
  <div>Financial Reports Content</div>
</PermissionGate>`}</code>
              </pre>
            </div>
          )}

          {/* Combined Logic Example */}
          {activeTab === 'combined' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Combined Logic</h2>
              <p className="mb-4">
                You can combine roles and permissions with different logic types:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-md">
                  <h3 className="font-medium mb-2">AND Logic (requirementType="ALL")</h3>
                  <PermissionGate
                    requiredRoles={['admin']}
                    requiredPermissions={['settings.security']}
                    requirementType="ALL"
                    fallback={
                      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
                        <p className="text-sm text-muted-foreground">
                          You need both admin role AND settings.security permission.
                        </p>
                      </div>
                    }
                  >
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-md">
                      <p className="font-medium">Security Settings</p>
                      <p className="text-sm text-muted-foreground">
                        This content requires both admin role AND settings.security permission.
                      </p>
                    </div>
                  </PermissionGate>
                </div>

                <div className="p-4 bg-muted/50 rounded-md">
                  <h3 className="font-medium mb-2">OR Logic (requirementType="ANY")</h3>
                  <PermissionGate
                    requiredRoles={['admin', 'editor']}
                    requiredPermissions={['content.edit']}
                    requirementType="ANY"
                    fallback={
                      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
                        <p className="text-sm text-muted-foreground">
                          You need either admin/editor role OR content.edit permission.
                        </p>
                      </div>
                    }
                  >
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-md">
                      <p className="font-medium">Content Editor</p>
                      <p className="text-sm text-muted-foreground">
                        This content requires either admin/editor role OR content.edit permission.
                      </p>
                    </div>
                  </PermissionGate>
                </div>
              </div>

              <pre className="mt-4 p-4 bg-muted rounded-md overflow-x-auto">
                <code>{`// AND Logic (requires both role AND permission)
<PermissionGate
  requiredRoles={['admin']}
  requiredPermissions={['settings.security']}
  requirementType="ALL"
  fallback={<div>Access denied message</div>}
>
  <div>Security Settings</div>
</PermissionGate>

// OR Logic (requires either role OR permission)
<PermissionGate
  requiredRoles={['admin', 'editor']}
  requiredPermissions={['content.edit']}
  requirementType="ANY"
  fallback={<div>Access denied message</div>}
>
  <div>Content Editor</div>
</PermissionGate>`}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}