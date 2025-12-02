'use client';

import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Simular suscripción (reemplazar con tu API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('¡Gracias por suscribirte! Pronto recibirás nuestras ofertas exclusivas.');
    setEmail('');
    setIsSubscribing(false);
  };

  return (
    <footer className='mt-20' style={{ backgroundColor: '#fffbf2' }}>
      {/* Newsletter Section - Mejorada */}
      <div className='relative overflow-hidden bg-gradient-to-r from-[#d4a574] via-[#c98b8b] to-[#c97a97] py-20'>
        {/* Decorative Elements */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2'></div>
          <div className='absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3'></div>
        </div>
        
        <div className='relative max-w-7xl mx-auto px-4 text-center'>
          <div className='inline-block mb-4 px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium'>
            ¡Ofertas Exclusivas!
          </div>
          <h3 className='text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg'>
            Suscríbete a nuestro Newsletter
          </h3>
          <p className='mb-10 text-white/95 text-lg md:text-xl max-w-2xl mx-auto'>
            Recibe ofertas exclusivas y las últimas tendencias directamente en tu correo
          </p>
          
          <form onSubmit={handleSubscribe} className='flex gap-3 max-w-xl mx-auto flex-col sm:flex-row'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='tu@email.com'
              required
              className='flex-1 px-6 py-4 rounded-full text-gray-900 outline-none focus:ring-4 focus:ring-white/30 shadow-xl placeholder:text-gray-600 text-base'
            />
            <button 
              type='submit'
              disabled={isSubscribing}
              className='bg-white text-[#d4a574] px-10 py-4 rounded-full hover:bg-gray-50 transition-all font-bold whitespace-nowrap shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-base'
            >
              {isSubscribing ? 'Suscribiendo...' : 'Suscribir'}
            </button>
          </form>
          
          <p className='mt-6 text-white/70 text-sm'>
            Tu información está segura. No compartimos datos con terceros.
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className='max-w-7xl mx-auto px-4 py-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
          {/* About - CON LOGO */}
          <div className='space-y-5'>
            <Link href='/' className='inline-block group'>
              <img 
                src='/logo-guor.png' 
                alt='GUOR - Modas y Estilos' 
                className='h-20 w-auto object-contain group-hover:opacity-80 transition-opacity'
              />
            </Link>
            <p className='text-gray-700 text-sm leading-relaxed'>
              Tu mejor aliado en moda femenina al por mayor desde 2020. Calidad premium y precios exclusivos para mayoristas.
            </p>
            
            {/* Social Media con mejor diseño */}
            <div>
              <p className='text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide'>Síguenos</p>
              <div className='flex gap-3'>
                <a 
                  href='https://facebook.com' 
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Facebook'
                  className='group w-11 h-11 bg-gradient-to-br from-white to-gray-50 hover:from-[#d4a574] hover:to-[#c97a97] border border-gray-200 hover:border-transparent rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg text-gray-700 hover:text-white'
                >
                  <Facebook className='w-5 h-5' />
                </a>
                <a 
                  href='https://instagram.com' 
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Instagram'
                  className='group w-11 h-11 bg-gradient-to-br from-white to-gray-50 hover:from-[#d4a574] hover:to-[#c97a97] border border-gray-200 hover:border-transparent rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg text-gray-700 hover:text-white'
                >
                  <Instagram className='w-5 h-5' />
                </a>
                <a 
                  href='https://twitter.com' 
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Twitter'
                  className='group w-11 h-11 bg-gradient-to-br from-white to-gray-50 hover:from-[#d4a574] hover:to-[#c97a97] border border-gray-200 hover:border-transparent rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg text-gray-700 hover:text-white'
                >
                  <Twitter className='w-5 h-5' />
                </a>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className='text-lg font-bold mb-6 text-gray-900 relative inline-block'>
              Tienda
              <span className='absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-[#d4a574] to-[#c97a97] rounded-full'></span>
            </h4>
            <ul className='space-y-3.5'>
              <li>
                <Link href='/productos' className='text-gray-600 hover:text-[#d4a574] transition-colors text-sm group flex items-center gap-2'>
                  <span className='w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#d4a574] transition-colors'></span>
                  Nuevas Colecciones
                </Link>
              </li>
              <li>
                <Link href='/ofertas' className='text-gray-600 hover:text-[#d4a574] transition-colors text-sm group flex items-center gap-2'>
                  <span className='w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#d4a574] transition-colors'></span>
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href='/productos?sort=bestseller' className='text-gray-600 hover:text-[#d4a574] transition-colors text-sm group flex items-center gap-2'>
                  <span className='w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#d4a574] transition-colors'></span>
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href='/productos' className='text-gray-600 hover:text-[#d4a574] transition-colors text-sm group flex items-center gap-2'>
                  <span className='w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#d4a574] transition-colors'></span>
                  Todas las Categorías
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className='text-lg font-bold mb-6 text-gray-900 relative inline-block'>
              Servicio al Cliente
              <span className='absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-[#d4a574] to-[#c97a97] rounded-full'></span>
            </h4>
            <ul className='space-y-3.5'>
              <li>
                <Link href='/contacto' className='text-gray-600 hover:text-[#d4a574] transition-colors text-sm group flex items-center gap-2'>
                  <span className='w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#d4a574] transition-colors'></span>
                  Contacto
                </Link>
              </li>
              <li>
                <Link href='/devoluciones' className='text-gray-600 hover:text-[#d4a574] transition-colors text-sm group flex items-center gap-2'>
                  <span className='w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#d4a574] transition-colors'></span>
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href='/envios' className='text-gray-600 hover:text-[#d4a574] transition-colors text-sm group flex items-center gap-2'>
                  <span className='w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#d4a574] transition-colors'></span>
                  Envíos
                </Link>
              </li>
              <li>
                <Link href='/privacidad' className='text-gray-600 hover:text-[#d4a574] transition-colors text-sm group flex items-center gap-2'>
                  <span className='w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#d4a574] transition-colors'></span>
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='text-lg font-bold mb-6 text-gray-900 relative inline-block'>
              Contacto
              <span className='absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-[#d4a574] to-[#c97a97] rounded-full'></span>
            </h4>
            <ul className='space-y-4'>
              <li className='flex items-start gap-3 text-sm group'>
                <div className='w-10 h-10 bg-gradient-to-br from-[#d4a574]/10 to-[#c97a97]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform'>
                  <MapPin className='w-5 h-5 text-[#d4a574]' />
                </div>
                <span className='text-gray-600 pt-1.5'>
                  Gamarra, Jr. Antonio Bazo 555<br />
                  La Victoria, Lima - Perú
                </span>
              </li>
              <li className='flex items-center gap-3 text-sm group'>
                <div className='w-10 h-10 bg-gradient-to-br from-[#d4a574]/10 to-[#c97a97]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform'>
                  <Phone className='w-5 h-5 text-[#d4a574]' />
                </div>
                <a href='tel:+51987654321' className='text-gray-600 hover:text-[#d4a574] transition-colors font-medium'>
                  +51 987 654 321
                </a>
              </li>
              <li className='flex items-center gap-3 text-sm group'>
                <div className='w-10 h-10 bg-gradient-to-br from-[#d4a574]/10 to-[#c97a97]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform'>
                  <Mail className='w-5 h-5 text-[#d4a574]' />
                </div>
                <a href='mailto:ventas@guor.com' className='text-gray-600 hover:text-[#d4a574] transition-colors font-medium'>
                  ventas@guor.com
                </a>
              </li>
            </ul>
            
            {/* Horario mejorado */}
            <div className='mt-6 p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
              <div className='flex items-center gap-2 mb-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-lg flex items-center justify-center'>
                  <Clock className='w-4 h-4 text-white' />
                </div>
                <p className='text-xs text-gray-500 font-semibold uppercase tracking-wide'>Horario de Atención</p>
              </div>
              <p className='text-sm text-gray-900 font-semibold'>Lun - Sáb: 9:00 AM - 6:00 PM</p>
              <p className='text-xs text-gray-500 mt-1'>Domingos: Cerrado</p>
            </div>
          </div>
        </div>

        {/* Divider mejorado */}
        <div className='relative mb-8'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-200'></div>
          </div>
          <div className='relative flex justify-center'>
            <span className='bg-[#fffbf2] px-4'>
              <div className='w-2 h-2 bg-gradient-to-r from-[#d4a574] to-[#c97a97] rounded-full'></div>
            </span>
          </div>
        </div>

        {/* Footer Bottom mejorado */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-6 text-sm'>
          <p className='text-gray-600 text-center md:text-left'>
            © 2025 <span className='font-semibold text-gray-800'>Modas y Estilos GUOR S.A.C.</span> Todos los derechos reservados.
          </p>
          <div className='flex flex-wrap justify-center gap-6 text-gray-600'>
            <Link href='/terminos' className='hover:text-[#d4a574] transition-colors relative group'>
              Términos de Servicio
              <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d4a574] transition-all group-hover:w-full'></span>
            </Link>
            <Link href='/privacidad' className='hover:text-[#d4a574] transition-colors relative group'>
              Política de Privacidad
              <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d4a574] transition-all group-hover:w-full'></span>
            </Link>
            <Link href='/cookies' className='hover:text-[#d4a574] transition-colors relative group'>
              Cookies
              <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d4a574] transition-all group-hover:w-full'></span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}