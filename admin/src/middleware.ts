import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const routePermissions: Record<string, string[]> = {
  '/Panel-Administrativo/dashboard': ['administrador', 'recepcionista', 'diseñador', 'cortador', 'ayudante', 'representante_taller'],
  '/Panel-Administrativo/usuarios': ['administrador'],
  '/Panel-Administrativo/clientes': ['administrador', 'recepcionista'],
  '/Panel-Administrativo/pedidos': ['administrador', 'recepcionista', 'diseñador', 'cortador'],
  '/Panel-Administrativo/productos': ['administrador', 'diseñador'],
  '/Panel-Administrativo/inventario': ['administrador', 'diseñador'],
  '/Panel-Administrativo/corte': ['administrador', 'cortador'],
  '/Panel-Administrativo/confecciones': ['administrador', 'representante_taller'],
  '/Panel-Administrativo/cotizaciones': ['administrador', 'recepcionista'],
  '/Panel-Administrativo/reportes': ['administrador'],
  '/Panel-Administrativo/configuracion': ['administrador'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas públicas
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

  // Usar getUser() en lugar de getSession() (más seguro)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Log para debugging (quitar en producción)
  console.log('[MIDDLEWARE]', {
    pathname,
    hasUser: !!user,
    authError: authError?.message
  });

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
  if (user && pathname.startsWith('/Panel-Administrativo')) {
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
        
        // Cerrar sesión si el usuario no existe en la BD
        await supabase.auth.signOut();
        
        return NextResponse.redirect(url);
      }

      // Validar estado activo
      if (usuario.estado?.toLowerCase() !== 'activo') {
        console.log('[MIDDLEWARE] Usuario inactivo');
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('error', 'cuenta_inactiva');
        
        await supabase.auth.signOut();
        
        return NextResponse.redirect(url);
      }

      // Validar permisos de rol (solo si no es el dashboard principal)
      if (pathname !== '/Panel-Administrativo/dashboard') {
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

        // Log para debugging
        console.log('[MIDDLEWARE] Permisos:', {
          pathname,
          matchedRoute,
          userRole,
          allowedRoles
        });

        // Si la ruta requiere permisos y el usuario no los tiene
        if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
          console.log('[MIDDLEWARE] Acceso denegado para rol:', userRole);
          const url = request.nextUrl.clone();
          url.pathname = '/acceso-denegado';
          return NextResponse.redirect(url);
        }
      }

      // Agregar el rol a los headers para usarlo en los componentes
      supabaseResponse.headers.set('x-user-role', usuario.rol);
      
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