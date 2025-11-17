import { createClient } from '@/lib/supabase/server';
import DashboardAdmin from '@/components/dashboards/DashboardAdmin';
import DashboardRecepcionista from '@/components/dashboards/DashboardRecepcionista';
import DashboardDiseñador from '@/components/dashboards/DashboardDiseñador';
import DashboardCortador from '@/components/dashboards/DashboardCortador';
import DashboardAyudante from '@/components/dashboards/DashboardAyudante';
import DashboardRepresentante from '@/components/dashboards/DashboardRepresentante';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Obtener la sesión (ya validada por el layout)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Obtener el usuario (ya validado por el layout, pero necesitamos sus datos completos)
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('*')
    .eq('auth_id', session!.user.id)
    .single();

  // Renderizar dashboard según el rol
  switch (usuario!.rol) {
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
      return <div>Rol no reconocido</div>;
  }
}