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

    // 1. Inicializar la respuesta
    // Esto es crucial para poder modificar las cookies y pasarlas al Supabase Client
    let supabaseResponse = NextResponse.next({
        request,
    });
    
    // Rutas públicas que no requieren autenticación
    const publicPaths = ['/login', '/acceso-denegado', '/auth/signout'];
    if (publicPaths.includes(pathname) || pathname.startsWith('/.well-known')) {
        return NextResponse.next();
    }

    // 2. Inicializar el cliente Supabase con manejo de cookies
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    // Set cookies en la solicitud para que el cliente Supabase lo use
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

                    // Clonamos la respuesta original y establecemos las cookies
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        supabaseResponse.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // 3. Obtener el usuario (la sesión se refresca si es necesario)
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    // --- LÓGICA DE AUTENTICACIÓN Y AUTORIZACIÓN (Se mantiene lo funcional) ---

    // Si hay error de autenticación, redirigir a login
    if (authError) {
        if (pathname.startsWith('/Panel-Administrativo')) {
            const url = new URL('/login', request.url);
            url.searchParams.set('error', 'sesion_invalida');
            return NextResponse.redirect(url);
        }
        // Si no es una ruta protegida, dejamos pasar (ej: la ruta raíz para que la maneje page.tsx)
    }

    // Si no hay usuario y la ruta es protegida
    if (!user && pathname.startsWith('/Panel-Administrativo')) {
        const url = new URL('/login', request.url);
        url.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(url);
    }

    // Si hay usuario intentando acceder al login
    if (user && pathname === '/login') {
        // Redirección Forzada
        return NextResponse.redirect(new URL('/Panel-Administrativo/dashboard', request.url));
    }

    // Lógica de validación de usuario y permisos (se mantiene)
    if (user && pathname.startsWith('/Panel-Administrativo')) {
        try {
            const { data: usuario, error } = await supabase
                .from('usuarios')
                .select('rol, estado')
                .eq('auth_id', user.id)
                .maybeSingle();

            if (error || !usuario || usuario.estado?.toLowerCase() !== 'activo') {
                // Forzamos cierre de sesión y redirigimos a login
                await supabase.auth.signOut();
                const url = new URL('/login', request.url);
                url.searchParams.set('error', 'acceso_denegado');
                return NextResponse.redirect(url);
            }

            // Validar permisos de rol
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
                    return NextResponse.redirect(new URL('/acceso-denegado', request.url));
                }
            }

            // Adjuntar el rol al header de la respuesta final
            supabaseResponse.headers.set('x-user-role', usuario.rol);
            
        } catch (error) {
            const url = new URL('/login', request.url);
            url.searchParams.set('error', 'error_sistema');
            return NextResponse.redirect(url);
        }
    }

    // Retorna la respuesta final con las cookies actualizadas
    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
    ],
};