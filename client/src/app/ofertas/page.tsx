'use client';

import { useState, useEffect } from 'react';
import { ProductosService } from '@/services/productos.service';
import { Producto } from '@/types/database';
import { useCarrito } from '@/context/CarritoContext';
import { ShoppingBag, Sparkles, Tag, AlertCircle, Loader2, X } from 'lucide-react';
import Link from 'next/link';

export default function OfertasPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [cantidadModal, setCantidadModal] = useState(400);
  const [tallaModal, setTallaModal] = useState('');

  const { agregarItem, cantidadItems } = useCarrito();

  // Cargar productos
  useEffect(() => {
    async function cargarProductos() {
      try {
        const data = await ProductosService.obtenerProductos({});
        setProductos(data || []);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    }
    cargarProductos();
  }, []);

  // Calcular descuento
  const calcularDescuento = (cantidad: number): { descuento: number; tipo: string } => {
    if (cantidad >= 7) {
      return {
        descuento: 0,
        tipo: '¡1 GRATIS a S/10!'
      };
    } else if (cantidad >= 3) {
      return { descuento: 0.1, tipo: '10% OFF' };
    } else if (cantidad >= 2) {
      return { descuento: 0.1, tipo: '10% OFF' };
    }
    return { descuento: 0, tipo: 'Sin descuento' };
  };

  const handleAgregarAlCarrito = (producto: Producto) => {
    if (cantidadModal < 400) {
      alert('El mínimo de compra es 400 prendas');
      return;
    }

    if (!tallaModal) {
      alert('Por favor selecciona una talla');
      return;
    }

    const descuentoInfo = calcularDescuento(cantidadModal);
    let precioFinal = producto.precio * cantidadModal;

    if (descuentoInfo.tipo === '10% OFF') {
      precioFinal = producto.precio * cantidadModal * (1 - descuentoInfo.descuento);
    } else if (descuentoInfo.tipo === '¡1 GRATIS a S/10!') {
      precioFinal = producto.precio * (cantidadModal - 1) + 10;
    }

    const precioUnitario = precioFinal / cantidadModal;

    agregarItem({
      producto_id: producto.id,
      nombre: producto.nombre,
      imagen: producto.imagen,
      precio: precioUnitario,
      cantidad: cantidadModal,
      talla: tallaModal,
      color: '',
      stock: producto.stock,
      notas: `${descuentoInfo.tipo} - Compra de oferta`
    });

    setProductoSeleccionado(null);
    setCantidadModal(400);
    setTallaModal('');
  };

  return (
    <div className='min-h-screen bg-[#faf8f6]'>
      {/* Header */}
      <div className='relative bg-gradient-to-r from-[#d4a574] to-[#c97a97] py-16'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute inset-0 bg-gradient-to-br from-[#d4a574]/20 to-[#c97a97]/20'></div>
        </div>
        <div className='relative max-w-7xl mx-auto px-4 text-center text-white'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <Sparkles className='w-8 h-8' />
            <h1 className='text-5xl font-bold'>Ofertas Especiales Mayoristas</h1>
            <Sparkles className='w-8 h-8' />
          </div>
          <p className='text-xl opacity-95'>Descuentos exclusivos en compras por cantidad</p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-12'>
        {/* Información de ofertas disponibles */}
        <div className='bg-white rounded-2xl p-8 shadow-lg border border-[#f5f3f0] mb-12'>
          <h2 className='text-2xl font-bold mb-6 text-gray-900'>Cómo funcionan nuestras ofertas</h2>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center mx-auto mb-4'>
                <Tag className='w-8 h-8 text-white' />
              </div>
              <h3 className='font-bold text-lg mb-2 text-gray-900'>2 o 3 Modelos</h3>
              <p className='text-gray-600 font-semibold text-2xl mb-2'>10% OFF</p>
              <p className='text-gray-600 text-sm'>Descuento en cada modelo</p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center mx-auto mb-4'>
                <Tag className='w-8 h-8 text-white' />
              </div>
              <h3 className='font-bold text-lg mb-2 text-gray-900'>3+ Modelos</h3>
              <p className='text-gray-600 font-semibold text-2xl mb-2'>10% OFF</p>
              <p className='text-gray-600 text-sm'>Mayor descuento en volumen</p>
            </div>

            <div className='text-center bg-amber-50 p-4 rounded-xl border border-amber-200'>
              <div className='w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <ShoppingBag className='w-8 h-8 text-white' />
              </div>
              <h3 className='font-bold text-lg mb-2 text-gray-900'>7+ Modelos</h3>
              <p className='text-amber-600 font-bold text-xl mb-2'>¡1 GRATIS!</p>
              <p className='text-gray-600 text-sm'>Un modelo a solo S/10.00</p>
            </div>
          </div>
        </div>

        {/* Información de mínimo */}
        <div className='bg-blue-50 border-2 border-blue-300 rounded-2xl p-6 mb-12'>
          <div className='flex gap-3'>
            <AlertCircle className='w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5' />
            <div>
              <p className='font-bold text-blue-900'>Mínimo de compra: 400 prendas</p>
              <p className='text-sm text-blue-800 mt-1'>
                El pedido mínimo es de 400 unidades por producto. Cada oferta se calcula por producto individual.
              </p>
            </div>
          </div>
        </div>

        {/* Productos */}
        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <Loader2 className='w-8 h-8 animate-spin text-[#d4a574]' />
          </div>
        ) : productos.length === 0 ? (
          <div className='bg-white rounded-2xl p-12 text-center shadow-lg border border-[#f5f3f0]'>
            <AlertCircle className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-xl text-gray-600'>No hay productos disponibles</p>
          </div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {productos.map((producto) => (
              <div key={producto.id} className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border border-[#f5f3f0]'>
                {/* Imagen del producto */}
                <div className='relative h-64 bg-[#f5f3f0] overflow-hidden'>
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className='w-full h-full object-cover hover:scale-110 transition-transform duration-300'
                  />
                  {producto.stock > 0 && (
                    <div className='absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold text-sm'>
                      Stock: {producto.stock}
                    </div>
                  )}
                </div>

                {/* Información del producto */}
                <div className='p-6'>
                  <h3 className='text-xl font-bold mb-2 text-gray-900 line-clamp-2'>
                    {producto.nombre}
                  </h3>
                  
                  {/* Descripción */}
                  <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
                    {producto.descripcion || 'Producto de calidad premium para venta mayorista'}
                  </p>

                  {/* Precio */}
                  <div className='mb-6 pb-6 border-b border-[#f5f3f0]'>
                    <p className='text-3xl font-bold text-[#d4a574] mb-1'>
                      S/. {producto.precio.toFixed(2)}
                    </p>
                    <p className='text-gray-600 text-sm'>Precio por unidad (mín. 400 unidades)</p>
                  </div>

                  {/* Botón para ver detalles */}
                  <button
                    onClick={() => {
                      setProductoSeleccionado(producto);
                      setCantidadModal(400);
                      setTallaModal('');
                    }}
                    className='w-full px-6 py-3 bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white rounded-lg hover:shadow-lg transition font-semibold'
                  >
                    Ver Detalles y Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalles y Compra */}
      {productoSeleccionado && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            {/* Header del Modal */}
            <div className='sticky top-0 bg-white border-b flex items-center justify-between p-6'>
              <h2 className='text-2xl font-bold text-gray-900'>Detalles del Producto</h2>
              <button
                onClick={() => setProductoSeleccionado(null)}
                className='p-2 hover:bg-gray-100 rounded-full transition'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className='p-6 space-y-6'>
              {/* Imagen grande */}
              <div className='h-80 bg-[#f5f3f0] rounded-xl overflow-hidden'>
                <img
                  src={productoSeleccionado.imagen}
                  alt={productoSeleccionado.nombre}
                  className='w-full h-full object-cover'
                />
              </div>

              {/* Info */}
              <div>
                <h3 className='text-3xl font-bold mb-3 text-gray-900'>
                  {productoSeleccionado.nombre}
                </h3>
                <p className='text-gray-600 text-lg mb-4'>
                  {productoSeleccionado.descripcion || 'Producto de calidad premium para venta mayorista'}
                </p>

                {/* Precio y Stock */}
                <div className='bg-[#faf8f6] p-6 rounded-xl mb-6'>
                  <p className='text-gray-600 mb-2'>Precio unitario</p>
                  <p className='text-4xl font-bold text-[#d4a574] mb-4'>
                    S/. {productoSeleccionado.precio.toFixed(2)}
                  </p>
                  <p className='text-green-600 font-semibold'>
                    Stock disponible: {productoSeleccionado.stock} unidades
                  </p>
                </div>

                {/* Talla */}
                <div className='mb-6'>
                  <label className='block text-sm font-bold text-gray-700 mb-3'>
                    Seleccionar Talla *
                  </label>
                  <select
                    value={tallaModal}
                    onChange={(e) => setTallaModal(e.target.value)}
                    className='w-full px-4 py-3 border-2 border-[#d4a574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c97a97]'
                  >
                    <option value=''>Elige una talla</option>
                    <option value='XS'>XS</option>
                    <option value='S'>S</option>
                    <option value='M'>M</option>
                    <option value='L'>L</option>
                    <option value='XL'>XL</option>
                    <option value='XXL'>XXL</option>
                  </select>
                </div>

                {/* Cantidad */}
                <div className='mb-6'>
                  <label className='block text-sm font-bold text-gray-700 mb-3'>
                    Cantidad (mínimo 400 prendas)
                  </label>
                  <div className='flex gap-4 items-end'>
                    <div className='flex-1'>
                      <input
                        type='number'
                        min='400'
                        step='10'
                        value={cantidadModal}
                        onChange={(e) => setCantidadModal(Math.max(400, parseInt(e.target.value) || 400))}
                        className='w-full px-4 py-3 border-2 border-[#d4a574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c97a97]'
                      />
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => setCantidadModal(Math.max(400, cantidadModal - 10))}
                        className='px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition'
                      >
                        -
                      </button>
                      <button
                        onClick={() => setCantidadModal(cantidadModal + 10)}
                        className='px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition'
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resumen de precio con descuento */}
                {(() => {
                  const descuentoInfo = calcularDescuento(cantidadModal);
                  let precioFinal = productoSeleccionado.precio * cantidadModal;
                  let ahorroTotal = 0;

                  if (descuentoInfo.tipo === '10% OFF') {
                    ahorroTotal = productoSeleccionado.precio * cantidadModal * 0.1;
                    precioFinal -= ahorroTotal;
                  } else if (descuentoInfo.tipo === '¡1 GRATIS a S/10!') {
                    precioFinal = productoSeleccionado.precio * (cantidadModal - 1) + 10;
                    ahorroTotal = productoSeleccionado.precio;
                  }

                  const igv = precioFinal * 0.18;
                  const totalConIGV = precioFinal + igv;

                  return (
                    <div className='bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-6 space-y-3'>
                      <div className='flex justify-between'>
                        <span className='text-gray-700 font-semibold'>Subtotal ({cantidadModal} x S/. {productoSeleccionado.precio.toFixed(2)}):</span>
                        <span className='line-through text-gray-500'>S/. {(productoSeleccionado.precio * cantidadModal).toFixed(2)}</span>
                      </div>

                      {ahorroTotal > 0 && (
                        <div className='flex justify-between text-green-600 font-bold'>
                          <span>{descuentoInfo.tipo}</span>
                          <span>-S/. {ahorroTotal.toFixed(2)}</span>
                        </div>
                      )}

                      <div className='flex justify-between border-t border-blue-300 pt-3'>
                        <span className='text-gray-700 font-semibold'>Precio sin IGV:</span>
                        <span className='font-bold text-lg'>S/. {precioFinal.toFixed(2)}</span>
                      </div>

                      <div className='flex justify-between'>
                        <span className='text-gray-700 font-semibold'>IGV (18%):</span>
                        <span className='font-bold'>S/. {igv.toFixed(2)}</span>
                      </div>

                      <div className='flex justify-between border-t-2 border-blue-300 pt-3'>
                        <span className='text-gray-900 font-bold text-lg'>Total a pagar:</span>
                        <span className='text-[#d4a574] font-bold text-2xl'>S/. {totalConIGV.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Botones */}
                <div className='space-y-3'>
                  <button
                    onClick={() => handleAgregarAlCarrito(productoSeleccionado)}
                    className='w-full px-6 py-4 bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white rounded-lg hover:shadow-lg transition font-bold text-lg flex items-center justify-center gap-2'
                  >
                    <ShoppingBag className='w-5 h-5' />
                    Agregar al Carrito
                  </button>

                  <button
                    onClick={() => setProductoSeleccionado(null)}
                    className='w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold'
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
