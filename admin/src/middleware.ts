// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const isPublicRoute = 
    pathname === "/login" || 
    pathname === "/register" ||
    pathname.startsWith("/api/auth/register");

  const isApiRoute = pathname.startsWith("/api");
  const isPublicFile = pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js)$/);

  // Si es una ruta API (excepto register) o archivo público, permitir acceso
  if ((isApiRoute && pathname !== "/api/auth/register") || isPublicFile) {
    return NextResponse.next();
  }

  // Si no hay token y no está en ruta pública, redirigir a login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay token y está en login o register, redirigir a home
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protección de rutas por rol
  if (token) {
    const userRole = token.rol as string;

    // Rutas exclusivas para administrador
    if (pathname.startsWith("/admin") && userRole !== "administrador") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Rutas para recepcionista y admin
    if (pathname.startsWith("/clientes") && 
        !["administrador", "recepcionista"].includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Rutas para cortador
    if (pathname.startsWith("/inventario") && 
        !["administrador", "recepcionista", "cortador"].includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Rutas para diseñador
    if (pathname.startsWith("/confecciones") && 
        !["administrador", "diseñador"].includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Rutas para ayudante
    if (pathname.startsWith("/despachos") && 
        !["administrador", "recepcionista", "ayudante"].includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Rutas para representante de taller
    if (pathname.startsWith("/talleres") && 
        !["administrador", "representante_taller"].includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};