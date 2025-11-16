import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import DashboardAdmin from '@/components/dashboards/DashboardAdmin';
import DashboardRecepcionista from '@/components/dashboards/DashboardRecepcionista';
import DashboardDiseñador from '@/components/dashboards/DashboardDiseñador';
import DashboardCortador from '@/components/dashboards/DashboardCortador';
import DashboardAyudante from '@/components/dashboards/DashboardAyudante';
import DashboardRepresentante from '@/components/dashboards/DashboardRepresentante';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('*')
    .eq('auth_id', session.user.id)
    .single();

  if (!usuario || usuario.estado !== 'ACTIVO') {
    redirect('/login');
  }

  // Renderizar dashboard según el rol
  switch (usuario.rol) {
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