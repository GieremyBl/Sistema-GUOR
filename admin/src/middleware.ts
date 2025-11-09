import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Role, Permission } from '@/app/types';
import { rolePermissions } from '@/app/config/permission';

const routePermissions: Record<string, Permission> = {
  '/app/(dashboard)': Permission.VIEW_DASHBOARD,
  '/app/(dashboard)/users': Permission.VIEW_USUARIOS,
  '/app/(dashboard)/products': Permission.VIEW_PRODUCTOS,
  '/app/(dashboard)/orders': Permission.VIEW_ORDENES,
  '/app/(dashboard)/prices': Permission.VIEW_COTIZACIONES,
  // Agrega más rutas según tu estructura
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const { pathname } = request.nextUrl;

  // Rutas públicas
  if (pathname.startsWith('/api/auth') || pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  // Verificar autenticación
  if (!token) {
    const url = new URL('/api/auth/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  const userRole = token.rol as Role;
  
  // Verificar permisos para rutas protegidas
  for (const [route, permission] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route)) {
      const userPermissions = rolePermissions[userRole] || [];
      
      if (!userPermissions.includes(permission)) {
        return NextResponse.redirect(new URL('/acceso-denegado', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/app/(dashboard)/:path*',
    '/api/:path*'
  ]
};  