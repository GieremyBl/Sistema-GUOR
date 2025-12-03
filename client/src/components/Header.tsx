// src/components/Header.tsx - Header con logo más grande
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Heart, Search, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { useCarrito } from '@/context/CarritoContext';
import CarritoSidebar from './CarritoSidebar';
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const { cantidadItems } = useCarrito();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [carritoOpen, setCarritoOpen] = useState(false);

  // Verificar si estamos en la página de productos (requiere auth)
  const isProductsPage = pathname === '/productos';

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsUserMenuOpen(false);
  };

  return (
    <>
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      {/* Barra superior de promoción */}
      <div className='bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white text-center py-2 px-4'>
        <p className='text-sm font-medium'>¡OFERTAS EXCLUSIVAS! Hasta 50% de descuento en toda la tienda</p>
      </div>

      <nav className='max-w-7xl mx-auto px-4 py-6'>
        <div className='flex items-center justify-between'>
          {/* Logo - MÁS GRANDE */}
          <Link href='/' className='flex items-center'>
            <img 
              src='/logo-guor.png' 
              alt='GUOR - Modas y Estilos' 
              className='h-20 md:h-24 w-auto object-contain hover:opacity-90 transition-opacity'
            />
          </Link>

          {/* Navegación Desktop */}
          <div className='hidden md:flex items-center gap-6'>
            <Link 
              href='/' 
              className={`font-medium transition ${pathname === '/' ? 'text-[#d4a574]' : 'text-gray-700 hover:text-[#d4a574]'}`}
            >
              Inicio
            </Link>
            <Link 
              href='/productos' 
              className={`font-medium transition ${pathname === '/productos' ? 'text-[#d4a574]' : 'text-gray-700 hover:text-[#d4a574]'}`}
            >
              Productos
            </Link>
            <Link 
              href='/ofertas' 
              className={`font-medium transition ${pathname === '/ofertas' ? 'text-[#d4a574]' : 'text-gray-700 hover:text-[#d4a574]'}`}
            >
              Ofertas
            </Link>
            <Link 
              href='/contacto' 
              className={`font-medium transition ${pathname === '/contacto' ? 'text-[#d4a574]' : 'text-gray-700 hover:text-[#d4a574]'}`}
            >
              Contacto
            </Link>
          </div>

          {/* Barra de búsqueda - Solo en páginas de productos */}
          {isProductsPage && (
            <div className='hidden lg:flex items-center flex-1 max-w-md mx-8'>
              <div className='relative w-full'>
                <input
                  type='text'
                  placeholder='Buscar productos...'
                  className='w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#d4a574]'
                />
                <Search className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
              </div>
            </div>
          )}

          {/* Iconos de acción */}
          <div className='flex items-center gap-3'>
            {/* Favoritos */}
            <button className='hidden md:block p-2 hover:bg-gray-100 rounded-full transition'>
              <Heart className='w-6 h-6 text-gray-700' />
            </button>

            {/* Carrito */}
            <button 
                onClick={() => setCarritoOpen(true)}
                className='relative p-2 hover:bg-gray-100 rounded-full transition'
              >
                <ShoppingCart className='w-6 h-6 text-gray-700' />
                {cantidadItems > 0 && (
                  <span className='absolute -top-1 -right-1 bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
                    {cantidadItems}
                  </span>
                )}
              </button>

            {/* Usuario */}
            <div className='relative'>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition'
              >
                <User className='w-6 h-6 text-gray-700' />
                {isAuthenticated && user && (
                  <span className='hidden md:block text-sm font-medium text-gray-700'>
                    {user.nombre || user.correo?.split('@')[0] || 'Usuario'}
                  </span>
                )}
              </button>

              {/* Menú desplegable */}
              {isUserMenuOpen && (
                <div className='absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2'>
                  {isAuthenticated && user ? (
                    <>
                      <div className='px-4 py-3 border-b border-gray-100'>
                        <p className='text-sm font-medium text-gray-900'>
                          {user.nombre} {user.apellidos}
                        </p>
                        <p className='text-xs text-gray-500'>{user.correo}</p>
                        {user.empresa && (
                          <p className='text-xs text-gray-400 mt-1'>{user.empresa}</p>
                        )}
                      </div>
                      
                      <Link
                        href='/perfil'
                        className='flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition'
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className='w-4 h-4' />
                        <span>Mi Perfil</span>
                      </Link>
                      
                      <Link
                        href='/pedidos'
                        className='flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition'
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingCart className='w-4 h-4' />
                        <span>Mis Pedidos</span>
                      </Link>
                      
                      <hr className='my-2' />
                      
                      <button
                        onClick={handleLogout}
                        className='w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition'
                      >
                        <LogOut className='w-4 h-4' />
                        <span>Cerrar Sesión</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href='/login'
                        className='block px-4 py-2 text-gray-700 hover:bg-gray-100 transition'
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Iniciar Sesión
                      </Link>
                      <Link
                        href='/register'
                        className='block px-4 py-2 text-[#d4a574] hover:bg-gray-100 transition font-medium'
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Registrarse
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='md:hidden p-2 hover:bg-gray-100 rounded-full transition'
            >
              <Menu className='w-6 h-6 text-gray-700' />
            </button>
          </div>
        </div>

        {/* Menú móvil expandido */}
        {isMobileMenuOpen && (
          <div className='md:hidden mt-4 pb-4 border-t pt-4'>
            <div className='flex flex-col gap-3'>
              <Link 
                href='/' 
                className='text-gray-700 hover:text-[#d4a574] transition font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href='/productos' 
                className='text-gray-700 hover:text-[#d4a574] transition font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Productos
              </Link>
              <Link 
                href='/ofertas' 
                className='text-gray-700 hover:text-[#d4a574] transition font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ofertas
              </Link>
              <Link 
                href='/contacto' 
                className='text-gray-700 hover:text-[#d4a574] transition font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
    {/* ✅ Carrito Sidebar */}
    <CarritoSidebar isOpen={carritoOpen} onClose={() => setCarritoOpen(false)} />
    </>
  );
}