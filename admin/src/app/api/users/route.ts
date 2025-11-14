import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Inicializa el cliente de Supabase con la Service Role Key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

// Cliente normal para verificar al usuario que hace la petición
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Función auxiliar para generar contraseña aleatoria
function generateRandomPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // Asegurar al menos un carácter de cada tipo
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
  
  for (let i = password.length; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// ==========================================
// POST - Crear nuevo usuario
// ==========================================
export async function POST(request: Request) {
  try {
    // --- PASO 0: Verificar autenticación ---
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener datos del usuario que hace la petición
    const { data: currentUser } = await supabaseAdmin
      .from('usuarios')
      .select('id, rol')
      .eq('auth_id', user.id)
      .single();

    // Verificar que sea administrador
    if (!currentUser || currentUser.rol !== 'administrador') {
      return NextResponse.json({ error: 'No tienes permisos para crear usuarios' }, { status: 403 });
    }

    // --- PASO 1: Obtener y validar datos del body ---
    const body = await request.json();
    const { email, nombre_completo, telefono, rol, password } = body;

    // Validaciones básicas
    if (!email || !nombre_completo || !rol) {
      return NextResponse.json(
        { error: 'Campos requeridos: email, nombre_completo, rol' },
        { status: 400 }
      );
    }

    // Validar que el rol sea válido
    const rolesValidos = ['administrador', 'cortador', 'diseñador', 'recepcionista', 'ayudante', 'representante_taller'];
    if (!rolesValidos.includes(rol)) {
      return NextResponse.json(
        { error: `Rol inválido. Roles válidos: ${rolesValidos.join(', ')}` },
        { status: 400 }
      );
    }

    // --- PASO 2: Verificar que el email no exista ---
    const { data: existingUser } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // --- PASO 3: Generar contraseña (temporal o proporcionada) ---
    const finalPassword = password || generateRandomPassword();

    // --- PASO 4: Crear usuario en Supabase Authentication ---
    const { data: authData, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: finalPassword,
      email_confirm: true, // Usuario confirmado automáticamente
      user_metadata: {
        nombre_completo: nombre_completo,
        rol: rol,
      },
    });

    if (createAuthError || !authData.user) {
      console.error("Error al crear usuario en Auth:", createAuthError);
      return NextResponse.json(
        { error: `Error al crear usuario: ${createAuthError?.message}` },
        { status: 500 }
      );
    }

    const newUserId = authData.user.id;

    // --- PASO 5: Crear perfil en tabla 'usuarios' ---
    // IMPORTANTE: Usamos auth_id para enlazar con auth.users
    const { data: newUser, error: profileError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        auth_id: newUserId, // Enlace con auth.users
        email: email,
        nombre_completo: nombre_completo,
        telefono: telefono || null,
        rol: rol,
        estado: 'ACTIVO', // Estado activo por defecto
        created_by: currentUser.id, // Quién lo creó
      })
      .select()
      .single();

    if (profileError) {
      console.error("Error al crear perfil de usuario:", profileError);
      // Rollback: Eliminar usuario de Auth si falla
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return NextResponse.json(
        { error: `Error al crear perfil: ${profileError.message}` },
        { status: 500 }
      );
    }

    // --- PASO 6: Enviar email con link para establecer contraseña ---
    // (Opcional) Si quieres que el usuario establezca su propia contraseña
    try {
      await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email,
      });
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      // No fallar si el email falla, solo logear
    }

    // --- PASO 7: Retornar respuesta exitosa ---
    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser.id,
        auth_id: newUser.auth_id,
        email: newUser.email,
        nombre_completo: newUser.nombre_completo,
        rol: newUser.rol,
        estado: newUser.estado,
      },
      // SOLO EN DESARROLLO: Mostrar contraseña temporal
      // En producción, eliminar esto y solo enviar por email
      tempPassword: process.env.NODE_ENV === 'development' ? finalPassword : undefined,
    });

  } catch (error) {
    console.error('Error en POST /api/auth/users:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// ==========================================
// GET - Listar usuarios (solo administradores)
// ==========================================
export async function GET(request: Request) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data: currentUser } = await supabaseAdmin
      .from('usuarios')
      .select('rol')
      .eq('auth_id', user.id)
      .single();

    // Verificar que sea administrador
    if (!currentUser || currentUser.rol !== 'administrador') {
      return NextResponse.json({ error: 'No tienes permisos' }, { status: 403 });
    }

    // Obtener todos los usuarios
    const { data: usuarios, error } = await supabaseAdmin
      .from('usuarios')
      .select(`
        id,
        email,
        nombre_completo,
        telefono,
        rol,
        estado,
        ultimo_acceso,
        created_at,
        created_by
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      usuarios: usuarios || [],
      total: usuarios?.length || 0,
    });

  } catch (error) {
    console.error('Error en GET /api/auth/users:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// ==========================================
// PATCH - Actualizar usuario
// ==========================================
export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data: currentUser } = await supabaseAdmin
      .from('usuarios')
      .select('rol')
      .eq('auth_id', user.id)
      .single();

    if (!currentUser || currentUser.rol !== 'administrador') {
      return NextResponse.json({ error: 'No tienes permisos' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, nombre_completo, telefono, rol, estado } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId es requerido' }, { status: 400 });
    }

    // Construir objeto de actualización solo con campos proporcionados
    const updates: any = { updated_at: new Date().toISOString() };
    if (nombre_completo !== undefined) updates.nombre_completo = nombre_completo;
    if (telefono !== undefined) updates.telefono = telefono;
    if (rol !== undefined) updates.rol = rol;
    if (estado !== undefined) updates.estado = estado;

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('usuarios')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Error en PATCH /api/auth/users:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// ==========================================
// DELETE - Eliminar usuario
// ==========================================
export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data: currentUser } = await supabaseAdmin
      .from('usuarios')
      .select('rol')
      .eq('auth_id', user.id)
      .single();

    if (!currentUser || currentUser.rol !== 'administrador') {
      return NextResponse.json({ error: 'No tienes permisos' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId es requerido' }, { status: 400 });
    }

    // Obtener auth_id del usuario a eliminar
    const { data: userToDelete } = await supabaseAdmin
      .from('usuarios')
      .select('auth_id')
      .eq('id', userId)
      .single();

    if (!userToDelete) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // 1. Eliminar de la tabla usuarios
    const { error: deleteError } = await supabaseAdmin
      .from('usuarios')
      .delete()
      .eq('id', userId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // 2. Eliminar de Auth
    await supabaseAdmin.auth.admin.deleteUser(userToDelete.auth_id);

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    });

  } catch (error) {
    console.error('Error en DELETE /api/auth/users:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}