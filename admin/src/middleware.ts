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
  
  // Ignorar rutas de Chrome DevTools y similares
  if (pathname.startsWith('/.well-known')) {
    return new NextResponse(null, { status: 404 });
  }
  
  // Rutas públicas que no requieren autenticación
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
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Usar getUser() para verificación segura
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log('[MIDDLEWARE] Estado inicial:', {
    pathname,
    hasUser: !!user,
    userId: user?.id,
    authError: authError?.message
  });

  // Si hay error de autenticación, redirigir a login
  if (authError) {
    console.error('[MIDDLEWARE] ❌ Error de autenticación:', authError.message);
    
    if (pathname.startsWith('/Panel-Administrativo')) {
      const url = new URL('/login', request.url);
      url.searchParams.set('error', 'sesion_invalida');
      return NextResponse.redirect(url);
    }
    
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Ruta raíz
  if (pathname === '/') {
    if (!user) {
      console.log('[MIDDLEWARE] 🔄 Ruta raíz sin usuario -> login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log('[MIDDLEWARE] 🔄 Ruta raíz con usuario -> dashboard');
    return NextResponse.redirect(new URL('/Panel-Administrativo/dashboard', request.url));
  }

  // Si no hay usuario y la ruta es protegida
  if (!user && pathname.startsWith('/Panel-Administrativo')) {
    console.log('[MIDDLEWARE] 🔄 Ruta protegida sin usuario -> login');
    const url = new URL('/login', request.url);
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Si hay usuario intentando acceder al login
  if (user && pathname === '/login') {
    console.log('[MIDDLEWARE] 🔄 Usuario autenticado en /login -> dashboard');
    // NO redirigir aquí, simplemente permitir que continúe
    // El cliente manejará el redirect
    return NextResponse.next();
  }

  // Verificar permisos en rutas protegidas
  if (user && pathname.startsWith('/Panel-Administrativo')) {
    console.log('[MIDDLEWARE] 🔍 Verificando permisos para usuario:', user.id);
    
    try {
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('rol, estado')
        .eq('auth_id', user.id)
        .maybeSingle();

      console.log('[MIDDLEWARE] 📊 Resultado consulta usuario:', {
        encontrado: !!usuario,
        rol: usuario?.rol,
        estado: usuario?.estado,
        error: error?.message
      });

      // Si hay error en la consulta
      if (error) {
        console.error('[MIDDLEWARE] ❌ Error al consultar usuario:', error.message);
        const url = new URL('/login', request.url);
        url.searchParams.set('error', 'error_sistema');
        return NextResponse.redirect(url);
      }

      // Si no existe el usuario en la base de datos
      if (!usuario) {
        console.error('[MIDDLEWARE] ❌ Usuario autenticado pero NO existe en BD');
        await supabase.auth.signOut();
        
        const url = new URL('/login', request.url);
        url.searchParams.set('error', 'usuario_no_encontrado');
        return NextResponse.redirect(url);
      }

      // Validar estado activo
      if (usuario.estado?.toLowerCase() !== 'activo') {
        console.error('[MIDDLEWARE] ❌ Usuario con estado:', usuario.estado);
        await supabase.auth.signOut();
        
        const url = new URL('/login', request.url);
        url.searchParams.set('error', 'cuenta_inactiva');
        return NextResponse.redirect(url);
      }

      console.log('[MIDDLEWARE] ✅ Usuario válido y activo');

      // Validar permisos de rol (solo si no es el dashboard principal)
      if (pathname !== '/Panel-Administrativo/dashboard') {
        const userRole = usuario.rol?.toLowerCase();
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

        if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
          console.log('[MIDDLEWARE] ❌ Acceso denegado - Rol:', userRole, 'Ruta:', pathname);
          return NextResponse.redirect(new URL('/acceso-denegado', request.url));
        }
      }

      supabaseResponse.headers.set('x-user-role', usuario.rol);
      console.log('[MIDDLEWARE] ✅ Permitiendo acceso a:', pathname);
      
    } catch (error) {
      console.error('[MIDDLEWARE] 💥 Error inesperado:', error);
      const url = new URL('/login', request.url);
      url.searchParams.set('error', 'error_sistema');
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