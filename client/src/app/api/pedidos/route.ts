import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { ItemCarrito as ItemCar, ProductoConsultado, DatosCliente } from '@/types/database'; 

const resend = new Resend(process.env.RESEND_API_KEY);

// Configurar transporter de Mailtrap para desarrollo
const mailtrapTransporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
  port: Number(process.env.MAILTRAP_PORT) || 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Función helper para enviar emails
async function enviarEmail(to: string, subject: string, html: string) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // Usar Mailtrap en desarrollo
    console.log('📧 Enviando email via Mailtrap...');
    return await mailtrapTransporter.sendMail({
      from: '"Tu Tienda GUOR" <onboarding@resend.dev>',
      to,
      subject,
      html,
    });
  } else {
    // Usar Resend en producción
    console.log('📧 Enviando email via Resend...');
    return await resend.emails.send({
      from: 'pedidos@tutienda.com', // Cambiar por tu dominio verificado en producción
      to,
      subject,
      html,
    });
  }
}

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
        datosCliente: DatosCliente;
        datosPago: { token: string } | null | undefined; 
    };
    
    if (!datosCliente.email || typeof datosCliente.email !== 'string' || datosCliente.email.trim() === '') {
        console.error('❌ Validación fallida: Email del cliente no proporcionado o inválido.');
        // Puedes lanzar un error específico o retornar una respuesta de error 400
        return NextResponse.json(
            { success: false, error: 'El email del cliente es obligatorio.' },
            { status: 400 }
        );
    }

    ordenId = `ORD-${Date.now()}`;
    console.log('🛍️ Procesando pedido:', ordenId);

    // --- 1. GUARDAR PEDIDO INICIAL EN SUPABASE (CABECERA) ---
    console.log('1. Guardando pedido en base de datos...');
    const { data: pedidoGuardado, error: dbError } = await supabase
      .from('pedidos') 
      .insert({
        orden_id: ordenId,
        cliente_email: datosCliente.email,
        total,
        metodo_pago: metodoPago,
        datos_cliente: datosCliente,
        estado: 'PENDIENTE',
        transaccion_token: datosPago?.token ?? null,
      })
      .select('id, orden_id')
      .single();

    if (dbError || !pedidoGuardado) {
      console.error('❌ Error al guardar pedido en DB:', dbError);
      throw new Error('FALLO_DB_INICIO');
    }

    pedido_id = pedidoGuardado.id;
    console.log('✅ Pedido guardado con ID:', pedido_id);


    // --- 1.5. PREPARAR Y GUARDAR DETALLES DEL PEDIDO ---
    console.log('1.5. Obteniendo información de productos e insertando detalles...');

    // 1. Obtener los IDs de producto
    const productoIds = items.map((item) => item.producto_id);
    
    // 2. Consultar la tabla 'productos'
    const { data: productosData, error: productosError } = await supabase
      .from('productos')
      .select('id, nombre, sku, stock')
      .in('id', productoIds); 

    if (productosError || !productosData) {
      console.error('❌ Error al consultar productos:', productosError);
      throw new Error('FALLO_CONSULTA_PRODUCTOS');
    }

    // Tipamos el mapeo usando el tipo ProductoConsultado
    const productosMap = new Map(productosData.map((p: ProductoConsultado) => [p.id, p]));

    // 3. Construir los datos para la inserción
    const itemsData = items.map((item) => {
        const productoStockInfo: ProductoConsultado | undefined = productosMap.get(item.producto_id); 

        if (!productoStockInfo) {
            throw new Error(`Producto ID ${item.producto_id} no encontrado en la base de datos.`);
        }

        return {
            pedido_id: pedido_id,
            producto_id: item.producto_id,
            nombre_producto: productoStockInfo.nombre, 
            sku_producto: productoStockInfo.sku,
            cantidad: item.cantidad,
            talla: item.talla,
            color: item.color,
            precio_unitario: item.precio,
            subtotal: item.precio * item.cantidad,
            notas: item.notas,
        };
    });

    // 4. Inserción masiva en 'detalles_pedido'
    const { error: itemsError } = await supabase
      .from('detalles_pedido')
      .insert(itemsData);

    if (itemsError) {
       console.error('❌ Error al guardar detalles del pedido:', itemsError);
       throw new Error('FALLO_DB_DETALLES');
    }
    console.log('✅ Detalles del pedido guardados');
    
    // --- 2. PROCESAR PAGO CON PASARELA (LÓGICA REAL AQUÍ) ---
    console.log('2. Procesando pago...');
    const pagoExitoso = total > 0; // Simular pago exitoso
    
    if (!pagoExitoso) {
        console.log('❌ Pago rechazado');
        await supabase
          .from('pedidos')
          .update({ estado: 'CANCELADO' })
          .eq('id', pedido_id);
        throw new Error('FALLO_PAGO');
    }
    console.log('✅ Pago procesado exitosamente');

    // --- 3. GESTIÓN DE STOCK Y ACTUALIZACIÓN DE ESTADO ---
    console.log('3. Actualizando estado y reduciendo stock...');

    await supabase
      .from('pedidos')
      .update({ 
        estado: 'EN_PROCESO', 
        transaccion_id: 'TXN-SIMULADO-123' 
      })
      .eq('id', pedido_id);

    // Reducir Stock
    for (const item of items) {
        const productoStockInfo: ProductoConsultado | undefined = productosMap.get(item.producto_id);

        if (!productoStockInfo) {
             console.error(`⚠️ Error: Producto ID ${item.producto_id} no se encontró para reducir stock.`);
             continue; 
        }

        const nuevoStock = productoStockInfo.stock - item.cantidad;
        
        if (nuevoStock < 0) {
            console.warn(`⚠️ Advertencia: Stock negativo para producto ${item.producto_id}`);
        }

        const { error: stockError } = await supabase
            .from('productos')
            .update({ 
                stock: nuevoStock
            })
            .eq('id', item.producto_id); 

        if (stockError) {
             console.error(`❌ Fallo al reducir stock para producto ${item.producto_id}`, stockError);
        } else {
             console.log(`✅ Stock actualizado para producto ${item.producto_id}: ${nuevoStock}`);
        }
    }

    // --- 4. ENVIAR EMAIL DE CONFIRMACIÓN ---
    console.log('4. Enviando email de confirmación...');
    try {
        const emailHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background-color: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
              }
              .content { 
                padding: 30px; 
              }
              .order-info { 
                background: #f9f9f9; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0;
                border-left: 4px solid #667eea;
              }
              .order-info p {
                margin: 10px 0;
              }
              .total { 
                font-size: 28px; 
                font-weight: bold; 
                color: #667eea; 
              }
              .badge { 
                display: inline-block; 
                padding: 6px 12px; 
                background: #4caf50; 
                color: white; 
                border-radius: 20px; 
                font-size: 12px;
                font-weight: bold;
              }
              .items-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              .items-table th {
                background: #f5f5f5;
                padding: 10px;
                text-align: left;
                border-bottom: 2px solid #ddd;
              }
              .items-table td {
                padding: 10px;
                border-bottom: 1px solid #eee;
              }
              .footer { 
                text-align: center; 
                padding: 20px;
                background: #f9f9f9;
                color: #666; 
                font-size: 12px; 
              }
              .warning-dev {
                background: #fff3cd;
                border: 1px solid #ffc107;
                color: #856404;
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 ¡Gracias por tu compra!</h1>
              </div>
              <div class="content">
                <p>Hola <strong>${datosCliente.nombre} ${datosCliente.apellidos || ''}</strong>,</p>
                <p>Tu pedido ha sido confirmado exitosamente y estamos procesando tu compra.</p>
                
                <div class="order-info">
                  <p><strong>📦 Número de orden:</strong> #${ordenId}</p>
                  <p><strong>💰 Total pagado:</strong> <span class="total">S/. ${total.toFixed(2)}</span></p>
                  <p><strong>📊 Estado:</strong> <span class="badge">EN PROCESO</span></p>
                  <p><strong>💳 Método de pago:</strong> ${metodoPago}</p>
                  <p><strong>📧 Email:</strong> ${datosCliente.email}</p>
                  ${datosCliente.telefono ? `<p><strong>📱 Teléfono:</strong> ${datosCliente.telefono}</p>` : ''}
                </div>

                <h3>📋 Detalle de productos:</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${items.map(item => `
                      <tr>
                        <td>
                          <strong>${item.nombre || 'Producto'}</strong>
                          ${item.talla ? `<br><small>Talla: ${item.talla}</small>` : ''}
                          ${item.color ? `<br><small>Color: ${item.color}</small>` : ''}
                        </td>
                        <td>${item.cantidad}</td>
                        <td>S/. ${item.precio.toFixed(2)}</td>
                        <td><strong>S/. ${(item.precio * item.cantidad).toFixed(2)}</strong></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                
                <p>📍 <strong>Dirección de envío:</strong><br>
                ${datosCliente.direccion || 'No especificada'}</p>
                
                <p>Estamos preparando tu pedido para el envío. Te notificaremos cuando esté en camino a tu dirección.</p>
                
                <p>Si tienes alguna pregunta o necesitas hacer algún cambio, no dudes en contactarnos.</p>

                ${process.env.NODE_ENV === 'development' ? `
                  <div class="warning-dev">
                    ⚠️ <strong>EMAIL DE PRUEBA - MAILTRAP</strong><br>
                    Este email fue capturado por Mailtrap y no se envió realmente.
                  </div>
                ` : ''}
              </div>
              <div class="footer">
                <p><strong>Tu Tienda GUOR - Modas y Estilos</strong></p>
                <p>© ${new Date().getFullYear()} Todos los derechos reservados.</p>
                <p style="font-size: 11px; color: #999;">
                  Este es un email automático, por favor no responder a este mensaje.
                </p>
              </div>
            </div>
          </body>
          </html>
        `;

        const emailResult = await enviarEmail(
          datosCliente.email,
          `✅ Pedido Confirmado #${ordenId} - Tu Tienda GUOR`,
          emailHTML
        );

        console.log('✅ Email enviado correctamente:', 
        'messageId' in emailResult 
            ? emailResult.messageId 
            : (emailResult.data?.id || 'OK')
        );
    } catch (emailError) {
        console.error('⚠️ Advertencia: No se pudo enviar el email de confirmación.', emailError);
        // No lanzamos error aquí porque el pedido ya fue procesado exitosamente
    }

    // --- 5. RESPUESTA FINAL EXITOSA ---
    console.log('✅ Pedido completado exitosamente');
    return NextResponse.json({
      success: true,
      ordenId: ordenId,
      pedidoId: pedido_id,
      mensaje: 'Pedido procesado exitosamente. Recibirás un email de confirmación pronto.',
    });

  } catch (error) {
    // --- MANEJO CENTRALIZADO DE ERRORES ---
    console.error('❌ Error durante el flujo de pedido:', error);
    let errorMessage = 'Error desconocido al procesar el pedido.';
    let statusCode = 500;

    // Actualizar estado del pedido a CANCELADO si existe
    if (pedido_id) {
        console.log('🔄 Actualizando estado del pedido a CANCELADO...');
        await supabase
          .from('pedidos')
          .update({ estado: 'CANCELADO' })
          .eq('id', pedido_id)
          .maybeSingle(); 
    }

    if (error instanceof Error) {
        if (error.message === 'FALLO_DB_INICIO') {
            errorMessage = 'Error al registrar el pedido en la base de datos.';
        } else if (error.message === 'FALLO_PAGO') {
            errorMessage = 'El pago fue rechazado. Por favor, verifica tus datos de pago.';
            statusCode = 402; 
        } else if (error.message === 'FALLO_CONSULTA_PRODUCTOS') {
            errorMessage = 'Error al verificar los productos. Por favor, intenta nuevamente.';
            statusCode = 400; 
        } else if (error.message === 'FALLO_DB_DETALLES') {
            errorMessage = 'Error al guardar los detalles del pedido.';
            statusCode = 500;
        } else if (error.message.includes('no encontrado')) {
            errorMessage = error.message;
            statusCode = 404;
        }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        ordenId: ordenId || null 
      },
      { status: statusCode }
    );
  }
}