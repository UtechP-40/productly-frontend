import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PermissionGate from '../../../components/auth/PermissionGate';
import { useAuth } from '../../../hooks/useAuth';

// Mock the useAuth hook
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

describe('PermissionGate Component', () => {
  // Helper function to set up auth mock with different states
  const setupAuthMock = ({
    isAuthenticated = true,
    loading = false,
    initialized = true,
    hasRole = jest.fn(() => false),
    hasPermission = jest.fn(() => false)
  } = {}) => {
    useAuth.mockReturnValue({
      user: isAuthenticated ? { id: '123', name: 'Test User' } : null,
      role: isAuthenticated ? { id: '456', name: 'user' } : null,
      loading,
      initialized,
      isAuthenticated,
      hasRole,
      hasPermission
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner when authentication is loading', () => {
    setupAuthMock({ loading: true });
    
    render(
      <PermissionGate>
        <div>Protected content</div>
      </PermissionGate>
    );
    
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    // Check for loading spinner (implementation depends on your LoadingSpinner component)
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  test('renders children when user is authenticated with no specific requirements', () => {
    setupAuthMock();
    
    render(
      <PermissionGate>
        <div>Protected content</div>
      </PermissionGate>
    );
    
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  test('renders nothing when user is not authenticated', () => {
    setupAuthMock({ isAuthenticated: false });
    
    render(
      <PermissionGate>
        <div>Protected content</div>
      </PermissionGate>
    );
    
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  test('renders fallback when user is not authenticated', () => {
    setupAuthMock({ isAuthenticated: false });
    
    render(
      <PermissionGate fallback={<div>Access denied</div>}>
        <div>Protected content</div>
      </PermissionGate>
    );
    
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    expect(screen.getByText('Access denied')).toBeInTheDocument();
  });

  test('renders children when user has required role', () => {
    setupAuthMock({
      hasRole: jest.fn(role => role === 'admin')
    });
    
    render(
      <PermissionGate requiredRoles={['admin']}>
        <div>Admin content</div>
      </PermissionGate>
    );
    
    expect(screen.getByText('Admin content')).toBeInTheDocument();
  });

  test('renders nothing when user does not have required role', () => {
    setupAuthMock({
      hasRole: jest.fn(role => role === 'user')
    });
    
    render(
      <PermissionGate requiredRoles={['admin']}>
        <div>Admin content</div>
      </PermissionGate>
    );
    
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
  });

  test('renders children when user has required permission', () => {
    setupAuthMock({
      hasPermission: jest.fn(permission => permission === 'users.manage')
    });
    
    render(
      <PermissionGate requiredPermissions={['users.manage']}>
        <div>User management</div>
      </PermissionGate>
    );
    
    expect(screen.getByText('User management')).toBeInTheDocument();
  });

  test('renders nothing when user does not have required permission', () => {
    setupAuthMock({
      hasPermission: jest.fn(permission => permission === 'users.view')
    });
    
    render(
      <PermissionGate requiredPermissions={['users.manage']}>
        <div>User management</div>
      </PermissionGate>
    );
    
    expect(screen.queryByText('User management')).not.toBeInTheDocument();
  });

  test('renders children when user has ANY of the required roles or permissions', () => {
    setupAuthMock({
      hasRole: jest.fn(role => role === 'editor'),
      hasPermission: jest.fn(permission => permission === 'content.view')
    });
    
    render(
      <PermissionGate 
        requiredRoles={['admin', 'editor']} 
        requiredPermissions={['content.edit']}
        requirementType="ANY"
      >
        <div>Content management</div>
      </PermissionGate>
    );
    
    expect(screen.getByText('Content management')).toBeInTheDocument();
  });

  test('renders children when user has ALL of the required roles and permissions', () => {
    setupAuthMock({
      hasRole: jest.fn(role => role === 'admin'),
      hasPermission: jest.fn(permission => permission === 'settings.manage')
    });
    
    render(
      <PermissionGate 
        requiredRoles={['admin']} 
        requiredPermissions={['settings.manage']}
        requirementType="ALL"
      >
        <div>Settings management</div>
      </PermissionGate>
    );
    
    expect(screen.getByText('Settings management')).toBeInTheDocument();
  });

  test('renders nothing when user does not have ALL required roles and permissions', () => {
    setupAuthMock({
      hasRole: jest.fn(role => role === 'admin'),
      hasPermission: jest.fn(permission => permission === 'users.view') // Missing settings.manage
    });
    
    render(
      <PermissionGate 
        requiredRoles={['admin']} 
        requiredPermissions={['settings.manage']}
        requirementType="ALL"
      >
        <div>Settings management</div>
      </PermissionGate>
    );
    
    expect(screen.queryByText('Settings management')).not.toBeInTheDocument();
  });

  test('does not show loading spinner when showLoading is false', () => {
    setupAuthMock({ loading: true });
    
    render(
      <PermissionGate showLoading={false}>
        <div>Protected content</div>
      </PermissionGate>
    );
    
    expect(document.querySelector('svg')).not.toBeInTheDocument();
  });

  test('applies custom className to container', () => {
    setupAuthMock();
    
    render(
      <PermissionGate className="custom-class">
        <div>Protected content</div>
      </PermissionGate>
    );
    
    expect(screen.getByText('Protected content').parentElement).toHaveClass('custom-class');
  });
});