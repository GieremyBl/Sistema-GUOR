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
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
   req: request,
   secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;

 // 1. Verificar autenticación
   if (!token) {
   const url = new URL('/login', request.url); 
   url.searchParams.set('callbackUrl', pathname);
   return NextResponse.redirect(url);
  }

  const userRole = token.rol as Role;

  for (const [route, permission] of Object.entries(routePermissions)) {
    // Usamos startsWith para rutas anidadas
   if (pathname.startsWith(route)) { 
  const userPermissions = rolePermissions[userRole] || [];
   
    if (!userPermissions.includes(permission)) {
      return NextResponse.redirect(new URL('/acceso-denegado', request.url));
      }

      break; 
  }
}

  return NextResponse.next();
}

export const config = {
 matcher: [
  
  '/app/(dashboard)/:path*',
]
};