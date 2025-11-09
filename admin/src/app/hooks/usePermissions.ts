'use client';

import { useSession } from 'next-auth/react';
import { Role, Permission } from '@/app/types';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/app/config/permission';

export function usePermissions() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.rol as Role | undefined;

  return {
    hasPermission: (permission: Permission) => {
      if (!userRole) return false;
      return hasPermission(userRole, permission);
    },
    hasAnyPermission: (permissions: Permission[]) => {
      if (!userRole) return false;
      return hasAnyPermission(userRole, permissions);
    },
    hasAllPermissions: (permissions: Permission[]) => {
      if (!userRole) return false;
      return hasAllPermissions(userRole, permissions);
    },
    userRole,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated'
  };
}
