'use client';

import Link from 'next/link';
import { ShoppingCart, User, Heart, Search } from 'lucide-react';
import { useState } from 'react';
import Hero from '@/components/Hero';
import OfertasHero from '@/components/OfertasHero';
export default function HomePage() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className='min-h-screen'>
      {/* Hero Component */}
      <Hero />
      <OfertasHero />
      {/* Categorías */}
      <section className='py-20 bg-[#faf8f6]'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4'>
              <span className='bg-gradient-to-r from-[#d4a574] to-[#c97a97] bg-clip-text text-transparent'>
                Categorías Destacadas
              </span>
            </h2>
            <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
              Encuentra la ropa perfecta para tu negocio. Calidad premium al mejor precio mayorista.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              { 
                name: 'Blusas', 
                image: 'https://images.unsplash.com/photo-1595777707802-21b287123e49?w=500&h=500&fit=crop',
                count: '120+'
              },
              { 
                name: 'Vestidos', 
                image: 'https://images.unsplash.com/photo-1612336307429-8a88e8d08dbb?w=500&h=500&fit=crop',
                count: '85+'
              },
              { 
                name: 'Accesorios', 
                image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
                count: '95+'
              },
            ].map((category) => (
              <Link 
                key={category.name} 
                href='/productos'
                className='group relative overflow-hidden rounded-2xl h-80 shadow-lg hover:shadow-2xl transition-all duration-300'
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all'>
                  <div className='absolute bottom-0 left-0 right-0 p-6'>
                    <h3 className='text-3xl font-bold text-white mb-2'>{category.name}</h3>
                    <p className='text-white/90'>{category.count} productos</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              { icon: '🚚', title: 'Envío Gratis', desc: 'En compras mayores a S/200' },
              { icon: '💳', title: 'Pago Seguro', desc: 'Múltiples métodos de pago' },
              { icon: '⭐', title: 'Calidad Premium', desc: 'Productos de primera calidad' }
            ].map((benefit, i) => (
              <div key={i} className='text-center p-8 rounded-2xl bg-gradient-to-br from-[#faf8f6] to-white hover:shadow-xl transition-shadow'>
                <div className='w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center text-4xl'>
                  {benefit.icon}
                </div>
                <h3 className='text-xl font-bold mb-3 text-gray-800'>{benefit.title}</h3>
                <p className='text-gray-600'>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}