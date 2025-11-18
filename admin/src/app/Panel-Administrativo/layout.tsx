import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/Sidebar';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // Si no hay usuario o hay error, redirigir al login
  if (!user || authError) {
    redirect('/login');
  }

  // Obtener datos completos del usuario desde la tabla usuarios
  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  // Si no existe el usuario en la BD o hay error
  if (!usuario || usuarioError) {
    console.error('[LAYOUT] Error al obtener usuario:', usuarioError);
    redirect('/login');
  }

  // Validar que el usuario esté activo
  if (usuario.estado?.toLowerCase() !== 'activo') {
    redirect('/login?error=cuenta_inactiva');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar usuario={usuario} />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}