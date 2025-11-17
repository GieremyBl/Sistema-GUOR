import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const routePermissions: Record<string, string[]> = {
  '/Panel-Administrativo/dashboard': ['administrador', 'recepcionista', 'diseñador', 'cortador', 'ayudante', 'representante_taller'],
  '/Panel-Administrativo/dashboard/usuarios': ['administrador'],
  '/Panel-Administrativo/dashboard/clientes': ['administrador', 'recepcionista'],
  '/Panel-Administrativo/dashboard/pedidos': ['administrador', 'recepcionista', 'diseñador', 'cortador'],
  '/Panel-Administrativo/dashboard/productos': ['administrador', 'diseñador'],
  '/Panel-Administrativo/dashboard/inventario': ['administrador', 'diseñador'],
  '/Panel-Administrativo/dashboard/corte': ['administrador', 'cortador'],
  '/Panel-Administrativo/dashboard/confecciones': ['administrador', 'representante_taller'],
  '/Panel-Administrativo/dashboard/cotizaciones': ['administrador', 'recepcionista'],
  '/Panel-Administrativo/dashboard/reportes': ['administrador'],
  '/Panel-Administrativo/dashboard/configuracion': ['administrador'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas que no requieren procesamiento
  const publicPaths = ['/login', '/acceso-denegado', '/auth/signout'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ruta raíz
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = user ? '/Panel-Administrativo/dashboard' : '/login';
    return NextResponse.redirect(url);
  }

  // Si no hay usuario y la ruta es protegida
  if (!user && pathname.startsWith('/Panel-Administrativo')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Si hay usuario intentando acceder al login
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/Panel-Administrativo/dashboard';
    return NextResponse.redirect(url);
  }

  // Verificar permisos en rutas protegidas
  if (user && pathname.startsWith('/Panel-Administrativo/dashboard')) {
    try {
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('rol, estado')
        .eq('auth_id', user.id)
        .single();

      // Si hay error o no existe el usuario
      if (error || !usuario) {
        console.error('[MIDDLEWARE] Usuario no encontrado:', error);
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('error', 'usuario_no_encontrado');
        return NextResponse.redirect(url);
      }

      // Validar estado activo
      if (usuario.estado?.toLowerCase() !== 'activo') {
        console.log('[MIDDLEWARE] Usuario inactivo');
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('error', 'cuenta_inactiva');
        return NextResponse.redirect(url);
      }

      // Validar permisos de rol
      const userRole = usuario.rol?.toLowerCase();
      let allowedRoles: string[] | undefined;
      let matchedRoute = '';

      // Buscar la ruta más específica que coincida
      for (const route in routePermissions) {
        if (pathname === route || pathname.startsWith(route + '/')) {
          if (route.length > matchedRoute.length) {
            matchedRoute = route;
            allowedRoles = routePermissions[route];
          }
        }
      }

      // Si la ruta requiere permisos y el usuario no los tiene
      if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        console.log('[MIDDLEWARE] Acceso denegado para rol:', userRole);
        const url = request.nextUrl.clone();
        url.pathname = '/acceso-denegado';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('[MIDDLEWARE] Error en validación:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
};