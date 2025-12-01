'use client';

import { FilterOptions } from '@/types/product';
import { categories } from '@/lib/products';
import { ChevronDown } from 'lucide-react';

interface ProductFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category === 'todos' ? undefined : category,
    });
  };

  const handlePriceChange = (value: string) => {
    const [min, max] = value.split('-').map(Number);
    onFiltersChange({
      ...filters,
      priceRange: [min, max],
    });
  };

  return (
    <aside className='w-full md:w-72 bg-white p-8 rounded-xl shadow-lg border border-[#f5f3f0]'>
      <h2 className='text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2'>
        <div className='w-1 h-6 bg-gradient-to-b from-[#d4a574] to-[#c97a97] rounded'></div>
        Filtros
      </h2>

      {/* Categories */}
      <div className='mb-10'>
        <h3 className='font-bold text-gray-900 mb-5 text-lg'>Categoría</h3>
        <div className='space-y-3'>
          {categories.map((cat) => (
            <label key={cat.id} className='flex items-center cursor-pointer group'>
              <input
                type='radio'
                name='category'
                value={cat.id}
                checked={
                  filters.category === undefined
                    ? cat.id === 'todos'
                    : filters.category === cat.id
                }
                onChange={() => handleCategoryChange(cat.id)}
                className='w-4 h-4 accent-[#d4a574] cursor-pointer'
              />
              <span className='ml-3 text-gray-700 group-hover:text-[#d4a574] transition font-medium'>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className='mb-10'>
        <h3 className='font-bold text-gray-900 mb-5 text-lg'>Rango de Precio</h3>
        <div className='space-y-3'>
          {[
            { label: 'Todas', value: '0-1000' },
            { label: 'Menos de $50', value: '0-50' },
            { label: '$50 - $100', value: '50-100' },
            { label: '$100 - $200', value: '100-200' },
            { label: 'Más de $200', value: '200-1000' },
          ].map((range) => (
            <label key={range.value} className='flex items-center cursor-pointer group'>
              <input
                type='radio'
                name='price'
                value={range.value}
                onChange={() => handlePriceChange(range.value)}
                className='w-4 h-4 accent-[#d4a574] cursor-pointer'
              />
              <span className='ml-3 text-gray-700 group-hover:text-[#d4a574] transition font-medium'>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() =>
          onFiltersChange({
            category: undefined,
            priceRange: undefined,
            size: undefined,
            color: undefined,
            search: undefined,
          })
        }
        className='w-full bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white py-3 rounded-lg hover:shadow-lg transition font-bold'
      >
        Limpiar Filtros
      </button>
    </aside>
  );
}
