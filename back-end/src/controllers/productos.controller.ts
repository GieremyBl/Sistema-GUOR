import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

type EstadoProducto = 'activo' | 'inactivo';

const getSupabaseClient = () => {
    return createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
};

/**
 * GET /api/productos
 * Obtener todos los productos con sus categorías
 */
export const getAllProductos = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        const { data: productos, error } = await supabase
            .from('productos')
            .select(`
                *,
                categoria:categorias(id, nombre, descripcion, activo)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error obteniendo productos:', error);
            return res.status(500).json({ success: false, error: error.message });
        }

        return res.json({ success: true, data: productos || [] });
    } catch (error: any) {
        console.error('Error en getAllProductos:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * GET /api/productos/stock-bajo
 * Obtener productos con stock por debajo del mínimo (usando función o vista)
 */
export const getStockBajo = async (req: Request, res: Response) => {
    try {
        // NOTA: Para comparar dos columnas ('stock' <= 'stock_minimo') en Supabase,
        // la forma más limpia es usar una View o una RPC, ya que el .filter()
        // normal de Postgrest asume que el segundo argumento es un valor literal.
        // Aquí asumiremos que tienes configurada una View o que la comparación funciona.
        let supabase = getSupabaseClient();
        const { data: productos, error } = await supabase
            .from('productos')
            .select(`
                *,
                categoria:categorias(id, nombre)
            `)
            // Esta línea puede fallar, se recomienda usar una Vista o RPC para la comparación de columnas:
            .filter('stock', 'lte', 'stock_minimo') 
            .eq('estado', 'activo' as EstadoProducto) // Usando 'estado' en lugar de 'activo'
            .order('stock', { ascending: true });

        if (error) {
            console.error('Error obteniendo productos con stock bajo:', error);
            return res.status(500).json({ success: false, error: error.message });
        }

        return res.json({ 
            success: true, 
            data: productos || [], 
            count: productos?.length || 0 
        });
    } catch (error: any) {
        console.error('Error en getStockBajo:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * GET /api/productos/:id
 * Obtener un producto por ID
 */
export const getProducto = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        const { id } = req.params;

        const { data: producto, error } = await supabase
            .from('productos')
            .select(`
                *,
                categoria:categorias(id, nombre, descripcion, activo)
            `)
            .eq('id', id)
            .single();

        if (error || !producto) {
            return res.status(404).json({ success: false, error: 'Producto no encontrado' });
        }

        return res.json({ success: true, data: producto });
    } catch (error: any) {
        console.error('Error en getProducto:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * POST /api/productos
 * Crear un nuevo producto
 */
export const createProducto = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        const {
            nombre,
            descripcion,
            categoria_id,
            precio,
            stock,
            stock_minimo,
            imagen,
            estado
        } = req.body;

        // Validaciones básicas
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                error: 'El nombre del producto es obligatorio' 
            });
        }

        if (!categoria_id) {
            return res.status(400).json({ 
                success: false, 
                error: 'La categoría es obligatoria' 
            });
        }

        if (!precio || parseFloat(precio) <= 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'El precio debe ser mayor a 0' 
            });
        }

        // ✅ CORRECCIÓN: Verificar que la categoría existe y manejar el error correctamente
        const { data: categoria, error: categoriaError } = await supabase
            .from('categorias')
            .select('id, activo')
            .eq('id', parseInt(categoria_id))
            .maybeSingle(); // ✅ Usar maybeSingle() en lugar de single()

        // Verificar si hay error o si no se encontró la categoría
        if (categoriaError) {
            console.error('Error verificando categoría:', categoriaError);
            return res.status(500).json({ 
                success: false, 
                error: 'Error al verificar la categoría' 
            });
        }

        if (!categoria) {
            console.log(`❌ Categoría ${categoria_id} no encontrada`);
            return res.status(400).json({ 
                success: false, 
                error: 'La categoría especificada no existe' 
            });
        }

        // Opcional: Verificar que la categoría esté activa
        if (!categoria.activo) {
            return res.status(400).json({ 
                success: false, 
                error: 'La categoría seleccionada está inactiva' 
            });
        }

        console.log('✅ Categoría válida:', categoria);

        // Crear el producto
        const { data: producto, error } = await supabase
            .from('productos')
            .insert({
                nombre: nombre.trim(),
                descripcion: descripcion?.trim() || null,
                categoria_id: parseInt(categoria_id),
                precio: parseFloat(precio),
                stock: stock !== undefined ? parseInt(stock) : 0,
                stock_minimo: stock_minimo !== undefined ? parseInt(stock_minimo) : 10,
                imagen: imagen || null,
                estado: (estado as EstadoProducto) || ('activo' as EstadoProducto)
            })
            .select(`
                *,
                categoria:categorias(id, nombre, descripcion)
            `)
            .single();

        if (error) {
            console.error('Error creando producto:', error);
            return res.status(400).json({ 
                success: false, 
                error: error.message 
            });
        }

        console.log('✅ Producto creado exitosamente:', producto);

        return res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: producto
        });
    } catch (error: any) {
        console.error('Error en createProducto:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Error interno del servidor' 
        });
    }
};

/**
 * PUT /api/productos/:id
 * Actualizar un producto
 */
export const updateProducto = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        const { id } = req.params;
        const {
            nombre,
            descripcion,
            categoria_id,
            precio,
            stock_minimo,
            imagen,
            estado
        } = req.body;

        // Preparar datos de actualización
        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (nombre !== undefined) updateData.nombre = nombre.trim();
        if (descripcion !== undefined) updateData.descripcion = descripcion?.trim() || null;
        if (categoria_id !== undefined) updateData.categoria_id = parseInt(categoria_id);
        if (precio !== undefined) updateData.precio = parseFloat(precio);
        if (stock_minimo !== undefined) updateData.stock_minimo = parseInt(stock_minimo);
        if (imagen !== undefined) updateData.imagen = imagen || null;
        if (estado !== undefined) updateData.estado = estado; 

        // Actualizar el producto
        const { data: producto, error } = await supabase
            .from('productos')
            .update(updateData)
            .eq('id', id)
            .select(`
                *,
                categoria:categorias(id, nombre, descripcion)
            `)
            .single();

        if (error || !producto) {
            return res.status(404).json({ success: false, error: 'Producto no encontrado o error de actualización' });
        }

        return res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: producto
        });
    } catch (error: any) {
        console.error('Error en updateProducto:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * PATCH /api/productos/:id/stock
 * Actualizar stock de un producto (entrada/salida)
 */
export const updateStock = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        const { id } = req.params;
        const { cantidad, tipo_movimiento } = req.body;

        // ... Validaciones (cantidad positiva, tipo_movimiento válido) ...

        // Obtener el producto actual
        const { data: producto, error: selectError } = await supabase
            .from('productos')
            .select('stock, nombre')
            .eq('id', id)
            .single();

        if (selectError || !producto) {
            return res.status(404).json({ success: false, error: 'Producto no encontrado' });
        }

        // Calcular nuevo stock
        const cantidadNumerica = parseInt(cantidad);
        const nuevoStock = tipo_movimiento === 'ENTRADA' 
            ? producto.stock + cantidadNumerica
            : producto.stock - cantidadNumerica;

        // Validar que no quede stock negativo
        if (nuevoStock < 0) {
            return res.status(400).json({ 
                success: false, 
                error: `Stock insuficiente. Stock actual: ${producto.stock}, cantidad solicitada: ${cantidadNumerica}` 
            });
        }

        // Actualizar el stock
        const { data: productoActualizado, error } = await supabase
            .from('productos')
            .update({ 
                stock: nuevoStock,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select(`
                *,
                categoria:categorias(id, nombre)
            `)
            .single();

        if (error) {
            console.error('Error actualizando stock:', error);
            return res.status(400).json({ success: false, error: error.message });
        }

        return res.json({
            success: true,
            message: `Stock actualizado exitosamente. ${tipo_movimiento === 'ENTRADA' ? 'Entrada' : 'Salida'} de ${cantidadNumerica} unidades`,
            data: productoActualizado,
        });
    } catch (error: any) {
        console.error('Error en updateStock:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * DELETE /api/productos/:id
 * Eliminar un producto
 */
export const deleteProducto = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        const { id } = req.params;

        // 1. Verificar si el producto existe
        const { data: producto } = await supabase
            .from('productos')
            .select('id')
            .eq('id', id)
            .single();

        if (!producto) {
            return res.status(404).json({ success: false, error: 'Producto no encontrado' });
        }

        // 2. Verificar si hay detalles de pedido asociados (usando tu tabla detalles_pedido)
        const { data: pedidos } = await supabase
            .from('detalles_pedido')
            .select('id')
            .eq('producto_id', id)
            .limit(1);

        if (pedidos && pedidos.length > 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'No se puede eliminar el producto porque tiene pedidos asociados' 
            });
        }

        // 3. Eliminar el producto
        const { error } = await supabase
            .from('productos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error eliminando producto:', error);
            return res.status(400).json({ success: false, error: error.message });
        }

        return res.json({ success: true, message: 'Producto eliminado exitosamente' });
    } catch (error: any) {
        console.error('Error en deleteProducto:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};