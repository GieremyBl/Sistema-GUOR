import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { Resend } from 'resend';
// Usamos alias (ItemCar) para evitar conflicto de nombre con la variable 'items'
import { Producto, ItemCarrito as ItemCar, ProductoConsultado } from '@/types/database'; 

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  let pedido_id: number | null = null; 
  let ordenId = '';

  try {
    const body = await request.json();
    
    // Tipamos la desestructuración con las interfaces
    const { items, total, metodoPago, datosCliente, datosPago } = body as {
        items: ItemCar[]; 
        total: number;
        metodoPago: string;
        datosCliente: any; // Se puede tipar mejor si tienes la interfaz Cliente
        datosPago: { token: string } | null | undefined; 
    };
    
    ordenId = `ORD-${Date.now()}`;

    // --- 1. GUARDAR PEDIDO INICIAL EN SUPABASE (CABECERA) ---
    const { data: pedidoGuardado, error: dbError } = await supabase
      .from('pedidos') 
      .insert({
        orden_id: ordenId,
        cliente_email: datosCliente.email,
        total,
        metodo_pago: metodoPago,
        datos_cliente: datosCliente,
        estado: 'pendiente_pago',
        transaccion_token: datosPago?.token ?? null, // Tipado seguro
      })
      .select('id, orden_id')
      .single();

    if (dbError || !pedidoGuardado) {
      console.error('Error al guardar pedido en DB:', dbError);
      throw new Error('FALLO_DB_INICIO');
    }

    pedido_id = pedidoGuardado.id;


    // --- 1.5. PREPARAR Y GUARDAR DETALLES DEL PEDIDO ---
    console.log('1.5. Obteniendo foto de productos e insertando detalles...');

    // 1. Obtener los IDs de producto
    const productoIds = items.map((item) => item.producto_id); // Usamos producto_id de ItemCarrito
    
    // 2. Consultar la tabla 'productos'. El resultado será de tipo Producto[]
   const { data: productosData, error: productosError } = await supabase
    .from('productos')
    // Usamos el mismo select
    .select('id, nombre, sku, stock'); 


// Tipamos el mapeo usando el tipo ProductoConsultado
const productosMap = new Map(productosData!.map((p: ProductoConsultado) => [p.id, p]));

    // 3. Construir los datos para la inserción
    const itemsData = items.map((item) => {
        // El productoInfo es de tipo Producto | undefined
        const productoStockInfo: ProductoConsultado | undefined = productosMap.get(item.producto_id); 

        if (!productoStockInfo) {
            throw new Error(`Producto ID ${item.producto_id} no encontrado en la base de datos.`);
        }

        return {
            pedido_id: pedido_id,
            producto_id: item.producto_id,
            // Usamos los campos obtenidos de la BD (la "foto")
            nombre_producto: productoStockInfo.nombre, 
            sku_producto: productoStockInfo.sku,
            
            cantidad: item.cantidad,
            talla: item.talla,
            color: item.color,
            precio_unitario: item.precio, // Usamos item.precio de ItemCarrito
            subtotal: item.precio * item.cantidad,
            notas: item.notas,
        };
    });

    // 4. Inserción masiva en 'detalles_pedido'
    const { error: itemsError } = await supabase
      .from('detalles_pedido')
      .insert(itemsData);

    if (itemsError) {
       console.error('Error al guardar detalles del pedido:', itemsError);
       throw new Error('FALLO_DB_DETALLES');
    }
    
    // --- 2. PROCESAR PAGO CON PASARELA (LÓGICA REAL AQUÍ) ---
    const pagoExitoso = total > 0;
    
    if (!pagoExitoso) {
        await supabase
          .from('pedidos')
          .update({ estado: 'pago_fallido' })
          .eq('id', pedido_id);
        throw new Error('FALLO_PAGO');
    }

    // --- 3. GESTIÓN DE STOCK Y ACTUALIZACIÓN DE ESTADO ---
    console.log('3. Pago exitoso. Reduciendo stock...');

    await supabase
      .from('pedidos')
      .update({ estado: 'pagado', transaccion_id: 'TXN-SIMULADO-123' })
      .eq('id', pedido_id);

    // Reducir Stock
    for (const item of items) {
        const productoStockInfo: ProductoConsultado | undefined = productosMap.get(item.producto_id);

        if (!productoStockInfo) {
             console.error(`Error: Producto ID ${item.producto_id} no se encontró para reducir stock.`);
             continue; 
        }

        const { error: stockError } = await supabase
            .from('productos')
            .update({ 
                stock: productoStockInfo.stock - item.cantidad 
            })
            .eq('id', item.producto_id); 

        if (stockError) {
             console.error(`Fallo al reducir stock para producto ${item.producto_id}`, stockError);
        }
    }

    // --- 4. ENVIAR EMAIL DE CONFIRMACIÓN ---
    console.log('4. Enviando email de confirmación...');
    try {
        await resend.emails.send({
          from: 'pedidos@tudominio.com',
          to: datosCliente.email,
          subject: `✅ Pedido Confirmado #${ordenId}`,
          html: `
            <h1>¡Gracias por tu compra, ${datosCliente.nombre}!</h1>
            <p>Tu pedido **#${ordenId}** ha sido confirmado y tu pago por **S/. ${total}** fue exitoso.</p>
            <p>Lo estamos preparando para el envío.</p>
          `,
        });
    } catch (emailError) {
        console.warn('Advertencia: No se pudo enviar el email de confirmación.', emailError);
    }

    // --- 5. RESPUESTA FINAL EXITOSA ---
    return NextResponse.json({
      success: true,
      ordenId: ordenId,
      mensaje: 'Pedido procesado, pago exitoso, stock actualizado y email enviado.',
    });

  } catch (error) {
    // --- MANEJO CENTRALIZADO DE ERRORES ---
    console.error('Error durante el flujo de pedido:', error);
    let errorMessage = 'Error desconocido al procesar el pedido.';
    let statusCode = 500;

    if (pedido_id) {
        await supabase
          .from('pedidos')
          .update({ estado: 'error_interno' })
          .eq('id', pedido_id)
          .maybeSingle(); 
    }

    if (error instanceof Error) {
        if (error.message === 'FALLO_DB_INICIO') {
            errorMessage = 'Error al registrar el pedido en la base de datos.';
        } else if (error.message === 'FALLO_PAGO') {
            errorMessage = 'El pago fue rechazado por la pasarela.';
            statusCode = 402; 
        } else if (error.message.includes('Stock insuficiente') || error.message === 'FALLO_CONSULTA_PRODUCTOS' || error.message === 'FALLO_DB_DETALLES') {
            errorMessage = 'Hubo un error con los datos del producto o la base de datos.';
            statusCode = 400; 
        }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}