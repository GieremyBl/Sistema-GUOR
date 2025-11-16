import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Definir permisos por ruta
const routePermissions: Record<string, string[]> = {
  '/dashboard': ['administrador', 'recepcionista', 'diseñador', 'cortador', 'ayudante', 'representante_taller'],
  '/dashboard/usuarios': ['administrador'],
  '/dashboard/clientes': ['administrador', 'recepcionista'],
  '/dashboard/pedidos': ['administrador', 'recepcionista', 'diseñador', 'cortador'],
  '/dashboard/productos': ['administrador', 'diseñador'],
  '/dashboard/inventario': ['administrador', 'diseñador'],
  '/dashboard/corte': ['administrador', 'cortador'],
  '/dashboard/confecciones': ['administrador', 'representante_taller'],
  '/dashboard/cotizaciones': ['administrador', 'recepcionista'],
  '/dashboard/reportes': ['administrador'],
  '/dashboard/configuracion': ['administrador'],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Obtener sesión actual
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { pathname } = req.nextUrl;

    // Rutas públicas que no requieren autenticación
    const publicRoutes = ['/login', '/', '/acceso-denegado'];
    const isPublicRoute = publicRoutes.some(route => pathname === route);

    // 1. Si no hay sesión y la ruta NO es pública → redirigir a login
    if (!session && !isPublicRoute) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // 2. Si hay sesión y está en login → redirigir a dashboard
    if (session && pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // 3. Verificar permisos por rol si hay sesión
    if (session && pathname.startsWith('/dashboard')) {
      // Obtener datos del usuario desde la tabla usuarios
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('rol, estado')
        .eq('auth_id', session.user.id)
        .single();

      if (error || !usuario) {
        console.error('Error obteniendo usuario:', error);
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL('/login', req.url));
      }

      // Verificar que el usuario esté activo
      if (usuario.estado !== 'ACTIVO') {
        await supabase.auth.signOut();
        const redirectUrl = new URL('/login', req.url);
        redirectUrl.searchParams.set('error', 'cuenta_inactiva');
        return NextResponse.redirect(redirectUrl);
      }

      // Verificar permisos de ruta
      const userRole = usuario.rol;

      // Buscar la ruta más específica que coincida
      let allowedRoles: string[] | undefined;
      let matchedRoute = '';

      for (const route in routePermissions) {
        if (pathname === route || pathname.startsWith(route + '/')) {
          if (route.length > matchedRoute.length) {
            matchedRoute = route;
            allowedRoles = routePermissions[route];
          }
        }
      }

      // Si encontramos una ruta con permisos definidos, verificar
      if (allowedRoles && !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/acceso-denegado', req.url));
      }
    }

    return res;
  } catch (error) {
    console.error('Error en middleware:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
};