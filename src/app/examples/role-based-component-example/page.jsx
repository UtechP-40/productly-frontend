"use client";

import { useState } from 'react';
import RoleBasedComponent from '../../../components/auth/RoleBasedComponent';
import AuthGuard from '../../../components/auth/AuthGuard';

/**
 * Example page demonstrating the RoleBasedComponent wrapper
 */
export default function RoleBasedComponentExample() {
  const [activeTab, setActiveTab] = useState('basic');

  // Example tabs to demonstrate different RoleBasedComponent use cases
  const tabs = [
    { id: 'basic', label: 'Basic Usage' },
    { id: 'hierarchy', label: 'Role Hierarchy' },
    { id: 'debug', label: 'With Debugging' },
    { id: 'complex', label: 'Complex Example' },
  ];

  // Define a simple role hierarchy for examples
  const simpleHierarchy = {
    admin: ['manager'],
    manager: ['user'],
    user: []
  };

  // Define a more complex role hierarchy for the complex example
  const complexHierarchy = {
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
    <AuthGuard>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">RoleBasedComponent Examples</h1>
        <p className="mb-6">
          This page demonstrates different ways to use the RoleBasedComponent wrapper for dynamic component rendering
          based on user roles.
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
                The most basic usage of RoleBasedComponent renders different components based on user role:
              </p>

              <div className="p-4 bg-muted/50 rounded-md mb-4">
                <RoleBasedComponent
                  components={{
                    admin: (
                      <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                        <p className="font-medium">Admin Dashboard</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown to users with the admin role.
                        </p>
                      </div>
                    ),
                    manager: (
                      <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                        <p className="font-medium">Manager Dashboard</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown to users with the manager role.
                        </p>
                      </div>
                    ),
                    user: (
                      <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-md">
                        <p className="font-medium">User Dashboard</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown to users with the user role.
                        </p>
                      </div>
                    ),
                    default: (
                      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
                        <p className="font-medium">Default View</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown when no role matches or the user is not authenticated.
                        </p>
                      </div>
                    )
                  }}
                />
              </div>

              <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                <code>{`<RoleBasedComponent
  components={{
    admin: <AdminDashboard />,
    manager: <ManagerDashboard />,
    user: <UserDashboard />,
    default: <DefaultView />
  }}
/>`}</code>
              </pre>
            </div>
          )}

          {/* Role Hierarchy Example */}
          {activeTab === 'hierarchy' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Role Hierarchy</h2>
              <p className="mb-4">
                You can define a role hierarchy to implement role inheritance:
              </p>

              <div className="p-4 bg-muted/50 rounded-md mb-4">
                <RoleBasedComponent
                  components={{
                    admin: (
                      <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                        <p className="font-medium">Admin Controls</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown to users with the admin role.
                        </p>
                      </div>
                    ),
                    manager: (
                      <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                        <p className="font-medium">Manager Controls</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown to users with the manager role or admin role (through inheritance).
                        </p>
                      </div>
                    ),
                    user: (
                      <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-md">
                        <p className="font-medium">User Controls</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown to users with the user role, manager role, or admin role (through inheritance).
                        </p>
                      </div>
                    ),
                    default: (
                      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
                        <p className="font-medium">Default Controls</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown when no role matches or the user is not authenticated.
                        </p>
                      </div>
                    )
                  }}
                  roleHierarchy={simpleHierarchy}
                />
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Role Hierarchy Definition:</h3>
                <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                  <code>{`const roleHierarchy = {
  admin: ['manager'],    // Admin inherits manager permissions
  manager: ['user'],     // Manager inherits user permissions
  user: []               // User has no inheritance
};`}</code>
                </pre>
              </div>

              <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                <code>{`<RoleBasedComponent
  components={{
    admin: <AdminControls />,
    manager: <ManagerControls />,
    user: <UserControls />,
    default: <DefaultControls />
  }}
  roleHierarchy={roleHierarchy}
/>`}</code>
              </pre>
            </div>
          )}

          {/* Debug Example */}
          {activeTab === 'debug' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">With Debugging</h2>
              <p className="mb-4">
                Enable debugging to troubleshoot role-based rendering:
              </p>

              <div className="p-4 bg-muted/50 rounded-md mb-4">
                <RoleBasedComponent
                  components={{
                    admin: (
                      <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                        <p className="font-medium">Admin View</p>
                        <p className="text-sm text-muted-foreground">
                          Admin component content
                        </p>
                      </div>
                    ),
                    manager: (
                      <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                        <p className="font-medium">Manager View</p>
                        <p className="text-sm text-muted-foreground">
                          Manager component content
                        </p>
                      </div>
                    ),
                    user: (
                      <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-md">
                        <p className="font-medium">User View</p>
                        <p className="text-sm text-muted-foreground">
                          User component content
                        </p>
                      </div>
                    ),
                    default: (
                      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
                        <p className="font-medium">Default View</p>
                        <p className="text-sm text-muted-foreground">
                          Default component content
                        </p>
                      </div>
                    )
                  }}
                  roleHierarchy={simpleHierarchy}
                  debug={true}
                />
              </div>

              <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                <code>{`<RoleBasedComponent
  components={{
    admin: <AdminView />,
    manager: <ManagerView />,
    user: <UserView />,
    default: <DefaultView />
  }}
  roleHierarchy={roleHierarchy}
  debug={true}
/>`}</code>
              </pre>
            </div>
          )}

          {/* Complex Example */}
          {activeTab === 'complex' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Complex Example</h2>
              <p className="mb-4">
                A more complex example with multiple inheritance paths:
              </p>

              <div className="p-4 bg-muted/50 rounded-md mb-4">
                <RoleBasedComponent
                  components={{
                    'super-admin': (
                      <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-md">
                        <p className="font-medium">Super Admin View</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown to users with the super-admin role.
                        </p>
                      </div>
                    ),
                    'admin': (
                      <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                        <p className="font-medium">Admin View</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown to users with the admin role or super-admin role.
                        </p>
                      </div>
                    ),
                    'system-manager': (
                      <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-md">
                        <p className="font-medium">System Manager View</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown to users with the system-manager role or super-admin role.
                        </p>
                      </div>
                    ),
                    'content-editor': (
                      <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-md">
                        <p className="font-medium">Content Editor View</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown to users with the content-editor role or admin role.
                        </p>
                      </div>
                    ),
                    'user': (
                      <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-md">
                        <p className="font-medium">User View</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown to users with any role that inherits from user.
                        </p>
                      </div>
                    ),
                    default: (
                      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
                        <p className="font-medium">Guest View</p>
                        <p className="text-sm text-muted-foreground">
                          This component is shown when no role matches or the user is not authenticated.
                        </p>
                      </div>
                    )
                  }}
                  roleHierarchy={complexHierarchy}
                  debug={true}
                />
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Complex Role Hierarchy:</h3>
                <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                  <code>{`const complexHierarchy = {
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
};`}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}