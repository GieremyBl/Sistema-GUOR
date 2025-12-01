'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    ruc: '',
    correo: '',
    empresa: '',
    telefono: '',
    direccion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validar campos requeridos
      if (!formData.nombre || !formData.apellidos || !formData.ruc || !formData.correo) {
        setError('Por favor completa todos los campos requeridos');
        setLoading(false);
        return;
      }

      // Validar formato de RUC (11 dígitos en Perú)
      if (!/^\d{11}$/.test(formData.ruc)) {
        setError('El RUC debe tener 11 dígitos');
        setLoading(false);
        return;
      }

      // Validar correo
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
        setError('Por favor ingresa un correo válido');
        setLoading(false);
        return;
      }

      register(formData);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#f5f3f0] to-[#faf8f6] py-12 px-4'>
      <div className='max-w-md mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold mb-2'>
            <span className='bg-gradient-to-r from-[#d4a574] to-[#c97a97] bg-clip-text text-transparent'>
              Únete
            </span>
          </h1>
          <p className='text-gray-600'>Registro de Cliente Mayorista</p>
        </div>

        {/* Form Card */}
        <div className='bg-white rounded-2xl shadow-lg p-8 border border-[#f5f3f0]'>
          {error && (
            <div className='mb-6 p-4 bg-red-50 border border-red-300 rounded-lg'>
              <p className='text-red-700 text-sm font-medium'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Nombre */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Nombre *
              </label>
              <input
                type='text'
                name='nombre'
                value={formData.nombre}
                onChange={handleChange}
                placeholder='Juan'
                className='w-full px-4 py-3 border-2 border-[#e8dcd0] rounded-lg focus:outline-none focus:border-[#d4a574] transition'
              />
            </div>

            {/* Apellidos */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Apellidos *
              </label>
              <input
                type='text'
                name='apellidos'
                value={formData.apellidos}
                onChange={handleChange}
                placeholder='Pérez García'
                className='w-full px-4 py-3 border-2 border-[#e8dcd0] rounded-lg focus:outline-none focus:border-[#d4a574] transition'
              />
            </div>

            {/* RUC */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                RUC *
              </label>
              <input
                type='text'
                name='ruc'
                value={formData.ruc}
                onChange={handleChange}
                placeholder='12345678901'
                maxLength={11}
                className='w-full px-4 py-3 border-2 border-[#e8dcd0] rounded-lg focus:outline-none focus:border-[#d4a574] transition'
              />
              <p className='text-xs text-gray-500 mt-1'>11 dígitos</p>
            </div>

            {/* Correo */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Correo *
              </label>
              <input
                type='email'
                name='correo'
                value={formData.correo}
                onChange={handleChange}
                placeholder='juan@empresa.com'
                className='w-full px-4 py-3 border-2 border-[#e8dcd0] rounded-lg focus:outline-none focus:border-[#d4a574] transition'
              />
            </div>

            {/* Empresa */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Empresa
              </label>
              <input
                type='text'
                name='empresa'
                value={formData.empresa}
                onChange={handleChange}
                placeholder='Nombre de la empresa'
                className='w-full px-4 py-3 border-2 border-[#e8dcd0] rounded-lg focus:outline-none focus:border-[#d4a574] transition'
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Teléfono
              </label>
              <input
                type='tel'
                name='telefono'
                value={formData.telefono}
                onChange={handleChange}
                placeholder='+51 999 999 999'
                className='w-full px-4 py-3 border-2 border-[#e8dcd0] rounded-lg focus:outline-none focus:border-[#d4a574] transition'
              />
            </div>

            {/* Dirección */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Dirección
              </label>
              <textarea
                name='direccion'
                value={formData.direccion}
                onChange={handleChange}
                placeholder='Calle, número, distrito...'
                rows={3}
                className='w-full px-4 py-3 border-2 border-[#e8dcd0] rounded-lg focus:outline-none focus:border-[#d4a574] transition resize-none'
              />
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white py-3 rounded-lg hover:shadow-lg transition font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-6'
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Login Link */}
          <div className='mt-6 text-center'>
            <p className='text-gray-600 text-sm'>
              ¿Ya tienes cuenta?{' '}
              <Link href='/login' className='text-[#d4a574] font-bold hover:text-[#c97a97] transition'>
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
