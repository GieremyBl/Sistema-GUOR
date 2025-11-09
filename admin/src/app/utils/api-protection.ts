import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { Permission, Role } from '@/app/types';
import { rolePermissions } from '@/app/config/permission';

export async function checkPermission(
  request: NextRequest,
  requiredPermission: Permission
): Promise<{ authorized: boolean; session: any; error?: string }> {
  const session = await getServerSession();
  
  if (!session) {
    return { 
      authorized: false, 
      session: null, 
      error: 'No autenticado' 
    };
  }

  const userRole = session.user?.rol as Role;
  const permissions = rolePermissions[userRole] || [];

  if (!permissions.includes(requiredPermission)) {
    return { 
      authorized: false, 
      session, 
      error: 'No tienes permisos para esta acción' 
    };
  }

  return { authorized: true, session };
}

// Wrapper para rutas API
export function withPermission(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>,
  requiredPermission: Permission
) {
  return async (req: NextRequest, context: any) => {
    const { authorized, error } = await checkPermission(req, requiredPermission);

    if (!authorized) {
      return NextResponse.json(
        { error: error || 'No autorizado' },
        { status: error === 'No autenticado' ? 401 : 403 }
      );
    }

    return handler(req, context);
  };
}