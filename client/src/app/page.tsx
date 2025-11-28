'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { mockProducts } from '@/lib/products';
import { FilterOptions, Product } from '@/types/product';
import { useAuthStore } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState('newest');

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen bg-[#faf8f6] py-12 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-600 mb-4'>Cargando...</p>
        </div>
      </div>
    );
  }

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Filter by category
    if (filters.category) {
      products = products.filter((p) => p.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange) {
      products = products.filter(
        (p) =>
          p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
      );
    }

    // Filter by search
    if (filters.search) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        break;
    }

    return products;
  }, [filters, sortBy]);

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-r from-[#f5f3f0] via-[#faf8f6] to-[#f5f3f0] py-20 overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 right-20 w-72 h-72 bg-[#d4a574] rounded-full mix-blend-multiply filter blur-3xl'></div>
          <div className='absolute -bottom-8 left-20 w-72 h-72 bg-[#c97a97] rounded-full mix-blend-multiply filter blur-3xl'></div>
        </div>

        <div className='max-w-7xl mx-auto px-4 relative z-10 text-center'>
          <h1 className='text-6xl font-bold mb-6'>
            <span className='bg-gradient-to-r from-[#d4a574] to-[#c97a97] bg-clip-text text-transparent'>Modas y Estilos</span>
          </h1>
          <h2 className='text-5xl font-light mb-4 text-gray-800'>GUOR</h2>
          <p className='text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed'>
            Descubre nuestra colección exclusiva de moda femenina con tendencias actuales y diseños elegantes
          </p>
          <button className='inline-block bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white px-8 py-4 rounded-lg hover:shadow-lg transition-shadow font-semibold'>
            Explorar Colección
          </button>
        </div>
      </section>

      {/* Categories Preview */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center mb-12'>Categorías Destacadas</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[
              { name: 'Blusas', image: 'https://images.unsplash.com/photo-1595777707802-21b287123e49?w=500&h=500&fit=crop' },
              { name: 'Vestidos', image: 'https://images.unsplash.com/photo-1612336307429-8a88e8d08dbb?w=500&h=500&fit=crop' },
              { name: 'Accesorios', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop' },
            ].map((category) => (
              <div key={category.name} className='relative group cursor-pointer overflow-hidden rounded-lg h-64'>
                <img
                  src={category.image}
                  alt={category.name}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                />
                <div className='absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center'>
                  <h3 className='text-3xl font-bold text-white'>{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Products Section */}
      <section className='py-16 bg-[#faf8f6]' id='productos'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex flex-col md:flex-row gap-8'>
            {/* Filters */}
            <ProductFilters filters={filters} onFiltersChange={setFilters} />

            {/* Products Section */}
            <div className='flex-1'>
              {/* Sorting */}
              <div className='flex items-center justify-between mb-8 flex-col sm:flex-row gap-4'>
                <div>
                  <p className='text-gray-600'>
                    Mostrando <span className='font-bold text-[#d4a574]'>{filteredProducts.length}</span> productos
                  </p>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='border-2 border-[#d4a574] rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#d4a574]'
                >
                  <option value='newest'>Más Recientes</option>
                  <option value='price-asc'>Precio: Menor a Mayor</option>
                  <option value='price-desc'>Precio: Mayor a Menor</option>
                  <option value='rating'>Mejor Calificados</option>
                </select>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredProducts.map((product, index) => (
                    <div key={product.id} style={{ animationDelay: `${index * 100}ms` }} className='animate-fade-in-up'>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='bg-white rounded-lg shadow-md p-12 text-center'>
                  <p className='text-xl text-gray-600'>
                    No encontramos productos que coincidan con tus filtros
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className='py-16 bg-gradient-to-r from-[#d4a574] to-[#c97a97]'>
        <div className='max-w-4xl mx-auto px-4 text-center text-white'>
          <h2 className='text-4xl font-bold mb-4'>Suscríbete a Nuestro Newsletter</h2>
          <p className='text-lg mb-8 opacity-90'>
            Recibe ofertas exclusivas y las últimas colecciones directamente en tu correo
          </p>
          <div className='flex gap-2 max-w-md mx-auto'>
            <input
              type='email'
              placeholder='Tu correo...'
              className='flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none'
            />
            <button className='bg-white text-[#d4a574] px-8 py-3 rounded-lg hover:bg-[#f5f3f0] transition font-bold'>
              Suscribir
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}