'use client';

import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCarrito } from '@/context/CarritoContext';
import Image from 'next/image';
import { useEffect } from 'react';
import Link from 'next/link';

interface CarritoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CarritoSidebar({ isOpen, onClose }: CarritoSidebarProps) {
  const { items, eliminarItem, actualizarCantidad, limpiarCarrito, total, cantidadItems } = useCarrito();

  // Bloquear scroll cuando el carrito está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b'>
          <div className='flex items-center gap-3'>
            <ShoppingBag className='w-6 h-6 text-[#c97a97]' />
            <div>
              <h2 className='text-xl font-bold text-gray-900'>Mi Carrito</h2>
              <p className='text-sm text-gray-500'>{cantidadItems} artículos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition'
          >
            <X className='w-6 h-6 text-gray-600' />
          </button>
        </div>

        {/* Content */}
        <div className='flex flex-col h-[calc(100%-80px)]'>
          {/* Items List */}
          <div className='flex-1 overflow-y-auto p-6'>
            {items.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-center'>
                <ShoppingBag className='w-20 h-20 text-gray-300 mb-4' />
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  Tu carrito está vacío
                </h3>
                <p className='text-gray-500 mb-6'>
                  Agrega productos para comenzar tu compra
                </p>
                <button
                  onClick={onClose}
                  className='bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition'
                >
                  Ver Productos
                </button>
              </div>
            ) : (
              <div className='space-y-4'>
                {items.map((item) => (
                  <div
                    key={`${item.producto_id}-${item.talla}`}
                    className='flex gap-4 p-4 bg-gray-50 rounded-lg'
                  >
                    {/* Image */}
                    <div className='relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden'>
                      <Image
                        src={item.imagen}
                        alt={item.nombre}
                        fill
                        className='object-cover'
                      />
                    </div>

                    {/* Info */}
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-semibold text-gray-900 mb-1 line-clamp-2'>
                        {item.nombre}
                      </h3>
                      <p className='text-sm text-gray-500 mb-2'>
                        Talla: <span className='font-medium'>{item.talla}</span>
                      </p>
                      <p className='text-lg font-bold text-[#c97a97]'>
                        S/ {item.precio.toFixed(2)}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className='flex flex-col items-end justify-between'>
                      <button
                        onClick={() => eliminarItem(item.producto_id, item.talla)}
                        className='p-1 hover:bg-red-100 rounded transition'
                      >
                        <Trash2 className='w-4 h-4 text-red-500' />
                      </button>

                      <div className='flex items-center gap-2 bg-white rounded-lg border border-gray-200'>
                        <button
                          onClick={() =>
                            actualizarCantidad(item.producto_id, item.talla, item.cantidad - 10)
                          }
                          className='p-1 hover:bg-gray-100 rounded transition'
                          disabled={item.cantidad <= 400}
                        >
                          <Minus className='w-4 h-4' />
                        </button>
                        <span className='px-3 font-semibold text-sm min-w-[40px] text-center'>
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() =>
                            actualizarCantidad(item.producto_id, item.talla, item.cantidad + 10)
                          }
                          className='p-1 hover:bg-gray-100 rounded transition'
                          disabled={item.cantidad >= item.stock}
                        >
                          <Plus className='w-4 h-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                {items.length > 0 && (
                  <button
                    onClick={limpiarCarrito}
                    className='w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium'
                  >
                    Vaciar Carrito
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className='border-t bg-white p-6 space-y-4'>
              {/* Subtotal */}
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Subtotal:</span>
                <span className='font-semibold text-gray-900'>
                  S/ {total.toFixed(2)}
                </span>
              </div>

              {/* IGV */}
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>IGV (18%):</span>
                <span className='font-semibold text-gray-900'>
                  S/ {(total * 0.18).toFixed(2)}
                </span>
              </div>

              {/* Total with IGV */}
              <div className='flex justify-between items-center border-t pt-4'>
                <span className='font-bold text-gray-900'>Total:</span>
                <span className='text-2xl font-bold text-[#d4a574]'>
                  S/ {(total * 1.18).toFixed(2)}
                </span>
              </div>

              {/* Total Items */}
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>Total de unidades:</span>
                <span className='font-semibold text-gray-700'>{cantidadItems}</span>
              </div>

              {/* Checkout Button */}
                <Link
                href='/checkout'
                className='block w-full bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white py-4 rounded-lg font-bold hover:shadow-xl transition text-lg transform hover:scale-[1.02] active:scale-[0.98] text-center'
                >
                Proceder al Pago
                </Link>


              <p className='text-xs text-center text-gray-500'>
                Envío gratis en toda la ciudad
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}