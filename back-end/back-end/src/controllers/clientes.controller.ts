import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

// Inicialización de Supabase Admin (con service role key para operaciones admin)
const getSupabaseAdmin = () => {
    return createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || '' // ← Usar SERVICE_ROLE_KEY para admin
    );
};

// Cliente normal de Supabase (para operaciones no-admin)
const getSupabaseClient = () => {
    return createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_ANON_KEY || ''
    );
};

// MANEJO DE CLIENTES

/**
 * GET /api/clientes
 * Obtener todos los clientes (solo activos)
 */
export const getAllClientes = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        // Obtener clientes activos, ordenados por fecha de creación
        const { data: clientes, error } = await supabase
            .from('clientes')
            .select(`
                id,
                ruc,
                razonSocial:razon_social,
                email,
                telefono,
                direccion,
                activo,
                createdAt:created_at,
                updatedAt:updated_at,
                authId:auth_id
            `)
            .eq('activo', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error obteniendo clientes:', error);
            return res.status(500).json({ success: false, error: error.message });
        }

        return res.json({ success: true, data: clientes || [] });
    } catch (error: any) {
        console.error('Error en getAllClientes:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * GET /api/clientes/:id
 * Obtener un cliente por ID
 */
export const getCliente = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        const { id } = req.params;

        const { data: cliente, error } = await supabase
            .from('clientes')
            .select(`
                id,
                ruc,
                razonSocial:razon_social,
                email,
                telefono,
                direccion,
                activo,
                createdAt:created_at,
                updatedAt:updated_at,
                authId:auth_id
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error obteniendo cliente:', error);
        }
        
        if (!cliente) {
            return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
        }

        return res.json({ success: true, data: cliente });
    } catch (error: any) {
        console.error('Error en getCliente:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * POST /api/clientes
 * Crear un nuevo cliente CON autenticación de Supabase
 */
export const createCliente = async (req: Request, res: Response) => {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { ruc, razonSocial, email, password, telefono, direccion } = req.body;

        // ✅ Validación actualizada
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email y contraseña son requeridos' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                error: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }

        // 1. Verificar que el email no exista en la tabla clientes
        const { data: existingCliente } = await supabaseAdmin
            .from('clientes')
            .select('id')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (existingCliente) {
            return res.status(409).json({ 
                success: false, 
                error: 'Ya existe un cliente con este email' 
            });
        }

        // 2. Crear usuario en Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email.toLowerCase(),
            password: password,
            email_confirm: true, // Auto-confirmar email
            user_metadata: {
                role: 'cliente',
                razon_social: razonSocial,
            }
        });

        if (authError || !authData.user) {
            console.error('Error creando usuario en Auth:', authError);
            return res.status(400).json({ 
                success: false, 
                error: authError?.message || 'Error al crear usuario de autenticación' 
            });
        }

        // 3. Crear registro en tabla clientes
        const { data: cliente, error: clienteError } = await supabaseAdmin
            .from('clientes')
            .insert({
                auth_id: authData.user.id,
                ruc: ruc || null,
                razon_social: razonSocial?.trim() || null,
                email: email.toLowerCase(),
                telefono: telefono || null,
                direccion: direccion?.trim() || null,
                activo: true,
            })
            .select(`
                id,
                ruc,
                razonSocial:razon_social,
                email,
                telefono,
                direccion,
                activo,
                createdAt:created_at,
                authId:auth_id
            `)
            .single();

        if (clienteError) {
            console.error('Error creando cliente:', clienteError);
            
            // Rollback: eliminar usuario de Auth si falla la creación del cliente
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            
            if (clienteError.code === '23505') {
                return res.status(409).json({ 
                    success: false, 
                    error: 'Ya existe un cliente con este email o RUC' 
                });
            }
            return res.status(400).json({ success: false, error: clienteError.message });
        }

        return res.status(201).json({ 
            success: true, 
            message: 'Cliente creado exitosamente', 
            data: cliente 
        });
    } catch (error: any) {
        console.error('Error en createCliente:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * POST /api/clientes/invite
 * Crear cliente con invitación por email (sin contraseña inicial)
 */
export const createClienteWithInvitation = async (req: Request, res: Response) => {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { ruc, razonSocial, email, telefono, direccion } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email es requerido' 
            });
        }

        // 1. Verificar que el email no exista
        const { data: existingCliente } = await supabaseAdmin
            .from('clientes')
            .select('id')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (existingCliente) {
            return res.status(409).json({ 
                success: false, 
                error: 'Ya existe un cliente con este email' 
            });
        }

        // 2. Crear usuario y enviar invitación
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email.toLowerCase(),
            email_confirm: false,
            user_metadata: {
                role: 'cliente',
                razon_social: razonSocial,
            }
        });

        if (authError || !authData.user) {
            console.error('Error creando usuario:', authError);
            return res.status(400).json({ 
                success: false, 
                error: authError?.message || 'Error al crear usuario' 
            });
        }

        // 3. Crear registro en tabla clientes
        const { data: cliente, error: clienteError } = await supabaseAdmin
            .from('clientes')
            .insert({
                auth_id: authData.user.id,
                ruc: ruc || null,
                razon_social: razonSocial?.trim() || null,
                email: email.toLowerCase(),
                telefono: telefono || null,
                direccion: direccion?.trim() || null,
                activo: true,
            })
            .select(`
                id,
                ruc,
                razonSocial:razon_social,
                email,
                telefono,
                direccion,
                activo,
                createdAt:created_at,
                authId:auth_id
            `)
            .single();

        if (clienteError) {
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            return res.status(400).json({ success: false, error: clienteError.message });
        }

        // 4. Enviar invitación por email
        const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
            email.toLowerCase(),
            {
                redirectTo: `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`
            }
        );

        if (inviteError) {
            console.error('Error enviando invitación:', inviteError);
        }

        return res.status(201).json({ 
            success: true, 
            message: 'Cliente creado e invitación enviada', 
            data: cliente 
        });
    } catch (error: any) {
        console.error('Error en createClienteWithInvitation:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * PUT /api/clientes/:id
 * Actualizar un cliente
 */
export const updateCliente = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        const { id } = req.params;
        const { ruc, razonSocial, email, telefono, direccion, activo } = req.body;

        // Preparar datos de actualización
        const updateData: any = {};
        
        if (ruc !== undefined) updateData.ruc = ruc;
        if (razonSocial !== undefined) updateData.razon_social = razonSocial?.trim();
        if (email !== undefined) updateData.email = email?.toLowerCase();
        if (telefono !== undefined) updateData.telefono = telefono;
        if (direccion !== undefined) updateData.direccion = direccion?.trim();
        if (activo !== undefined) updateData.activo = activo;

        const { data: cliente, error } = await supabase
            .from('clientes')
            .update(updateData)
            .eq('id', id)
            .select(`
                id,
                ruc,
                razonSocial:razon_social,
                email,
                telefono,
                direccion,
                activo,
                createdAt:created_at,
                updatedAt:updated_at,
                authId:auth_id
            `)
            .single();

        if (error) {
            console.error('Error actualizando cliente:', error);
            if (error.code === '23505') {
                return res.status(409).json({ 
                    success: false, 
                    error: 'Ya existe un cliente con este email o RUC' 
                });
            }
            return res.status(400).json({ success: false, error: error.message });
        }
        
        if (!cliente) {
            return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
        }

        return res.json({
            success: true,
            message: 'Cliente actualizado exitosamente',
            data: cliente
        });
    } catch (error: any) {
        console.error('Error en updateCliente:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * PATCH /api/clientes/:id/toggle-activo
 * Cambiar el estado 'activo' del cliente
 */
export const toggleActivoCliente = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        const { id } = req.params;
        
        const { data: clienteActual } = await supabase
            .from('clientes')
            .select('activo')
            .eq('id', id)
            .single();

        if (!clienteActual) {
            return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
        }
        
        const nuevoEstado = !clienteActual.activo;
        
        const { data: cliente, error } = await supabase
            .from('clientes')
            .update({ activo: nuevoEstado })
            .eq('id', id)
            .select(`
                id,
                ruc,
                razonSocial:razon_social,
                email,
                telefono,
                direccion,
                activo,
                updatedAt:updated_at
            `)
            .single();

        if (error) {
            console.error('Error al cambiar estado activo:', error);
            return res.status(400).json({ success: false, error: error.message });
        }

        return res.json({
            success: true,
            message: `Cliente ${cliente.activo ? 'activado' : 'desactivado'} exitosamente`,
            data: cliente
        });
    } catch (error: any) {
        console.error('Error en toggleActivoCliente:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * DELETE /api/clientes/:id
 * Eliminar (desactivar) un cliente
 */
export const deleteCliente = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        const { id } = req.params;

        // Verificar si tiene pedidos asociados
        const { data: pedidos, error: pedidoError } = await supabase
            .from('pedidos')
            .select('id')
            .eq('cliente_id', id)
            .limit(1);

        if (pedidoError) {
            console.error('Error verificando pedidos:', pedidoError);
            return res.status(500).json({ success: false, error: pedidoError.message });
        }
        
        if (pedidos && pedidos.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'No se puede eliminar el cliente porque tiene pedidos asociados. Considere desactivarlo.'
            });
        }

        // Eliminar lógicamente (soft delete)
        const { data: cliente, error } = await supabase
            .from('clientes')
            .update({ activo: false })
            .eq('id', id)
            .select('id')
            .single();
        
        if (error) {
            console.error('Error desactivando cliente:', error);
            return res.status(400).json({ success: false, error: error.message });
        }
        
        if (!cliente) {
            return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
        }

        return res.json({ success: true, message: 'Cliente desactivado exitosamente' });
    } catch (error: any) {
        console.error('Error en deleteCliente:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * GET /api/clientes/:id/pedidos
 * Obtener todos los pedidos de un cliente
 */
export const getPedidosByCliente = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        const { id } = req.params;

        const { data: pedidos, error } = await supabase
            .from('pedidos')
            .select(`
                *,
                cliente:clientes!inner(id, razon_social, email),
                detalles:detalles_pedido(
                    *,
                    producto:productos(id, nombre, precio, categoria_id)
                )
            `)
            .eq('cliente_id', id)
            .order('fecha_pedido', { ascending: false });

        if (error) {
            console.error('Error obteniendo pedidos del cliente:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
        
        if (!pedidos || pedidos.length === 0) {
            return res.json({ success: true, data: { cliente: null, pedidos: [] } });
        }
        
        const clienteInfo = pedidos[0].cliente;
        const pedidosFormateados = pedidos.map(pedido => {
            const { cliente, ...restOfPedido } = pedido;
            return restOfPedido;
        });

        return res.json({
            success: true,
            data: {
                cliente: clienteInfo,
                pedidos: pedidosFormateados
            }
        });
    } catch (error: any) {
        console.error('Error en getPedidosByCliente:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * GET /api/clientes/search/:term
 * Buscar clientes por término
 */
export const searchClientes = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        const { term } = req.params;
        const searchTerm = `%${term.toLowerCase()}%`;

        const { data: clientes, error } = await supabase
            .from('clientes')
            .select(`
                id,
                ruc,
                razonSocial:razon_social,
                email,
                telefono,
                direccion,
                activo
            `)
            .eq('activo', true)
            .or(`razon_social.ilike.${searchTerm},email.ilike.${searchTerm},direccion.ilike.${searchTerm}`);

        if (error) {
            console.error('Error buscando clientes:', error);
            return res.status(500).json({ success: false, error: error.message });
        }

        return res.json({ success: true, data: clientes || [] });
    } catch (error: any) {
        console.error('Error en searchClientes:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};