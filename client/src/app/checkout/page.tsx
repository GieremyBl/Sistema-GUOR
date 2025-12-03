'use client';

import { useState, useEffect } from 'react';
import { useCarrito } from '@/context/CarritoContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Building,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, total, cantidadItems, limpiarCarrito } = useCarrito();
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Datos, 2: Pago, 3: Confirmación

  // Datos del formulario
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    empresa: '',
    ruc: '',
    
    // Dirección de envío
    direccion: '',
    ciudad: '',
    distrito: '',
    referencia: '',
    codigoPostal: '',
    
    // Notas adicionales
    notas: '',
  });

  // Método de pago
  const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'yape' | 'plin' | 'transferencia'>('tarjeta');

  // Datos de tarjeta
  const [cardData, setCardData] = useState({
    numero: '',
    nombre: '',
    expiracion: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);
  const [ordenId, setOrdenId] = useState<string>('');

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0 && step !== 3) {
      router.push('/productos');
    }
  }, [items, router, step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    // Formatear número de tarjeta
    if (name === 'numero') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    // Formatear expiración
    if (name === 'expiracion') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
    }

    setCardData({
      ...cardData,
      [name]: value,
    });
  };

  const calcularEnvio = () => {
    // Envío gratis para compras mayoristas
    return 0;
  };

  const totalConEnvio = total + calcularEnvio();

  const handleSubmitDatos = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitPago = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Aquí iría la integración con tu API de pagos
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total: totalConEnvio,
          metodoPago,
          datosCliente: formData,
          datosPago: metodoPago === 'tarjeta' ? cardData : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrdenId(data.ordenId || `ORD-${Date.now()}`);
        setStep(3);
        limpiarCarrito();
      } else {
        alert('Error al procesar el pago. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Paso 3: Confirmación
  if (step === 3) {
    return (
      <div className='min-h-screen bg-gray-50 py-12'>
        <div className='max-w-2xl mx-auto px-4'>
          <div className='bg-white rounded-2xl shadow-lg p-8 text-center'>
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <CheckCircle className='w-12 h-12 text-green-600' />
            </div>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              ¡Pedido Confirmado!
            </h1>
            <p className='text-gray-600 mb-2'>
              Tu pedido ha sido procesado exitosamente
            </p>
            <p className='text-2xl font-bold text-[#c97a97] mb-8'>
              Orden #{ordenId}
            </p>

            <div className='bg-gray-50 rounded-lg p-6 mb-8 text-left'>
              <h3 className='font-semibold text-gray-900 mb-4'>Resumen del Pedido</h3>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Total de unidades:</span>
                  <span className='font-semibold'>{cantidadItems}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Productos:</span>
                  <span className='font-semibold'>{items.length}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Método de pago:</span>
                  <span className='font-semibold capitalize'>{metodoPago}</span>
                </div>
                <div className='h-px bg-gray-200 my-3'></div>
                <div className='flex justify-between text-lg'>
                  <span className='font-semibold text-gray-900'>Total:</span>
                  <span className='font-bold text-[#c97a97]'>S/ {totalConEnvio.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <p className='text-sm text-gray-500 mb-8'>
              Hemos enviado un correo de confirmación a <strong>{formData.correo}</strong> con los detalles de tu pedido.
            </p>

            <div className='flex gap-4 justify-center'>
              <Link
                href='/productos'
                className='px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition'
              >
                Seguir Comprando
              </Link>
              <Link
                href='/pedidos'
                className='px-6 py-3 bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white rounded-lg font-semibold hover:shadow-lg transition'
              >
                Ver Mis Pedidos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <Link
            href='/productos'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-[#c97a97] transition mb-4'
          >
            <ArrowLeft className='w-4 h-4' />
            Volver a productos
          </Link>
          <h1 className='text-3xl font-bold text-gray-900'>Finalizar Compra</h1>
          
          {/* Progress Steps */}
          <div className='flex items-center gap-4 mt-6'>
            <div className='flex items-center gap-2'>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= 1 ? 'bg-[#c97a97] text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className={`font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                Datos de Envío
              </span>
            </div>
            <div className='flex-1 h-1 bg-gray-200'>
              <div className={`h-full transition-all ${step >= 2 ? 'bg-[#c97a97]' : 'bg-gray-200'}`} 
                   style={{ width: step >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className='flex items-center gap-2'>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= 2 ? 'bg-[#c97a97] text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className={`font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
                Método de Pago
              </span>
            </div>
          </div>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Formulario */}
          <div className='lg:col-span-2'>
            {step === 1 && (
              <form onSubmit={handleSubmitDatos} className='bg-white rounded-xl shadow-lg p-6 space-y-6'>
                {/* Datos Personales */}
                <div>
                  <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                    <User className='w-5 h-5 text-[#c97a97]' />
                    Datos Personales
                  </h2>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <input
                      type='text'
                      name='nombre'
                      placeholder='Nombre *'
                      required
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                    />
                    <input
                      type='text'
                      name='apellidos'
                      placeholder='Apellidos *'
                      required
                      value={formData.apellidos}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                    />
                    <input
                      type='email'
                      name='correo'
                      placeholder='Correo Electrónico *'
                      required
                      value={formData.correo}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                    />
                    <input
                      type='tel'
                      name='telefono'
                      placeholder='Teléfono *'
                      required
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                    />
                    <input
                      type='text'
                      name='empresa'
                      placeholder='Empresa (Opcional)'
                      value={formData.empresa}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                    />
                    <input
                      type='text'
                      name='ruc'
                      placeholder='RUC (Opcional)'
                      value={formData.ruc}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                    />
                  </div>
                </div>

                {/* Dirección de Envío */}
                <div>
                  <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                    <MapPin className='w-5 h-5 text-[#c97a97]' />
                    Dirección de Envío
                  </h2>
                  <div className='space-y-4'>
                    <input
                      type='text'
                      name='direccion'
                      placeholder='Dirección completa *'
                      required
                      value={formData.direccion}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                    />
                    <div className='grid md:grid-cols-2 gap-4'>
                      <input
                        type='text'
                        name='ciudad'
                        placeholder='Ciudad *'
                        required
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                      />
                      <input
                        type='text'
                        name='distrito'
                        placeholder='Distrito *'
                        required
                        value={formData.distrito}
                        onChange={handleInputChange}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                      />
                    </div>
                    <input
                      type='text'
                      name='referencia'
                      placeholder='Referencia (Ej: Al lado del parque)'
                      value={formData.referencia}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                    />
                    <textarea
                      name='notas'
                      placeholder='Notas adicionales (Opcional)'
                      rows={3}
                      value={formData.notas}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97] resize-none'
                    />
                  </div>
                </div>

                <button
                  type='submit'
                  className='w-full bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white py-4 rounded-lg font-bold hover:shadow-lg transition'
                >
                  Continuar al Pago
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmitPago} className='bg-white rounded-xl shadow-lg p-6 space-y-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                  <CreditCard className='w-5 h-5 text-[#c97a97]' />
                  Método de Pago
                </h2>

                {/* Métodos de pago */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <button
                    type='button'
                    onClick={() => setMetodoPago('tarjeta')}
                    className={`p-4 border-2 rounded-lg transition ${
                      metodoPago === 'tarjeta'
                        ? 'border-[#c97a97] bg-[#fdf6f0]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className='w-8 h-8 mx-auto mb-2 text-[#c97a97]' />
                    <p className='text-sm font-semibold text-center'>Tarjeta</p>
                  </button>
                  
                  <button
                    type='button'
                    onClick={() => setMetodoPago('yape')}
                    className={`p-4 border-2 rounded-lg transition ${
                      metodoPago === 'yape'
                        ? 'border-[#c97a97] bg-[#fdf6f0]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className='w-8 h-8 mx-auto mb-2 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs'>
                      YAPE
                    </div>
                    <p className='text-sm font-semibold text-center'>Yape</p>
                  </button>

                  <button
                    type='button'
                    onClick={() => setMetodoPago('plin')}
                    className={`p-4 border-2 rounded-lg transition ${
                      metodoPago === 'plin'
                        ? 'border-[#c97a97] bg-[#fdf6f0]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className='w-8 h-8 mx-auto mb-2 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs'>
                      PLIN
                    </div>
                    <p className='text-sm font-semibold text-center'>Plin</p>
                  </button>

                  <button
                    type='button'
                    onClick={() => setMetodoPago('transferencia')}
                    className={`p-4 border-2 rounded-lg transition ${
                      metodoPago === 'transferencia'
                        ? 'border-[#c97a97] bg-[#fdf6f0]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building className='w-8 h-8 mx-auto mb-2 text-[#c97a97]' />
                    <p className='text-sm font-semibold text-center'>Transferencia</p>
                  </button>
                </div>

                {/* Formulario de tarjeta */}
                {metodoPago === 'tarjeta' && (
                  <div className='space-y-4 pt-4'>
                    <input
                      type='text'
                      name='numero'
                      placeholder='Número de tarjeta'
                      required
                      maxLength={19}
                      value={cardData.numero}
                      onChange={handleCardChange}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                    />
                    <input
                      type='text'
                      name='nombre'
                      placeholder='Nombre en la tarjeta'
                      required
                      value={cardData.nombre}
                      onChange={handleCardChange}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                    />
                    <div className='grid grid-cols-2 gap-4'>
                      <input
                        type='text'
                        name='expiracion'
                        placeholder='MM/AA'
                        required
                        maxLength={5}
                        value={cardData.expiracion}
                        onChange={handleCardChange}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                      />
                      <input
                        type='text'
                        name='cvv'
                        placeholder='CVV'
                        required
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c97a97]'
                      />
                    </div>
                  </div>
                )}

                {/* Instrucciones para otros métodos */}
                {(metodoPago === 'yape' || metodoPago === 'plin') && (
                  <div className='bg-purple-50 border border-purple-200 rounded-lg p-4'>
                    <p className='text-sm text-gray-700 mb-2'>
                      <strong>Número de {metodoPago === 'yape' ? 'Yape' : 'Plin'}:</strong> 987 654 321
                    </p>
                    <p className='text-xs text-gray-600'>
                      Realiza la transferencia y envía el comprobante por WhatsApp al finalizar la compra.
                    </p>
                  </div>
                )}

                {metodoPago === 'transferencia' && (
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2'>
                    <p className='text-sm font-semibold text-gray-900'>Datos bancarios:</p>
                    <p className='text-sm text-gray-700'>
                      <strong>Banco:</strong> BCP
                    </p>
                    <p className='text-sm text-gray-700'>
                      <strong>Cuenta Corriente:</strong> 123-456789-0-12
                    </p>
                    <p className='text-sm text-gray-700'>
                      <strong>CCI:</strong> 00212300045678901234
                    </p>
                    <p className='text-xs text-gray-600 mt-2'>
                      Envía el comprobante por WhatsApp después de realizar la transferencia.
                    </p>
                  </div>
                )}

                <div className='flex gap-4'>
                  <button
                    type='button'
                    onClick={() => setStep(1)}
                    className='flex-1 bg-gray-100 text-gray-700 py-4 rounded-lg font-bold hover:bg-gray-200 transition'
                  >
                    Volver
                  </button>
                  <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white py-4 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {loading ? 'Procesando...' : `Pagar S/ ${totalConEnvio.toFixed(2)}`}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Resumen del Pedido */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-xl shadow-lg p-6 sticky top-24'>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>Resumen del Pedido</h2>
              
              {/* Items */}
              <div className='space-y-3 mb-4 max-h-60 overflow-y-auto'>
                {items.map((item) => (
                  <div key={`${item.producto_id}-${item.talla}`} className='flex gap-3'>
                    <div className='relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden'>
                      <Image
                        src={item.imagen}
                        alt={item.nombre}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-semibold text-gray-900 line-clamp-1'>
                        {item.nombre}
                      </h4>
                      <p className='text-xs text-gray-500'>
                        Talla: {item.talla} • Cant: {item.cantidad}
                      </p>
                      <p className='text-sm font-bold text-[#c97a97]'>
                        S/ {(item.precio * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='border-t pt-4 space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Subtotal ({cantidadItems} unidades)</span>
                  <span className='font-semibold'>S/ {total.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600 flex items-center gap-1'>
                    <Truck className='w-4 h-4' />
                    Envío
                  </span>
                  <span className='font-semibold text-green-600'>GRATIS</span>
                </div>
                <div className='h-px bg-gray-200 my-3'></div>
                <div className='flex justify-between'>
                  <span className='text-lg font-bold text-gray-900'>Total</span>
                  <span className='text-2xl font-bold text-[#c97a97]'>
                    S/ {totalConEnvio.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
                <p className='text-xs text-green-800 flex items-center gap-2'>
                  <CheckCircle className='w-4 h-4' />
                  Envío gratis en compras mayoristas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}