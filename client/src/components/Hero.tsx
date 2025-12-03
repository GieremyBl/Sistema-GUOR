'use client';

import Link from 'next/link';
import { ArrowRight, Phone, MessageCircle, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Hero() {
  // Contador regresivo para ofertas (ejemplo: 3 días)
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className='relative bg-gradient-to-br from-gray-900 via-[#1a1a2e] to-black text-white overflow-hidden'>
      {/* Patrón de fondo animado */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute inset-0' style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 20px
          )`
        }}></div>
      </div>

      {/* Efectos de luz */}
      <div className='absolute top-20 right-20 w-96 h-96 bg-[#d4a574] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse'></div>
      <div className='absolute bottom-20 left-20 w-96 h-96 bg-[#c97a97] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse' style={{ animationDelay: '1s' }}></div>

      <div className='max-w-7xl mx-auto px-4 py-24 md:py-32 relative z-10'>
        <div className='text-center'>
          {/* Badge animado */}
          <div className='mb-6'>
            <span className='inline-block bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider animate-bounce'>
              ¡Oferta Exclusiva Mayoristas!
            </span>
          </div>

          {/* Título principal */}
          <h1 className='text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight'>
            <span className='block text-white drop-shadow-2xl'>MEGA</span>
            <span className='block bg-gradient-to-r from-[#d4a574] via-[#c97a97] to-[#d4a574] bg-clip-text text-transparent animate-gradient'>
              PROMOCIÓN
            </span>
          </h1>

          {/* Descuento destacado */}
          <div className='mb-8'>
            <p className='text-7xl md:text-9xl font-black bg-gradient-to-r from-[#d4a574] to-[#c97a97] bg-clip-text text-transparent drop-shadow-lg mb-4'>
              -50%
            </p>
            <p className='text-2xl md:text-3xl font-bold text-gray-300'>
              EN TODA LA TIENDA
            </p>
          </div>

          {/* Contador regresivo */}
          <div className='mb-8'>
            <p className='text-sm text-gray-400 mb-3'>⏰ La oferta termina en:</p>
            <div className='flex justify-center gap-4'>
              {[
                { value: timeLeft.days, label: 'Días' },
                { value: timeLeft.hours, label: 'Horas' },
                { value: timeLeft.minutes, label: 'Min' },
                { value: timeLeft.seconds, label: 'Seg' }
              ].map((item, i) => (
                <div key={i} className='bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px]'>
                  <p className='text-3xl font-bold text-white'>{String(item.value).padStart(2, '0')}</p>
                  <p className='text-xs text-gray-300'>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <p className='text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed'>
            Ropa femenina de calidad al por mayor. <span className='text-[#d4a574] font-semibold'>Desde 20 prendas</span> con los mejores precios del mercado.
          </p>

          {/* CTAs mejorados */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-8'>
            <Link
              href='/productos'
              className='group bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2'
            >
              Ver Catálogo Completo
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </Link>
            
            <a
              href='https://wa.me/51987654321?text=Hola,%20quiero%20información%20sobre%20precios%20mayoristas'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2'
            >
              <MessageCircle className='w-5 h-5' />
              WhatsApp Business
            </a>
          </div>

          {/* Botones secundarios */}
          <div className='flex flex-wrap justify-center gap-4 mb-12'>
            <Link
              href='/contacto'
              className='text-white border-2 border-white/30 hover:border-white/60 px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2'
            >
              <Phone className='w-4 h-4' />
              Llamar a Ventas
            </Link>
            
            <Link
              href='/catalogo.pdf'
              className='text-white border-2 border-white/30 hover:border-white/60 px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2'
            >
              <FileText className='w-4 h-4' />
              Descargar Catálogo PDF
            </Link>
          </div>

          {/* Badges informativos mejorados */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto'>
            {[
              { icon: '📦', title: 'Stock Permanente', desc: '+1000 productos' },
              { icon: '🚚', title: 'Envío a Todo Perú', desc: '24-48 horas' },
              { icon: '💰', title: 'Precios Mayoristas', desc: 'Desde 400 prendas' },
              { icon: '🎁', title: 'Descuentos', desc: 'Por volumen' }
            ].map((item, i) => (
              <div key={i} className='bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all'>
                <p className='text-3xl mb-2'>{item.icon}</p>
                <p className='text-sm font-semibold text-white'>{item.title}</p>
                <p className='text-xs text-gray-300'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}