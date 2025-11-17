import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

// Cliente para el browser
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Tipos
export type UsuarioCompleto = {
  id: number;
  auth_id: string;
  email: string;
  nombre_completo: string;
  telefono: string | null;
  rol: 'administrador' | 'cortador' | 'diseñador' | 'recepcionista' | 'ayudante' | 'representante_taller';
  estado: 'activo' | 'inactivo' | 'suspendido';
  ultimo_acceso: string | null;
  created_by: number | null;
  created_at: string;
  updated_at: string | null;
};

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  return user;
}

export async function getUsuarioCompleto(): Promise<UsuarioCompleto | null> {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  if (error || !usuario) {
    console.error('Error obteniendo datos del usuario:', error);
    return null;
  }

  return usuario as UsuarioCompleto;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
}