import { createClient } from '@supabase/supabase-js';

// Variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

// Cliente para uso en el CLIENTE (browser)
// Usa la Anon Key - tiene permisos limitados por RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// Cliente para uso en el SERVIDOR

export function createServerSupabaseClient() {
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY no está configurada');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// TIPOS Y UTILIDADES
// Tipo para el usuario autenticado con datos adicionales
export type UsuarioCompleto = {
  id: number;
  auth_id: string;
  email: string;
  nombre_completo: string;
  telefono: string | null;
  rol: 'administrador' | 'cortador' | 'diseñador' | 'recepcionista' | 'ayudante' | 'representante_taller';
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  ultimo_acceso: string | null;
  created_by: number | null;
  created_at: string;
  updated_at: string | null;
};

// FUNCIONES AUXILIARES

// Obtener el usuario actual autenticado
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  return user;
}

//Obtener datos completos del usuario (auth + tabla usuarios)

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

//Verificar si el usuario tiene un rol específico

export async function hasRole(requiredRole: UsuarioCompleto['rol']): Promise<boolean> {
  const usuario = await getUsuarioCompleto();
  return usuario?.rol === requiredRole;
}

//Verificar si el usuario tiene alguno de los roles especificados

export async function hasAnyRole(requiredRoles: UsuarioCompleto['rol'][]): Promise<boolean> {
  const usuario = await getUsuarioCompleto();
  return usuario ? requiredRoles.includes(usuario.rol) : false;
}

// Cerrar sesión

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
}

//Actualizar último acceso del usuario

export async function updateLastAccess(userId: number) {
  const { error } = await supabase
    .from('usuarios')
    .update({ ultimo_acceso: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error actualizando último acceso:', error);
  }
}

// FUNCIONES PARA ADMINISTRADORES (server-only)


// Crear un nuevo usuario (solo para administradores)
// IMPORTANTE: Esta función debe usarse SOLO en server-side (API routes)

export async function createUsuarioAdmin(params: {
  email: string;
  password: string;
  nombre_completo: string;
  telefono?: string;
  rol: UsuarioCompleto['rol'];
  created_by: number;
}) {
  const client = createServerSupabaseClient();

  try {
    // 1. Crear usuario en Supabase Auth
    const { data: authUser, error: authError } = await client.auth.admin.createUser({
      email: params.email,
      password: params.password,
      email_confirm: true,
      user_metadata: {
        nombre_completo: params.nombre_completo,
        rol: params.rol,
      },
    });

    if (authError) {
      throw new Error(`Error creando usuario en Auth: ${authError.message}`);
    }

    if (!authUser.user) {
      throw new Error('No se pudo crear el usuario');
    }

    // 2. Crear registro en tabla usuarios
    const { data: usuario, error: dbError } = await client
      .from('usuarios')
      .insert({
        auth_id: authUser.user.id,
        email: params.email,
        nombre_completo: params.nombre_completo,
        telefono: params.telefono || null,
        rol: params.rol,
        estado: 'ACTIVO',
        created_by: params.created_by,
      })
      .select()
      .single();

    if (dbError) {
      // Rollback: eliminar usuario de auth si falla la inserción en BD
      await client.auth.admin.deleteUser(authUser.user.id);
      throw new Error(`Error creando usuario en BD: ${dbError.message}`);
    }

    return { success: true, usuario, authUser };
  } catch (error) {
    console.error('Error en createUsuarioAdmin:', error);
    throw error;
  }
}

// Generar contraseña aleatoria

export function generateRandomPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // Asegurar al menos un carácter de cada tipo
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
  
  // Completar el resto
  for (let i = password.length; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Mezclar caracteres
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Enviar email de recuperación de contraseña

export async function sendPasswordResetEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) {
    throw new Error(`Error enviando email: ${error.message}`);
  }

  return { success: true };
}