// back-end/src/controllers/usuarios.controller.ts
import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase con SERVICE_KEY para operaciones admin
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Función helper para obtener el cliente Supabase del usuario autenticado
const getSupabaseClient = (token?: string) => {
  if (token) {
    return createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );
  }
  return supabaseAdmin;
};

/**
 * Middleware para verificar token (opcional, puedes agregarlo a tus rutas)
 */
export const verifyToken = async (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Agregar usuario al request
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Error verificando token' });
  }
};

/**
 * GET /api/usuarios
 * Listar usuarios con filtros y paginación
 */
export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const { busqueda, rol, estado, page = '1', limit = '10' } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    // Construir query
    let query = supabaseAdmin
      .from('usuarios')
      .select('id, email, nombre_completo, telefono, rol, estado, created_at, updated_at, created_by', { count: 'exact' });

    // Aplicar filtros
    if (busqueda) {
      query = query.or(
        `nombre_completo.ilike.%${busqueda}%,email.ilike.%${busqueda}%,telefono.ilike.%${busqueda}%`
      );
    }
    if (rol) query = query.eq('rol', rol);
    if (estado) query = query.eq('estado', estado);

    // Paginación
    query = query
      .range(offset, offset + limitNum - 1)
      .order('created_at', { ascending: false });

    const { data: usuarios, error, count } = await query;

    if (error) {
      console.error('Error obteniendo usuarios:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      usuarios: usuarios || [],
      total: count || 0,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil((count || 0) / limitNum),
    });
  } catch (error: any) {
    console.error('Error obteniendo usuarios:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * GET /api/usuarios/:id
 * Obtener un usuario por ID
 */
export const getUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 💡 MODIFICACIÓN: Añadir 'created_by' a la selección
    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .select('id, email, nombre_completo, telefono, rol, estado, created_at, updated_at, created_by')
      .eq('id', id)
      .single();

    if (error || !usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json({ usuario });
  } catch (error: any) {
    console.error('Error obteniendo usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * POST /api/usuarios
 * Crear nuevo usuario
 */
export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { email, password, nombre_completo, telefono, rol } = req.body;

    const adminToken = req.headers.authorization?.replace('Bearer ', '');

    // Validación para el token del administrador (debe estar logueado)
    if (!adminToken) {
      return res.status(401).json({ error: 'Acceso denegado. Se requiere autenticación de administrador.' });
    }

    // Validaciones
    if (!email || !password || !nombre_completo || !rol) {
      return res.status(400).json({
        error: 'Faltan campos requeridos',
        required: ['email', 'password', 'nombre_completo', 'rol'],
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    const rolesValidos = [
      'administrador',
      'recepcionista',
      'diseñador',
      'cortador',
      'ayudante',
      'representante_taller'
    ];

    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido', rolesValidos });
    }

    // Verificar si el email ya existe
    const { data: existingUser } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // 1. Crear usuario en Auth (usando Service Role Key)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nombre_completo,
        rol,
      },
    });

    if (authError || !authUser.user) {
      console.error('Error creando en Auth:', authError);
      return res.status(400).json({ error: authError?.message || 'Error creando usuario en Auth' });
    }

    const newUserAuthId = authUser.user.id;
    // 💡 CREAR CLIENTE AUTENTICADO para RPC
    const authenticatedSupabaseClient = getSupabaseClient(adminToken);

    // 2. Insertar en tabla usuarios usando la FUNCIÓN RPC (para capturar auth.uid())
    const { error: rpcError } = await authenticatedSupabaseClient.rpc(
      'insert_new_user_with_creator', // Nombre de la función RPC en Supabase
      {
        auth_id_input: newUserAuthId,
        email_input: email,
        nombre_completo_input: nombre_completo,
        telefono_input: telefono || null,
        rol_input: rol,
      }
    );

    if (rpcError) {
      console.error('Error llamando a RPC (insert_new_user_with_creator):', rpcError);
      // Rollback: eliminar de Auth si falla la inserción en BD
      await supabaseAdmin.auth.admin.deleteUser(newUserAuthId);
      return res.status(400).json({ error: rpcError.message || 'Error al insertar usuario en BD vía RPC' });
    }

    // 3. Obtener el usuario recién creado (incluyendo el ID del creador)
    // 💡 MODIFICACIÓN: Añadir 'created_by' a la selección final
    const { data: usuario, error: fetchError } = await supabaseAdmin
      .from('usuarios')
      .select('id, email, nombre_completo, telefono, rol, estado, created_at, created_by') 
      .eq('auth_id', newUserAuthId)
      .single();

    if (fetchError) {
      console.error('Error recuperando usuario después de RPC:', fetchError);
      // No devolvemos error 400/500 porque el usuario ya se creó.
    }

    return res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario: usuario || { auth_id: newUserAuthId, email, nombre_completo, rol },
    });
  } catch (error: any) {
    console.error('Error creando usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * PATCH /api/usuarios/:id
 * Actualizar usuario
 */
export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre_completo, telefono, rol, estado, email } = req.body;

    if (!nombre_completo && !telefono && !rol && !estado && !email) {
      return res.status(400).json({
        error: 'Debe proporcionar al menos un campo para actualizar',
      });
    }

    // Validar email si se proporciona
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email inválido' });
      }
    }

    // Validar rol
    if (rol) {
      const rolesValidos = [
        'administrador',
        'recepcionista',
        'diseñador',
        'cortador',
        'ayudante',
        'representante_taller'
      ];

      if (!rolesValidos.includes(rol)) {
        return res.status(400).json({ error: 'Rol inválido', rolesValidos });
      }
    }

    // Validar estado
    if (estado) {
      const estadosValidos = ['activo', 'inactivo'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido', estadosValidos });
      }
    }

    // Obtener usuario actual
    const { data: currentUser } = await supabaseAdmin
      .from('usuarios')
      .select('auth_id, email')
      .eq('id', id)
      .single();

    if (!currentUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Preparar datos para actualizar
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    if (nombre_completo) updateData.nombre_completo = nombre_completo;
    if (telefono !== undefined) updateData.telefono = telefono;
    if (rol) updateData.rol = rol;
    if (estado) updateData.estado = estado;
    if (email) updateData.email = email;

    // Actualizar en BD
    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      // 💡 MODIFICACIÓN: Añadir 'created_by' a la selección
      .select('id, email, nombre_completo, telefono, rol, estado, updated_at, created_by')
      .single();

    if (error) {
      console.error('Error actualizando usuario:', error);
      return res.status(400).json({ error: error.message });
    }

    // Si cambió email, actualizar en Auth
    if (email && email !== currentUser.email) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        currentUser.auth_id,
        { email }
      );
      if (authError) {
        console.error('Error actualizando email en Auth:', authError);
      }
    }

    return res.json({
      message: 'Usuario actualizado exitosamente',
      usuario,
    });
  } catch (error: any) {
    console.error('Error actualizando usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * DELETE /api/usuarios/:id
 * Eliminar usuario
 */
export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Obtener auth_id
    const { data: usuario, error: fetchError } = await supabaseAdmin
      .from('usuarios')
      .select('auth_id, email')
      .eq('id', id)
      .single();

    if (fetchError || !usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar de BD
    const { error: deleteError } = await supabaseAdmin
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error eliminando de BD:', deleteError);
      return res.status(400).json({ error: deleteError.message });
    }

    // Eliminar de Auth
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(
      usuario.auth_id
    );

    if (authDeleteError) {
      console.error('Error eliminando de Auth:', authDeleteError);
      // Ya se eliminó de BD, solo registramos el error
    }

    return res.json({
      message: 'Usuario eliminado correctamente',
      id,
    });
  } catch (error: any) {
    console.error('Error eliminando usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}