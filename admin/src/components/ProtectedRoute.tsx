'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePermissions } from '@/app/hooks/usePermissions';
import { Permission } from '@/app/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  fallback = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
        <p className="text-gray-600">No tienes permisos para acceder a esta página</p>
      </div>
    </div>
  ),
  redirectTo
}: ProtectedRouteProps) {
  const router = useRouter();
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading, isAuthenticated } = usePermissions();

  const hasAccess = () => {
    if (!isAuthenticated) return false;
    
    if (requiredPermission) {
      return hasPermission(requiredPermission);
    }
    
    if (requiredPermissions) {
      return requireAll 
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);
    }
    
    return true;
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/api/auth/login');
    } else if (!isLoading && isAuthenticated && !hasAccess()) {
      if (redirectTo) {
        router.push(redirectTo);
      }
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated || !hasAccess()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}