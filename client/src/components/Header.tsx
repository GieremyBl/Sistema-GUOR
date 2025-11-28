'use client';

import { ShoppingCart, Search, Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className='w-full bg-white border-b-2 border-[#d4a574]'>
      <div className='max-w-7xl mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-3 group'>
            <div className='w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center shadow-md'>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="12" y="16" fontFamily="serif" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">G</text>
              </svg>
            </div>
            <div className='flex flex-col'>
              <span className='text-xs font-light tracking-widest text-[#8B6F47]'>MODAS Y ESTILOS</span>
              <span className='text-xl font-bold bg-gradient-to-r from-[#d4a574] to-[#c97a97] bg-clip-text text-transparent'>GUOR</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-8'>
            <Link href='/' className='text-gray-700 hover:text-[#d4a574] transition font-medium'>
              Inicio
            </Link>
            <Link href='/#productos' className='text-gray-700 hover:text-[#d4a574] transition font-medium'>
              Productos
            </Link>
            <Link href='/#' className='text-gray-700 hover:text-[#d4a574] transition font-medium'>
              Ofertas
            </Link>
            <Link href='/#' className='text-gray-700 hover:text-[#d4a574] transition font-medium'>
              Contacto
            </Link>
          </nav>

          {/* Search and Cart */}
          <div className='flex items-center gap-4'>
            <div className='hidden md:flex items-center bg-[#f5f3f0] rounded-full px-4 py-2'>
              <Search className='w-4 h-4 text-[#d4a574]' />
              <input
                type='text'
                placeholder='Buscar productos...'
                className='bg-transparent outline-none ml-2 w-40 text-sm'
              />
            </div>

            {/* Cart Icon */}
            <Link href='/carrito' className='relative'>
              <ShoppingCart className='w-6 h-6 text-gray-700 hover:text-[#d4a574] transition' />
              {totalItems > 0 && (
                <span className='absolute -top-2 -right-2 bg-[#c97a97] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Info and Logout */}
            {user && (
              <div className='hidden md:flex items-center gap-2'>
                <div className='text-right'>
                  <p className='text-xs font-semibold text-gray-700'>{user.nombre}</p>
                  <p className='text-xs text-gray-500'>{user.correo}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className='p-2 hover:bg-[#f5f3f0] rounded-lg transition'
                  title='Cerrar sesión'
                >
                  <LogOut className='w-5 h-5 text-gray-700 hover:text-[#d4a574]' />
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='md:hidden'
            >
              {isMenuOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className='md:hidden mt-4 flex flex-col gap-4 pb-4 border-t-2 border-[#f5f3f0] pt-4'>
            <Link href='/' className='text-gray-700 hover:text-[#d4a574] transition font-medium'>
              Inicio
            </Link>
            <Link href='/#productos' className='text-gray-700 hover:text-[#d4a574] transition font-medium'>
              Productos
            </Link>
            <Link href='/#' className='text-gray-700 hover:text-[#d4a574] transition font-medium'>
              Ofertas
            </Link>
            <Link href='/#' className='text-gray-700 hover:text-[#d4a574] transition font-medium'>
              Contacto
            </Link>
            <div className='flex items-center bg-[#f5f3f0] rounded-full px-4 py-2'>
              <Search className='w-4 h-4 text-[#d4a574]' />
              <input
                type='text'
                placeholder='Buscar...'
                className='bg-transparent outline-none ml-2 w-full text-sm'
              />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
