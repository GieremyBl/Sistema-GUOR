'use client';

import { Star, ShoppingCart, AlertCircle } from 'lucide-react';
import { Product } from '@/types/product';
import { useState } from 'react';
import { useCartStore } from '@/lib/store';

const MINIMUM_QUANTITY = 400; // Mínimo de unidades por producto

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(400);
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    setError('');
    
    if (quantity < MINIMUM_QUANTITY) {
      setError(`Mínimo ${MINIMUM_QUANTITY} unidades por producto`);
      return;
    }
    
    if (product.size && product.size.length > 0 && !selectedSize) {
      setError('Por favor selecciona una talla');
      return;
    }
    if (product.color && product.color.length > 0 && !selectedColor) {
      setError('Por favor selecciona un color');
      return;
    }
    
    addItem(product, quantity, selectedSize, selectedColor);
    setShowOptions(false);
    setQuantity(400);
    setSelectedSize('');
    setSelectedColor('');
  };

  return (
    <div className='bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group border border-[#f5f3f0]'>
      {/* Image */}
      <div className='relative w-full h-64 bg-[#f5f3f0] overflow-hidden'>
        <img
          src={product.image}
          alt={product.name}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
        />
        {!product.inStock && (
          <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
            <span className='text-white font-bold'>Agotado</span>
          </div>
        )}
        {product.inStock && (
          <div className='absolute top-4 right-4 bg-[#c97a97] text-white px-3 py-1 rounded-full text-sm font-semibold'>
            En Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className='p-5'>
        <p className='text-sm text-[#d4a574] font-semibold mb-1 uppercase tracking-wide'>
          {product.category}
        </p>
        <h3 className='font-bold text-gray-900 mb-2 line-clamp-2 text-lg'>
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className='flex items-center gap-1 mb-3'>
            <div className='flex items-center gap-0.5'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating || 0)
                      ? 'fill-[#d4a574] text-[#d4a574]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className='text-sm text-gray-600'>
              ({product.reviews})
            </span>
          </div>
        )}

        {/* Price */}
        <p className='text-2xl font-bold text-gray-900 mb-4'>
          S/. {product.price.toFixed(2)}
        </p>

        {/* Add to Cart Button */}
        {!showOptions ? (
          <button
            onClick={() => {
              setShowOptions(true);
              setError('');
            }}
            disabled={!product.inStock}
            className='w-full bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white py-2 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold'
          >
            <ShoppingCart className='w-4 h-4' />
            Solicitar Muestra
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
            {product.size && product.size.length > 0 && (
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Talla
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className='w-full border-2 border-[#d4a574] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]'
                >
                  <option value=''>Seleccionar talla</option>
                  {product.size.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Color Selection */}
            {product.color && product.color.length > 0 && (
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Color
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className='w-full border-2 border-[#d4a574] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]'
                >
                  <option value=''>Seleccionar color</option>
                  {product.color.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Cantidad (Mín. {MINIMUM_QUANTITY} unidades)
              </label>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setQuantity(Math.max(MINIMUM_QUANTITY, quantity - 50))}
                  className='px-3 py-2 border-2 border-[#d4a574] rounded-lg hover:bg-[#f5f3f0]'
                >
                  -
                </button>
                <input
                  type='number'
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(MINIMUM_QUANTITY, parseInt(e.target.value) || MINIMUM_QUANTITY))}
                  className='flex-1 text-center font-semibold border-2 border-[#d4a574] rounded-lg px-2 py-2 focus:outline-none'
                  min={MINIMUM_QUANTITY}
                />
                <button
                  onClick={() => setQuantity(quantity + 50)}
                  className='px-3 py-2 border-2 border-[#d4a574] rounded-lg hover:bg-[#f5f3f0]'
                >
                  +
                </button>
              </div>
              <p className='text-xs text-gray-500 mt-1'>Incrementos de 50 unidades</p>
            </div>

            {/* Buttons */}
            <div className='flex gap-2'>
              <button
                onClick={handleAddToCart}
                className='flex-1 bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white py-2 rounded-lg hover:shadow-lg transition font-semibold'
              >
                Agregar al Carrito
              </button>
              <button
                onClick={() => {
                  setShowOptions(false);
                  setSelectedSize('');
                  setSelectedColor('');
                  setQuantity(400);
                  setError('');
                }}
                className='flex-1 bg-[#f5f3f0] text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-semibold'
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
