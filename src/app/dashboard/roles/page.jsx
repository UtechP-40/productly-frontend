"use client";

import { RoleManagement } from '../../../components/dashboard/role-management';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function RolesPage() {
  return (
    <AuthGuard requiredPermissions={["VIEW_ROLES", "MANAGE_ROLES"]}>
      <RoleManagement />
    </AuthGuard>
  );
}