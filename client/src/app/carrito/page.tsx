'use client';

import { Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';

const MINIMUM_ORDER = 400; // Monto mínimo en soles

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice());

  const totalWithTax = getTotalPrice * 1.08;
  const isBelowMinimum = getTotalPrice < MINIMUM_ORDER;

  if (items.length === 0) {
    return (
      <div className='min-h-screen bg-[#faf8f6] py-12'>
        <div className='max-w-7xl mx-auto px-4'>
          <h1 className='text-4xl font-bold text-gray-900 mb-8'>Tu Carrito</h1>
          <div className='bg-white rounded-xl shadow-md p-12 text-center border border-[#f5f3f0]'>
            <p className='text-xl text-gray-600 mb-6'>
              Tu carrito está vacío
            </p>
            <Link
              href='/'
              className='inline-block bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white px-8 py-3 rounded-lg hover:shadow-lg transition font-semibold'
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#faf8f6] py-12'>
      <div className='max-w-7xl mx-auto px-4'>
        <h1 className='text-4xl font-bold text-gray-900 mb-8'>Tu Carrito</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Items */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-xl shadow-md overflow-hidden border border-[#f5f3f0]'>
              {items.map((item) => (
                <div
                  key={item.id}
                  className='border-b border-[#f5f3f0] last:border-b-0 p-6 flex gap-6'
                >
                  {/* Product Image */}
                  <div className='w-24 h-24 bg-[#f5f3f0] rounded-lg overflow-hidden flex-shrink-0'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-full h-full object-cover'
                    />
                  </div>

                  {/* Product Info */}
                  <div className='flex-1'>
                    <h3 className='font-bold text-gray-900 mb-1 text-lg'>
                      {item.name}
                    </h3>
                    {item.selectedSize && (
                      <p className='text-sm text-gray-600'>
                        Talla: <span className='font-semibold'>{item.selectedSize}</span>
                      </p>
                    )}
                    {item.selectedColor && (
                      <p className='text-sm text-gray-600'>
                        Color: <span className='font-semibold'>{item.selectedColor}</span>
                      </p>
                    )}
                    <p className='text-lg font-bold text-gray-900 mt-2'>
                      S/. {item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity and Remove */}
                  <div className='flex flex-col items-end justify-between'>
                    <button
                      onClick={() => removeItem(item.id)}
                      className='text-red-500 hover:text-red-700 transition'
                    >
                      <Trash2 className='w-5 h-5' />
                    </button>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className='px-2 py-1 border-2 border-[#d4a574] rounded hover:bg-[#f5f3f0]'
                      >
                        -
                      </button>
                      <span className='w-8 text-center font-semibold'>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className='px-2 py-1 border-2 border-[#d4a574] rounded hover:bg-[#f5f3f0]'
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-xl shadow-md p-8 sticky top-4 border border-[#f5f3f0]'>
              <h2 className='text-2xl font-bold text-gray-900 mb-8'>
                Resumen de Compra
              </h2>

              {/* Advertencia de monto mínimo */}
              {isBelowMinimum && (
                <div className='mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg'>
                  <div className='flex gap-3'>
                    <AlertCircle className='w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5' />
                    <div>
                      <p className='font-bold text-amber-900'>Monto mínimo requerido</p>
                      <p className='text-sm text-amber-800 mt-1'>
                        El pedido mínimo es de S/. {MINIMUM_ORDER.toFixed(2)}
                      </p>
                      <p className='text-sm text-amber-700 font-semibold mt-2'>
                        Te faltan: S/. {(MINIMUM_ORDER - getTotalPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className='space-y-4 mb-6 border-b-2 border-[#f5f3f0] pb-6'>
                <div className='flex justify-between text-gray-600'>
                  <span className='font-medium'>Subtotal</span>
                  <span className='font-semibold'>S/. {getTotalPrice.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span className='font-medium'>Envío</span>
                  <span className='font-semibold text-green-600'>Gratis</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span className='font-medium'>Impuestos (8%)</span>
                  <span className='font-semibold'>S/. {(getTotalPrice * 0.08).toFixed(2)}</span>
                </div>
              </div>

              <div className='flex justify-between text-2xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-[#f5f3f0]'>
                <span>Total</span>
                <span className='text-[#d4a574]'>S/. {totalWithTax.toFixed(2)}</span>
              </div>

              <button 
                onClick={() => router.push('/pago')}
                disabled={isBelowMinimum}
                className='w-full bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white py-4 rounded-lg hover:shadow-lg transition font-bold mb-3 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isBelowMinimum ? `Agregar S/. ${(MINIMUM_ORDER - getTotalPrice).toFixed(2)} más` : 'Proceder al Pago'}
              </button>

              <Link
                href='/'
                className='block text-center bg-[#f5f3f0] text-gray-700 py-4 rounded-lg hover:bg-gray-200 transition font-semibold border-2 border-[#d4a574]'
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
