import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardAdmin from '@/components/dashboards/DashboardAdmin';
import DashboardRecepcionista from '@/components/dashboards/DashboardRecepcionista';
import DashboardDiseñador from '@/components/dashboards/DashboardDiseñador';
import DashboardCortador from '@/components/dashboards/DashboardCortador';
import DashboardAyudante from '@/components/dashboards/DashboardAyudante';
import DashboardRepresentante from '@/components/dashboards/DashboardRepresentante';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Si no hay usuario autenticado, redirigir al login
  if (!user || authError) {
    redirect('/login');
  }

  // Obtener el usuario completo con sus datos desde la tabla usuarios
  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  // Si no existe el usuario en la BD
  if (!usuario || usuarioError) {
    console.error('[DASHBOARD] Error al obtener usuario:', usuarioError);
    redirect('/login?error=usuario_no_encontrado');
  }

  // Validar que el usuario esté activo
  if (usuario.estado?.toLowerCase() !== 'activo') {
    redirect('/login?error=cuenta_inactiva');
  }

  // Normalizar el rol a minúsculas para comparación
  const rol = usuario.rol?.toLowerCase();

  // Renderizar dashboard según el rol del usuario
  switch (rol) {
    case 'administrador':
      return <DashboardAdmin usuario={usuario} />;
    
    case 'recepcionista':
      return <DashboardRecepcionista usuario={usuario} />;
    
    case 'diseñador':
      return <DashboardDiseñador usuario={usuario} />;
    
    case 'cortador':
      return <DashboardCortador usuario={usuario} />;
    
    case 'ayudante':
      return <DashboardAyudante usuario={usuario} />;
    
    case 'representante_taller':
      return <DashboardRepresentante usuario={usuario} />;
    
    default:
      console.error('[DASHBOARD] Rol no reconocido:', usuario.rol);
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Rol no reconocido
            </h1>
            <p className="text-gray-600">
              El rol "{usuario.rol}" no tiene un dashboard asignado.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Contacta al administrador del sistema.
            </p>
          </div>
        </div>
      );
  }
}