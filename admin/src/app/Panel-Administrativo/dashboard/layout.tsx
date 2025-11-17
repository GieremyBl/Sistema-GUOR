import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Solo obtener datos, NO validar (el middleware ya lo hizo)
  const { data: { session } } = await supabase.auth.getSession();
  
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('*')
    .eq('auth_id', session!.user.id)
    .single();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar usuario={usuario!} />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}