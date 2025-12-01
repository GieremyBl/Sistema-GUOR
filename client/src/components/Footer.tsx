'use client';

import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='mt-20' style={{ backgroundColor: '#fffbf2' }}>
      {/* Newsletter Section */}
      <div className='bg-gradient-to-r from-[#d4a574] to-[#c97a97] py-16'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <h3 className='text-3xl font-bold mb-4'>Suscríbete a nuestro Newsletter</h3>
          <p className='mb-8 text-white/90 text-lg'>
            Recibe ofertas exclusivas y las últimas tendencias directamente en tu correo
          </p>
          <div className='flex gap-3 max-w-md mx-auto flex-col sm:flex-row'>
            <input
              type='email'
              placeholder='tu@email.com'
              className='flex-1 px-6 py-3 rounded-full text-gray-900 outline-none focus:ring-2 focus:ring-white/50'
            />
            <button className='bg-white text-[#d4a574] px-8 py-3 rounded-full hover:bg-gray-100 transition font-bold whitespace-nowrap shadow-lg hover:shadow-xl'>
              Suscribir
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className='max-w-7xl mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12'>
          {/* About - CON LOGO */}
          <div className='space-y-4'>
            <Link href='/' className='inline-block'>
              <img 
                src='/logo-guor.png' 
                alt='GUOR - Modas y Estilos' 
                className='h-16 w-auto object-contain hover:opacity-90 transition-opacity'
              />
            </Link>
            <p className='text-gray-700 text-sm leading-relaxed'>
              Tu mejor aliado en moda femenina al por mayor desde 2020. Calidad premium y precios exclusivos para mayoristas.
            </p>
            <div className='flex gap-3 pt-2'>
              <a 
                href='https://facebook.com' 
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 bg-white hover:bg-[#d4a574] border border-gray-200 rounded-full flex items-center justify-center transition-all hover:scale-110 text-gray-700 hover:text-white'
              >
                <Facebook className='w-5 h-5' />
              </a>
              <a 
                href='https://instagram.com' 
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 bg-white hover:bg-[#d4a574] border border-gray-200 rounded-full flex items-center justify-center transition-all hover:scale-110 text-gray-700 hover:text-white'
              >
                <Instagram className='w-5 h-5' />
              </a>
              <a 
                href='https://twitter.com' 
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 bg-white hover:bg-[#d4a574] border border-gray-200 rounded-full flex items-center justify-center transition-all hover:scale-110 text-gray-700 hover:text-white'
              >
                <Twitter className='w-5 h-5' />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className='text-lg font-bold mb-6 text-gray-900'>Tienda</h4>
            <ul className='space-y-3'>
              <li>
                <Link href='/productos' className='text-gray-600 hover:text-[#d4a574] transition text-sm block'>
                  Nuevas Colecciones
                </Link>
              </li>
              <li>
                <Link href='/ofertas' className='text-gray-600 hover:text-[#d4a574] transition text-sm block'>
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href='/productos?sort=bestseller' className='text-gray-600 hover:text-[#d4a574] transition text-sm block'>
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href='/productos' className='text-gray-600 hover:text-[#d4a574] transition text-sm block'>
                  Todas las Categorías
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className='text-lg font-bold mb-6 text-gray-900'>Servicio al Cliente</h4>
            <ul className='space-y-3'>
              <li>
                <Link href='/contacto' className='text-gray-600 hover:text-[#d4a574] transition text-sm block'>
                  Contacto
                </Link>
              </li>
              <li>
                <Link href='/devoluciones' className='text-gray-600 hover:text-[#d4a574] transition text-sm block'>
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href='/envios' className='text-gray-600 hover:text-[#d4a574] transition text-sm block'>
                  Envíos
                </Link>
              </li>
              <li>
                <Link href='/privacidad' className='text-gray-600 hover:text-[#d4a574] transition text-sm block'>
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='text-lg font-bold mb-6 text-gray-900'>Contacto</h4>
            <ul className='space-y-4'>
              <li className='flex items-start gap-3 text-sm'>
                <MapPin className='w-5 h-5 mt-0.5 flex-shrink-0 text-[#d4a574]' />
                <span className='text-gray-600'>
                  Gamarra, Jr. Antonio Bazo 555<br />
                  La Victoria, Lima - Perú
                </span>
              </li>
              <li className='flex items-center gap-3 text-sm'>
                <Phone className='w-5 h-5 flex-shrink-0 text-[#d4a574]' />
                <a href='tel:+51987654321' className='text-gray-600 hover:text-[#d4a574] transition'>
                  +51 987 654 321
                </a>
              </li>
              <li className='flex items-center gap-3 text-sm'>
                <Mail className='w-5 h-5 flex-shrink-0 text-[#d4a574]' />
                <a href='mailto:ventas@guor.com' className='text-gray-600 hover:text-[#d4a574] transition'>
                  ventas@guor.com
                </a>
              </li>
            </ul>
            
            {/* Horario */}
            <div className='mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm'>
              <p className='text-xs text-gray-500 mb-1'>Horario de Atención</p>
              <p className='text-sm text-gray-900 font-medium'>Lun - Sáb: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-gray-300 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 text-sm'>
            <p className='text-gray-600 text-center md:text-left'>
              © 2025 Modas y Estilos GUOR S.A.C. Todos los derechos reservados.
            </p>
            <div className='flex flex-wrap justify-center gap-6 text-gray-600'>
              <Link href='/terminos' className='hover:text-[#d4a574] transition'>
                Términos de Servicio
              </Link>
              <Link href='/privacidad' className='hover:text-[#d4a574] transition'>
                Política de Privacidad
              </Link>
              <Link href='/cookies' className='hover:text-[#d4a574] transition'>
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}