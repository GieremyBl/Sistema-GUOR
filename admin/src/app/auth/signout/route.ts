import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = await createClient();
  
  // Cerrar sesión en Supabase
  await supabase.auth.signOut();
  
  // Limpiar todas las cookies de Supabase
  const allCookies = cookieStore.getAll();
  allCookies.forEach(cookie => {
    if (cookie.name.startsWith('sb-')) {
      cookieStore.delete(cookie.name);
    }
  });
  
  // Redirigir al login
  return NextResponse.redirect(new URL('/login', request.url));
}