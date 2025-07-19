import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoleBasedComponent from '../../../components/auth/RoleBasedComponent';
import { useAuth } from '../../../hooks/useAuth';

// Mock the useAuth hook
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

// Mock the LoadingSpinner component
jest.mock('../../../components/ui/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>
}));

describe('RoleBasedComponent', () => {
  const mockComponents = {
    admin: <div data-testid="admin-component">Admin Component</div>,
    manager: <div data-testid="manager-component">Manager Component</div>,
    user: <div data-testid="user-component">User Component</div>,
    default: <div data-testid="default-component">Default Component</div>
  };

  const mockRoleHierarchy = {
    admin: ['manager'],
    manager: ['user'],
    user: []
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders loading spinner when authentication is loading', () => {
    // Mock the useAuth hook to return loading state
    useAuth.mockReturnValue({
      user: null,
      role: null,
      loading: true,
      initialized: false,
      isAuthenticated: false
    });

    render(
      <RoleBasedComponent
        components={mockComponents}
        roleHierarchy={mockRoleHierarchy}
      />
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders default component when user is not authenticated', async () => {
    // Mock the useAuth hook to return unauthenticated state
    useAuth.mockReturnValue({
      user: null,
      role: null,
      loading: false,
      initialized: true,
      isAuthenticated: false
    });

    render(
      <RoleBasedComponent
        components={mockComponents}
        roleHierarchy={mockRoleHierarchy}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('default-component')).toBeInTheDocument();
    });
  });

  test('renders admin component for admin role', async () => {
    // Mock the useAuth hook to return admin role
    useAuth.mockReturnValue({
      user: { id: '1', name: 'Admin User' },
      role: { name: 'admin', permissions: [] },
      loading: false,
      initialized: true,
      isAuthenticated: true
    });

    render(
      <RoleBasedComponent
        components={mockComponents}
        roleHierarchy={mockRoleHierarchy}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('admin-component')).toBeInTheDocument();
    });
  });

  test('renders manager component for manager role', async () => {
    // Mock the useAuth hook to return manager role
    useAuth.mockReturnValue({
      user: { id: '2', name: 'Manager User' },
      role: { name: 'manager', permissions: [] },
      loading: false,
      initialized: true,
      isAuthenticated: true
    });

    render(
      <RoleBasedComponent
        components={mockComponents}
        roleHierarchy={mockRoleHierarchy}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('manager-component')).toBeInTheDocument();
    });
  });

  test('renders user component for user role', async () => {
    // Mock the useAuth hook to return user role
    useAuth.mockReturnValue({
      user: { id: '3', name: 'Regular User' },
      role: { name: 'user', permissions: [] },
      loading: false,
      initialized: true,
      isAuthenticated: true
    });

    render(
      <RoleBasedComponent
        components={mockComponents}
        roleHierarchy={mockRoleHierarchy}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-component')).toBeInTheDocument();
    });
  });

  test('renders manager component for admin role through inheritance', async () => {
    // Mock the useAuth hook to return admin role
    useAuth.mockReturnValue({
      user: { id: '1', name: 'Admin User' },
      role: { name: 'admin', permissions: [] },
      loading: false,
      initialized: true,
      isAuthenticated: true
    });

    // Remove admin component to test inheritance
    const componentsWithoutAdmin = {
      manager: mockComponents.manager,
      user: mockComponents.user,
      default: mockComponents.default
    };

    render(
      <RoleBasedComponent
        components={componentsWithoutAdmin}
        roleHierarchy={mockRoleHierarchy}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('manager-component')).toBeInTheDocument();
    });
  });

  test('renders user component for admin role through deep inheritance', async () => {
    // Mock the useAuth hook to return admin role
    useAuth.mockReturnValue({
      user: { id: '1', name: 'Admin User' },
      role: { name: 'admin', permissions: [] },
      loading: false,
      initialized: true,
      isAuthenticated: true
    });

    // Remove admin and manager components to test deep inheritance
    const componentsWithoutAdminManager = {
      user: mockComponents.user,
      default: mockComponents.default
    };

    render(
      <RoleBasedComponent
        components={componentsWithoutAdminManager}
        roleHierarchy={mockRoleHierarchy}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-component')).toBeInTheDocument();
    });
  });

  test('renders debug information when debug is true', async () => {
    // Mock the useAuth hook to return admin role
    useAuth.mockReturnValue({
      user: { id: '1', name: 'Admin User' },
      role: { name: 'admin', permissions: [] },
      loading: false,
      initialized: true,
      isAuthenticated: true
    });

    render(
      <RoleBasedComponent
        components={mockComponents}
        roleHierarchy={mockRoleHierarchy}
        debug={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('RoleBasedComponent Debug Info')).toBeInTheDocument();
    });
  });

  test('handles complex role hierarchy correctly', async () => {
    // Define a more complex role hierarchy
    const complexHierarchy = {
      'super-admin': ['admin', 'system-manager'],
      'admin': ['manager'],
      'system-manager': ['security-manager'],
      'manager': ['user'],
      'security-manager': ['user'],
      'user': []
    };

    // Define components for the complex hierarchy
    const complexComponents = {
      'super-admin': <div data-testid="super-admin-component">Super Admin Component</div>,
      'system-manager': <div data-testid="system-manager-component">System Manager Component</div>,
      'user': <div data-testid="user-component">User Component</div>,
      'default': <div data-testid="default-component">Default Component</div>
    };

    // Mock the useAuth hook to return super-admin role
    useAuth.mockReturnValue({
      user: { id: '1', name: 'Super Admin User' },
      role: { name: 'super-admin', permissions: [] },
      loading: false,
      initialized: true,
      isAuthenticated: true
    });

    render(
      <RoleBasedComponent
        components={complexComponents}
        roleHierarchy={complexHierarchy}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('super-admin-component')).toBeInTheDocument();
    });

    // Change to security-manager role which should see user component through inheritance
    useAuth.mockReturnValue({
      user: { id: '2', name: 'Security Manager User' },
      role: { name: 'security-manager', permissions: [] },
      loading: false,
      initialized: true,
      isAuthenticated: true
    });

    render(
      <RoleBasedComponent
        components={complexComponents}
        roleHierarchy={complexHierarchy}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-component')).toBeInTheDocument();
    });
  });

  test('does not show loading spinner when showLoading is false', () => {
    // Mock the useAuth hook to return loading state
    useAuth.mockReturnValue({
      user: null,
      role: null,
      loading: true,
      initialized: false,
      isAuthenticated: false
    });

    render(
      <RoleBasedComponent
        components={mockComponents}
        roleHierarchy={mockRoleHierarchy}
        showLoading={false}
      />
    );

    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });
});