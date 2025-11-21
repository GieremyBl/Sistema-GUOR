import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  // 1. Usamos createServerClient para leer las cookies del navegador
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // El layout no necesita setear cookies, solo leerlas
      },
    }
  );

  // 2. Verificamos la sesión (ahora SÍ funcionará porque lee la cookie)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Si no hay usuario, redirigir
  if (!user || authError) {
    // Opcional: Si la Page ya valida, esto es redundante pero seguro
    redirect('/login');
  }

  // 3. Obtener datos del perfil para el Sidebar
  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  if (!usuario || usuarioError) {
    redirect('/login');
  }

  if (usuario.estado?.toLowerCase() !== 'activo') {
    redirect('/login?error=cuenta_inactiva');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Pasamos el usuario verificado al Sidebar */}
      <Sidebar usuario={usuario} />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}