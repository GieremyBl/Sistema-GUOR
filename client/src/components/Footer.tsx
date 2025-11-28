'use client';

import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-gray-900 text-white mt-20'>
      {/* Newsletter Section */}
      <div className='bg-gradient-to-r from-[#d4a574] to-[#c97a97] py-16'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <h3 className='text-3xl font-bold mb-4'>Suscríbete a nuestro Newsletter</h3>
          <p className='mb-8 text-white/80 text-lg'>
            Recibe ofertas exclusivas y las últimas tendencias directamente en tu correo
          </p>
          <div className='flex gap-2 max-w-md mx-auto flex-col sm:flex-row'>
            <input
              type='email'
              placeholder='Tu correo...'
              className='flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none'
            />
            <button className='bg-white text-[#d4a574] px-8 py-3 rounded-lg hover:bg-gray-100 transition font-bold whitespace-nowrap'>
              Suscribir
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className='max-w-7xl mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-12'>
          {/* About */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-10 h-10 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center'>
                <span className='text-white font-bold'>G</span>
              </div>
              <div>
                <h4 className='text-xs font-light tracking-widest'>MODAS Y ESTILOS</h4>
                <h4 className='text-lg font-bold text-[#d4a574]'>GUOR</h4>
              </div>
            </div>
            <p className='text-gray-400 text-sm mb-6 leading-relaxed'>
              Tu tienda en línea de moda femenina, con prendas exclusivas y tendencias actuales.
            </p>
            <div className='flex gap-4'>
              <a href='#' className='text-gray-400 hover:text-[#d4a574] transition'>
                <Facebook className='w-5 h-5' />
              </a>
              <a href='#' className='text-gray-400 hover:text-[#d4a574] transition'>
                <Instagram className='w-5 h-5' />
              </a>
              <a href='#' className='text-gray-400 hover:text-[#d4a574] transition'>
                <Twitter className='w-5 h-5' />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className='text-lg font-bold mb-6'>Tienda</h4>
            <ul className='space-y-3 text-gray-400 text-sm'>
              <li>
                <a href='#' className='hover:text-[#d4a574] transition'>
                  Nuevas Colecciones
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-[#d4a574] transition'>
                  Ofertas
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-[#d4a574] transition'>
                  Best Sellers
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-[#d4a574] transition'>
                  Categorías
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className='text-lg font-bold mb-6'>Servicio al Cliente</h4>
            <ul className='space-y-3 text-gray-400 text-sm'>
              <li>
                <a href='#' className='hover:text-[#d4a574] transition'>
                  Contacto
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-[#d4a574] transition'>
                  Devoluciones
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-[#d4a574] transition'>
                  Envíos
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-[#d4a574] transition'>
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='text-lg font-bold mb-6'>Contacto</h4>
            <ul className='space-y-4 text-gray-400 text-sm'>
              <li className='flex items-start gap-3'>
                <MapPin className='w-5 h-5 mt-0.5 flex-shrink-0 text-[#d4a574]' />
                <span>Calle Principal 123, Ciudad</span>
              </li>
              <li className='flex items-start gap-3'>
                <Phone className='w-5 h-5 mt-0.5 flex-shrink-0 text-[#d4a574]' />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className='flex items-start gap-3'>
                <Mail className='w-5 h-5 mt-0.5 flex-shrink-0 text-[#d4a574]' />
                <span>hola@guor.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-gray-800 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-gray-400 text-sm'>
              &copy; 2024 Modas y Estilos GUOR. Todos los derechos reservados.
            </p>
            <div className='flex gap-6 text-gray-400 text-sm'>
              <a href='#' className='hover:text-[#d4a574] transition'>
                Términos de Servicio
              </a>
              <a href='#' className='hover:text-[#d4a574] transition'>
                Política de Privacidad
              </a>
              <a href='#' className='hover:text-[#d4a574] transition'>
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
