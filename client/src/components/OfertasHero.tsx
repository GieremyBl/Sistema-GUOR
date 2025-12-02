'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';

interface Oferta {
  id: number;
  imagen: string;
  titulo: string;
  subtitulo: string;
  descuento: string;
  link: string;
  bgColor: string;
}

export default function OfertasHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const ofertas: Oferta[] = [
    {
      id: 1,
      imagen: '/ofertas/sale-50-pink.jpg',
      titulo: 'MEGA PROMOCIÓN',
      subtitulo: 'Esta temporada',
      descuento: '50% OFF',
      link: '/ofertas',
      bgColor: 'from-pink-100 to-rose-100'
    },
    {
      id: 2,
      imagen: '/ofertas/flash-sale.jpg',
      titulo: 'FLASH SALE',
      subtitulo: 'Ofertas relámpago',
      descuento: 'Hasta 50% OFF',
      link: '/ofertas',
      bgColor: 'from-amber-50 to-orange-50'
    },
    {
      id: 3,
      imagen: '/ofertas/shopping-bags.jpg',
      titulo: 'NUEVA COLECCIÓN',
      subtitulo: 'Tendencias 2025',
      descuento: 'Desde 20 prendas',
      link: '/productos',
      bgColor: 'from-amber-50 to-yellow-50'
    },
    {
      id: 4,
      imagen: '/ofertas/leather-jacket.jpg',
      titulo: 'ESTILO URBANO',
      subtitulo: 'Looks modernos',
      descuento: 'Precios mayoristas',
      link: '/productos',
      bgColor: 'from-gray-100 to-slate-100'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ofertas.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + ofertas.length) % ofertas.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className='relative w-full overflow-hidden bg-gradient-to-br from-[#fffbf2] to-white'>
      {/* Carrusel Principal */}
      <div className='relative h-[600px] md:h-[700px]'>
        {ofertas.map((oferta, index) => (
          <div
            key={oferta.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <div className={`h-full bg-gradient-to-br ${oferta.bgColor}`}>
              <div className='max-w-7xl mx-auto h-full px-4 flex items-center'>
                <div className='grid md:grid-cols-2 gap-8 items-center w-full'>
                  {/* Contenido de texto */}
                  <div className='space-y-6 text-center md:text-left order-2 md:order-1'>
                    <div className='inline-block px-4 py-2 bg-gradient-to-r from-[#d4a574] to-[#c97a97] rounded-full text-white text-sm font-semibold shadow-lg'>
                      <Sparkles className='inline w-4 h-4 mr-2' />
                      Oferta Exclusiva Mayoristas
                    </div>
                    
                    <h1 className='text-5xl md:text-7xl font-bold text-gray-900 leading-tight'>
                      {oferta.titulo}
                    </h1>
                    
                    <p className='text-2xl md:text-3xl text-gray-700 font-light'>
                      {oferta.subtitulo}
                    </p>
                    
                    <div className='text-6xl md:text-8xl font-black bg-gradient-to-r from-[#d4a574] to-[#c97a97] bg-clip-text text-transparent'>
                      {oferta.descuento}
                    </div>
                    
                    <p className='text-gray-600 text-lg'>
                      Ropa femenina de calidad al por mayor. Desde 20 prendas con los mejores precios del mercado.
                    </p>
                    
                    <div className='flex gap-4 justify-center md:justify-start pt-4'>
                      <Link
                        href={oferta.link}
                        className='group px-8 py-4 bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2'
                      >
                        <ShoppingBag className='w-5 h-5' />
                        Ver Ofertas
                        <ChevronRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                      </Link>
                      
                      <Link
                        href='/productos'
                        className='px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-gray-200'
                      >
                        Ver Catálogo
                      </Link>
                    </div>
                  </div>
                  
                  {/* Imagen */}
                  <div className='relative h-[400px] md:h-[600px] order-1 md:order-2 overflow-hidden rounded-3xl shadow-2xl'>
                    <Image
                      src={oferta.imagen}
                      alt={oferta.titulo}
                      fill
                      className='object-contain'
                      priority={index === 0}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Controles de navegación */}
        <button
          onClick={prevSlide}
          className='absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110 z-10'
          aria-label='Anterior'
        >
          <ChevronLeft className='w-6 h-6 text-gray-900' />
        </button>
        
        <button
          onClick={nextSlide}
          className='absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110 z-10'
          aria-label='Siguiente'
        >
          <ChevronRight className='w-6 h-6 text-gray-900' />
        </button>
        
        {/* Indicadores */}
        <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10'>
          {ofertas.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? 'w-12 h-3 bg-gradient-to-r from-[#d4a574] to-[#c97a97]'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/80'
              } rounded-full`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Sección de destacados debajo del hero */}
      <div className='max-w-7xl mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-gradient-to-br from-white to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-pink-100'>
            <div className='w-16 h-16 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-2xl flex items-center justify-center mb-4'>
              <ShoppingBag className='w-8 h-8 text-white' />
            </div>
            <h3 className='text-xl font-bold mb-2 text-gray-900'>Desde 20 Prendas</h3>
            <p className='text-gray-600'>Precios especiales para mayoristas con pedidos mínimos accesibles</p>
          </div>
          
          <div className='bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-purple-100'>
            <div className='w-16 h-16 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-2xl flex items-center justify-center mb-4'>
              <Sparkles className='w-8 h-8 text-white' />
            </div>
            <h3 className='text-xl font-bold mb-2 text-gray-900'>Calidad Premium</h3>
            <p className='text-gray-600'>Ropa de moda femenina con los mejores materiales y acabados</p>
          </div>
          
          <div className='bg-gradient-to-br from-white to-amber-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-amber-100'>
            <div className='w-16 h-16 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-2xl flex items-center justify-center mb-4'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h3 className='text-xl font-bold mb-2 text-gray-900'>Mejores Precios</h3>
            <p className='text-gray-600'>Descuentos exclusivos y ofertas constantes para mayoristas</p>
          </div>
        </div>
      </div>
    </section>
  );
}