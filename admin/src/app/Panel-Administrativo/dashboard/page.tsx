import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardAdmin from '@/dashboards/DashboardAdmin';
import DashboardRecepcionista from '@/dashboards/DashboardRecepcionista';
import DashboardDiseñador from '@/dashboards/DashboardDiseñador';
import DashboardCortador from '@/dashboards/DashboardCortador';
import DashboardAyudante from '@/dashboards/DashboardAyudante';
import DashboardRepresentante from '@/dashboards/DashboardRepresentante';

export default async function DashboardPage() {
  const cookieStore = await cookies();

  // Usar el cliente SSR que SÍ tiene acceso a las cookies de sesión
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll puede fallar en algunos casos, pero getAll siempre funciona
          }
        },
      },
    }
  );

  console.log('[DASHBOARD SERVER] Verificando autenticación...');

  // Obtener el usuario autenticado
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log('[DASHBOARD SERVER]', {
    userFound: !!user,
    userId: user?.id,
    authError: authError?.message,
  });

  // Si no hay usuario autenticado, redirigir al login
  if (!user || authError) {
    console.error('[DASHBOARD SERVER] No autenticado, redirigiendo a login');
    redirect('/login');
  }

  // Obtener el usuario completo con sus datos desde la tabla usuarios
  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  console.log('[DASHBOARD SERVER]', {
    usuarioEncontrado: !!usuario,
    rol: usuario?.rol,
    estado: usuario?.estado,
    usuarioError: usuarioError?.message,
  });

  // Si no existe el usuario en la BD
  if (!usuario || usuarioError) {
    console.error('[DASHBOARD SERVER] Error al obtener usuario:', usuarioError);
    redirect('/login?error=usuario_no_encontrado');
  }

  // Validar que el usuario esté activo
  if (usuario.estado?.toLowerCase() !== 'activo') {
    console.error('[DASHBOARD SERVER] Usuario inactivo');
    redirect('/login?error=cuenta_inactiva');
  }

  console.log('[DASHBOARD SERVER] ✅ Usuario autenticado y activo, renderizando dashboard...');

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
      console.error('[DASHBOARD SERVER] Rol no reconocido:', usuario.rol);
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