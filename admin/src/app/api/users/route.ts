import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Inicializa el cliente de Supabase con la LLAVE DE SERVICIO (ROLE_KEY)
// Es importante que sea la de servicio para tener permisos de admin
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { email, password, nombre, apellido, rol } = await request.json();

  // --- PASO 1: Crear el usuario en Supabase Authentication ---
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Marcarlo como confirmado inmediatamente
  });

  if (authError) {
    console.error("Error al crear usuario en Auth:", authError.message);
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const newUserId = authData.user.id;

  // --- PASO 2: Crear el perfil del usuario en la tabla 'usuarios' ---
  // Usamos el ID del PASO 1 para enlazar los dos.
  const { error: profileError } = await supabase
    .from('usuarios')
    .insert({
      id: newUserId, // ¡IMPORTANTE! Usar el ID de Auth
      email: email,
      nombre: nombre,
      apellido: apellido,
      rol: rol,
      estado: true // Ponerlo como activo por defecto
    });

  if (profileError) {
    console.error("Error al crear perfil de usuario:", profileError.message);
    // Opcional: Si esto falla, deberías borrar el usuario de Auth para no dejarlo huérfano
    await supabase.auth.admin.deleteUser(newUserId);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Usuario creado exitosamente', userId: newUserId });
}