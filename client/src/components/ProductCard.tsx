'use client';

import { Star, ShoppingCart, AlertCircle, Eye } from 'lucide-react';
import { Producto } from '@/types/database';
import { useState } from 'react';
import { useCarrito } from '@/context/CarritoContext';
import Image from 'next/image';
import Link from 'next/link';

const MINIMUM_QUANTITY = 400;

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(MINIMUM_QUANTITY);
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState('');
  const { agregarItem } = useCarrito();

  // Tallas disponibles (puedes traerlas de la BD o definirlas aquí)
  const tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    setError('');
    
    if (quantity < MINIMUM_QUANTITY) {
      setError(`Mínimo ${MINIMUM_QUANTITY} unidades por producto`);
      return;
    }

    if (quantity > producto.stock) {
      setError(`Solo hay ${producto.stock} unidades disponibles`);
      return;
    }
    
    if (!selectedSize) {
      setError('Por favor selecciona una talla');
      return;
    }
    
    agregarItem({
      producto_id: producto.id,
      nombre: producto.nombre,
      imagen: producto.imagen,
      precio: producto.precio,
      cantidad: quantity,
      talla: selectedSize,
      stock: producto.stock
    });

    // Resetear
    setShowOptions(false);
    setQuantity(MINIMUM_QUANTITY);
    setSelectedSize('');
    setError('');
  };

  const isInStock = producto.stock > 0 && producto.estado === 'activo';

  return (
    <div className='bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group border border-[#f5f3f0]'>
      {/* Image */}
      <div className='relative w-full h-64 bg-[#f5f3f0] overflow-hidden'>
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-300'
        />
        
        {!isInStock && (
          <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>Agotado</span>
          </div>
        )}
        
        {isInStock && (
          <>
            <div className='absolute top-4 right-4 bg-[#c97a97] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg'>
              En Stock
            </div>
            
            {producto.stock < 20 && (
              <div className='absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg'>
                Últimas unidades
              </div>
            )}
          </>
        )}

        {/* Overlay hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <div className='absolute bottom-4 left-0 right-0 flex gap-2 justify-center px-4'>
            <Link
              href={`/productos/${producto.id}`}
              className='flex-1 bg-white text-gray-900 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition'
            >
              <Eye className='w-4 h-4' />
              Ver Detalles
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-5'>
        <p className='text-sm text-[#d4a574] font-semibold mb-1 uppercase tracking-wide'>
          {producto.categorias?.nombre || 'Sin categoría'}
        </p>
        <h3 className='font-bold text-gray-900 mb-2 line-clamp-2 text-lg'>
          {producto.nombre}
        </h3>

        {/* Descripción corta */}
        {producto.descripcion && (
          <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
            {producto.descripcion}
          </p>
        )}

        {/* Rating - Placeholder (puedes agregar esto después) */}
        <div className='flex items-center gap-1 mb-3'>
          <div className='flex items-center gap-0.5'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className='w-3.5 h-3.5 fill-[#d4a574] text-[#d4a574]'
              />
            ))}
          </div>
          <span className='text-sm text-gray-600'>(Producto mayorista)</span>
        </div>

        {/* Price */}
        <div className='mb-4'>
          <p className='text-2xl font-bold text-gray-900'>
            S/ {producto.precio.toFixed(2)}
          </p>
          <p className='text-xs text-gray-500'>Por unidad (min. {MINIMUM_QUANTITY} unidades)</p>
        </div>

        {/* Stock info */}
        <div className='mb-4 p-2 bg-gray-50 rounded-lg'>
          <p className='text-sm text-gray-700'>
            Stock disponible: <span className='font-bold text-gray-900'>{producto.stock}</span> unidades
          </p>
        </div>

        {/* Add to Cart Button */}
        {!showOptions ? (
          <button
            onClick={() => {
              setShowOptions(true);
              setError('');
            }}
            disabled={!isInStock}
            className='w-full bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white py-2.5 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold disabled:from-gray-300 disabled:to-gray-300'
          >
            <ShoppingCart className='w-5 h-5' />
            Agregar al Carrito
          </button>
        ) : (
          <div className='space-y-3'>
            {/* Error Message */}
            {error && (
              <div className='p-3 bg-red-50 border border-red-300 rounded-lg flex gap-2'>
                <AlertCircle className='w-4 h-4 text-red-600 flex-shrink-0 mt-0.5' />
                <p className='text-red-700 text-sm font-medium'>{error}</p>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Talla *
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className='w-full border-2 border-[#d4a574] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]'
              >
                <option value=''>Seleccionar talla</option>
                {tallas.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Cantidad (Mín. {MINIMUM_QUANTITY} unidades)
              </label>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setQuantity(Math.max(MINIMUM_QUANTITY, quantity - 10))}
                  className='px-4 py-2 border-2 border-[#d4a574] rounded-lg hover:bg-[#f5f3f0] transition font-bold'
                >
                  -
                </button>
                <input
                  type='number'
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(MINIMUM_QUANTITY, parseInt(e.target.value) || MINIMUM_QUANTITY))}
                  className='flex-1 text-center font-semibold border-2 border-[#d4a574] rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a574]'
                  min={MINIMUM_QUANTITY}
                  max={producto.stock}
                />
                <button
                  onClick={() => setQuantity(Math.min(producto.stock, quantity + 10))}
                  className='px-4 py-2 border-2 border-[#d4a574] rounded-lg hover:bg-[#f5f3f0] transition font-bold'
                >
                  +
                </button>
              </div>
              <p className='text-xs text-gray-500 mt-1'>Incrementos de 10 unidades</p>
              <p className='text-sm font-semibold text-[#d4a574] mt-2'>
                Total: S/ {(producto.precio * quantity).toFixed(2)}
              </p>
            </div>

            {/* Buttons */}
            <div className='flex gap-2'>
              <button
                onClick={handleAddToCart}
                className='flex-1 bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white py-2.5 rounded-lg hover:shadow-lg transition font-semibold'
              >
                Agregar
              </button>
              <button
                onClick={() => {
                  setShowOptions(false);
                  setSelectedSize('');
                  setQuantity(MINIMUM_QUANTITY);
                  setError('');
                }}
                className='flex-1 bg-[#f5f3f0] text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition font-semibold'
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}