import { supabase } from '@/lib/supabase';
import { Pedido, DetallePedido } from '@/types/database';

interface CrearPedidoData {
  cliente: {
    ruc: number;
    razon_social: string;
    email: string;
    telefono: number;
    direccion: string;
  };
  items: {
    producto_id: number;
    cantidad: number;
    talla: string;
    color?: string;
    precio_unitario: number;
    notas?: string;
  }[];
  subtotal: number;
  descuento: number;
  impuesto: number;
  total: number;
  notas?: string;
  prioridad?: 'NORMAL' | 'URGENTE';
}

export class PedidosService {
  // Generar número de pedido único
  private static async generarNumeroPedido(): Promise<string> {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    
    // Obtener último pedido del día
    const { data, error } = await supabase
      .from('pedidos')
      .select('numero_pedido')
      .like('numero_pedido', `PED-${año}${mes}${dia}%`)
      .order('numero_pedido', { ascending: false })
      .limit(1);

    let secuencial = 1;
    if (data && data.length > 0) {
      const ultimoNumero = data[0].numero_pedido;
      const ultimoSecuencial = parseInt(ultimoNumero.split('-')[2]);
      secuencial = ultimoSecuencial + 1;
    }

    return `PED-${año}${mes}${dia}-${String(secuencial).padStart(4, '0')}`;
  }

  // Crear o buscar cliente
  private static async gestionarCliente(clienteData: CrearPedidoData['cliente']): Promise<number> {
    // Buscar cliente existente por RUC
    const { data: clienteExistente } = await supabase
      .from('clientes')
      .select('id')
      .eq('ruc', clienteData.ruc)
      .single();

    if (clienteExistente) {
      // Actualizar datos del cliente
      await supabase
        .from('clientes')
        .update({
          razon_social: clienteData.razon_social,
          email: clienteData.email,
          telefono: clienteData.telefono,
          direccion: clienteData.direccion,
          updated_at: new Date().toISOString()
        })
        .eq('id', clienteExistente.id);

      return clienteExistente.id;
    }

    // Crear nuevo cliente
    const { data: nuevoCliente, error } = await supabase
      .from('clientes')
      .insert({
        ruc: clienteData.ruc,
        razon_social: clienteData.razon_social,
        email: clienteData.email,
        telefono: clienteData.telefono,
        direccion: clienteData.direccion,
        activo: true
      })
      .select('id')
      .single();

    if (error) throw error;
    return nuevoCliente.id;
  }

  // Crear pedido completo (ESTE ES EL MÉTODO PRINCIPAL)
  static async crearPedido(pedidoData: CrearPedidoData): Promise<{
    success: boolean;
    pedidoId?: number;
    numeroPedido?: string;
    error?: string;
  }> {
    try {
      // 1. Gestionar cliente
      const clienteId = await this.gestionarCliente(pedidoData.cliente);

      // 2. Generar número de pedido
      const numeroPedido = await this.generarNumeroPedido();

      // 3. Crear pedido principal
      const { data: pedido, error: errorPedido } = await supabase
        .from('pedidos')
        .insert({
          numero_pedido: numeroPedido,
          cliente_id: clienteId,
          fecha_pedido: new Date().toISOString(),
          estado: 'PENDIENTE',
          prioridad: pedidoData.prioridad || 'NORMAL',
          subtotal: pedidoData.subtotal,
          descuento: pedidoData.descuento,
          impuesto: pedidoData.impuesto,
          total: pedidoData.total,
          notas: pedidoData.notas || null,
          direccion_envio: pedidoData.cliente.direccion,
          created_by: 'web-cliente'
        })
        .select('id')
        .single();

      if (errorPedido) throw errorPedido;

      // 4. Crear detalles del pedido
      const detalles = pedidoData.items.map(item => ({
        pedido_id: pedido.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        talla: item.talla,
        color: item.color || null,
        precio_unitario: item.precio_unitario,
        subtotal: item.cantidad * item.precio_unitario,
        notas: item.notas || null
      }));

      const { error: errorDetalles } = await supabase
        .from('detalles_pedido')
        .insert(detalles);

      if (errorDetalles) throw errorDetalles;

      return {
        success: true,
        pedidoId: pedido.id,
        numeroPedido: numeroPedido
      };
    } catch (error: any) {
      console.error('Error creando pedido:', error);
      return {
        success: false,
        error: error.message || 'Error al crear el pedido'
      };
    }
  }

  // Obtener pedido por ID
  static async obtenerPedido(id: number): Promise<{
    pedido: Pedido | null;
    detalles: DetallePedido[];
  }> {
    try {
      const { data: pedido, error: errorPedido } = await supabase
        .from('pedidos')
        .select('*, clientes(*)')
        .eq('id', id)
        .single();

      if (errorPedido) throw errorPedido;

      const { data: detalles, error: errorDetalles } = await supabase
        .from('detalles_pedido')
        .select('*, productos(*, categorias(*))')
        .eq('pedido_id', id);

      if (errorDetalles) throw errorDetalles;

      return {
        pedido: pedido || null,
        detalles: detalles || []
      };
    } catch (error) {
      console.error('Error obteniendo pedido:', error);
      return { pedido: null, detalles: [] };
    }
  }
}