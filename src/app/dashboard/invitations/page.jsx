"use client";

import { InvitationManagement } from '../../../components/dashboard/invitation';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function InvitationsPage() {
  return (
    <AuthGuard requiredPermissions={["MANAGE_INVITATIONS"]}>
      <InvitationManagement />
    </AuthGuard>
  );
}