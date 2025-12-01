'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [credentials, setCredentials] = useState({
    correo: '',
    ruc: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!credentials.correo || !credentials.ruc) {
        setError('Por favor completa todos los campos');
        setLoading(false);
        return;
      }

      login(credentials);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#f5f3f0] to-[#faf8f6] py-12 px-4 flex items-center'>
      <div className='max-w-md mx-auto w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='w-16 h-16 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center shadow-lg mx-auto mb-4'>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="12" y="18" fontFamily="serif" fontSize="16" fill="white" textAnchor="middle" fontWeight="bold">G</text>
            </svg>
          </div>
          <h1 className='text-4xl font-bold mb-2'>
            <span className='bg-gradient-to-r from-[#d4a574] to-[#c97a97] bg-clip-text text-transparent'>
              GUOR
            </span>
          </h1>
          <p className='text-gray-600 text-sm'>Inicia sesión como Cliente Mayorista</p>
        </div>

        {/* Form Card */}
        <div className='bg-white rounded-2xl shadow-lg p-8 border border-[#f5f3f0]'>
          {error && (
            <div className='mb-6 p-4 bg-red-50 border border-red-300 rounded-lg'>
              <p className='text-red-700 text-sm font-medium'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Correo */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Correo
              </label>
              <input
                type='email'
                name='correo'
                value={credentials.correo}
                onChange={handleChange}
                placeholder='tu@empresa.com'
                className='w-full px-4 py-3 border-2 border-[#e8dcd0] rounded-lg focus:outline-none focus:border-[#d4a574] transition text-base'
              />
            </div>

            {/* RUC */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                RUC
              </label>
              <input
                type='text'
                name='ruc'
                value={credentials.ruc}
                onChange={handleChange}
                placeholder='12345678901'
                maxLength={11}
                className='w-full px-4 py-3 border-2 border-[#e8dcd0] rounded-lg focus:outline-none focus:border-[#d4a574] transition text-base'
              />
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white py-3 rounded-lg hover:shadow-lg transition font-bold disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Register Link */}
          <div className='mt-6 text-center'>
            <p className='text-gray-600 text-sm'>
              ¿No tienes cuenta?{' '}
              <Link href='/register' className='text-[#d4a574] font-bold hover:text-[#c97a97] transition'>
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className='mt-8 bg-amber-50 border border-amber-300 rounded-lg p-4'>
          <p className='text-amber-900 text-xs font-medium mb-2'>💡 Para demostración:</p>
          <p className='text-amber-800 text-xs'>
            Puedes registrarte con cualquier correo y RUC para acceder como cliente mayorista.
          </p>
        </div>
      </div>
    </div>
  );
}
