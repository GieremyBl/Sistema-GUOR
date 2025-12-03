'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Award, Shirt } from 'lucide-react';
import Link from 'next/link';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);

    // Aquí puedes agregar lógica para enviar el correo
    try {
      // Simulamos envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEnviado(true);
      setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
      setTimeout(() => setEnviado(false), 5000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#faf8f6]'>
      {/* Header */}
      <div className='relative bg-gradient-to-r from-[#d4a574] to-[#c97a97] py-16 overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute inset-0 bg-gradient-to-br from-[#d4a574]/20 to-[#c97a97]/20'></div>
        </div>
        <div className='relative max-w-7xl mx-auto px-4 text-center text-white'>
          <h1 className='text-5xl font-bold mb-4'>Contáctanos</h1>
          <p className='text-xl opacity-95'>Estamos aquí para ayudarte con tus necesidades mayoristas</p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-16'>
        <div className='grid lg:grid-cols-3 gap-12 mb-16'>
          {/* Tarjeta 1: Email */}
          <div className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-[#f5f3f0] text-center'>
            <div className='w-16 h-16 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center mx-auto mb-6'>
              <Mail className='w-8 h-8 text-white' />
            </div>
            <h3 className='text-2xl font-bold mb-4 text-gray-900'>Email</h3>
            <p className='text-gray-600 mb-6'>
              Envía tus consultas y nos contactaremos en las próximas 24 horas
            </p>
            <a
              href='mailto:contacto@guor.com'
              className='inline-block bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white px-8 py-3 rounded-full hover:shadow-lg transition font-semibold'
            >
              contacto@guor.com
            </a>
          </div>

          {/* Tarjeta 2: WhatsApp */}
          <div className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-[#f5f3f0] text-center'>
            <div className='w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6'>
              <MessageCircle className='w-8 h-8 text-white' />
            </div>
            <h3 className='text-2xl font-bold mb-4 text-gray-900'>WhatsApp</h3>
            <p className='text-gray-600 mb-6'>
              Chatea directamente con nosotros para respuestas rápidas
            </p>
            <a
              href='https://wa.me/51987654321'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full transition font-semibold'
            >
              +51 987 654 321
            </a>
          </div>

          {/* Tarjeta 3: Teléfono */}
          <div className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-[#f5f3f0] text-center'>
            <div className='w-16 h-16 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center mx-auto mb-6'>
              <Phone className='w-8 h-8 text-white' />
            </div>
            <h3 className='text-2xl font-bold mb-4 text-gray-900'>Teléfono</h3>
            <p className='text-gray-600 mb-6'>
              Llámanos durante horario de oficina (Lunes a Viernes 9AM - 6PM)
            </p>
            <a
              href='tel:+51123456789'
              className='inline-block bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white px-8 py-3 rounded-full hover:shadow-lg transition font-semibold'
            >
              +51 123 456 789
            </a>
          </div>
        </div>

        {/* Sección sobre la empresa */}
        <div className='grid lg:grid-cols-2 gap-12 mb-16'>
          {/* Información sobre GUOR */}
          <div className='bg-white rounded-2xl p-8 shadow-lg border border-[#f5f3f0]'>
            <h2 className='text-3xl font-bold mb-6 text-gray-900'>Acerca de Nosotros</h2>
            <div className='space-y-6'>
              <div className='flex gap-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center flex-shrink-0'>
                  <Shirt className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h3 className='text-xl font-bold mb-2 text-gray-900'>Ropa Femenina Premium</h3>
                  <p className='text-gray-600'>
                    Ofrecemos una amplia colección de ropa femenina de alta calidad, diseñada para mayoristas que buscan las mejores tendencias del mercado.
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center flex-shrink-0'>
                  <Award className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h3 className='text-xl font-bold mb-2 text-gray-900'>Venta al Por Mayor</h3>
                  <p className='text-gray-600'>
                    Especializados en venta mayorista con precios especiales para negocios. Contamos con políticas flexibles y descuentos por volumen.
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center flex-shrink-0'>
                  <MapPin className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h3 className='text-xl font-bold mb-2 text-gray-900'>Ubicación</h3>
                  <p className='text-gray-600'>
                    Ubicados en Lima, Perú. Ofrecemos envíos a todo el país con opciones rápidas y seguras.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA hacia productos */}
            <Link
              href='/productos'
              className='inline-block mt-8 bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white px-8 py-3 rounded-full hover:shadow-lg transition font-semibold'
            >
              Ver Catálogo de Productos
            </Link>
          </div>

          {/* Formulario de contacto */}
          <div className='bg-white rounded-2xl p-8 shadow-lg border border-[#f5f3f0]'>
            <h2 className='text-3xl font-bold mb-6 text-gray-900'>Envíanos un Mensaje</h2>

            {enviado && (
              <div className='mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-xl'>
                <p className='text-green-700 font-semibold'>
                  ✓ Mensaje enviado correctamente. Nos pondremos en contacto pronto.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Nombre */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Nombre
                </label>
                <input
                  type='text'
                  name='nombre'
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder='Tu nombre completo'
                  className='w-full px-4 py-3 border-2 border-[#f5f3f0] rounded-lg focus:outline-none focus:border-[#d4a574] transition'
                />
              </div>

              {/* Email */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder='tu@email.com'
                  className='w-full px-4 py-3 border-2 border-[#f5f3f0] rounded-lg focus:outline-none focus:border-[#d4a574] transition'
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
                  className='w-full px-4 py-3 border-2 border-[#f5f3f0] rounded-lg focus:outline-none focus:border-[#d4a574] transition'
                />
              </div>

              {/* Asunto */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Asunto
                </label>
                <select
                  name='asunto'
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 border-2 border-[#f5f3f0] rounded-lg focus:outline-none focus:border-[#d4a574] transition'
                >
                  <option value=''>Selecciona un asunto</option>
                  <option value='consulta'>Consulta General</option>
                  <option value='mayorista'>Venta Mayorista</option>
                  <option value='producto'>Consulta sobre Productos</option>
                  <option value='soporte'>Soporte Técnico</option>
                  <option value='otro'>Otro</option>
                </select>
              </div>

              {/* Mensaje */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Mensaje
                </label>
                <textarea
                  name='mensaje'
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  placeholder='Cuéntanos cómo podemos ayudarte...'
                  rows={6}
                  className='w-full px-4 py-3 border-2 border-[#f5f3f0] rounded-lg focus:outline-none focus:border-[#d4a574] transition resize-none'
                />
              </div>

              {/* Botón de envío */}
              <button
                type='submit'
                disabled={cargando}
                className='w-full bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white py-4 rounded-lg hover:shadow-lg transition font-bold disabled:opacity-50 flex items-center justify-center gap-2'
              >
                {cargando ? 'Enviando...' : <>
                  <Send className='w-5 h-5' />
                  Enviar Mensaje
                </>}
              </button>
            </form>
          </div>
        </div>

        {/* Sección de beneficios */}
        <div className='bg-gradient-to-r from-[#d4a574]/10 to-[#c97a97]/10 rounded-2xl p-12 border border-[#d4a574]/20'>
          <h2 className='text-3xl font-bold mb-8 text-center text-gray-900'>
            ¿Por qué elegir a GUOR?
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='text-center'>
              <div className='w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-white font-bold text-xl'>✓</span>
              </div>
              <h3 className='font-bold text-gray-900 mb-2'>Calidad Premium</h3>
              <p className='text-gray-600 text-sm'>Prendas de la más alta calidad garantizada</p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-white font-bold text-xl'>✓</span>
              </div>
              <h3 className='font-bold text-gray-900 mb-2'>Precios Mayoristas</h3>
              <p className='text-gray-600 text-sm'>Los mejores precios del mercado</p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-white font-bold text-xl'>✓</span>
              </div>
              <h3 className='font-bold text-gray-900 mb-2'>Envío Rápido</h3>
              <p className='text-gray-600 text-sm'>Entrega a todo Lima en máximo 48h</p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#c97a97] rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-white font-bold text-xl'>✓</span>
              </div>
              <h3 className='font-bold text-gray-900 mb-2'>Asesoría Gratis</h3>
              <p className='text-gray-600 text-sm'>Equipo listo para asesorarte</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
