'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductosService } from '@/services/productos.service';
import { Producto } from '@/types/database';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Loader2, ShoppingCart, Package, Truck, Shield, Star } from 'lucide-react';
import { useCarrito } from '@/context/CarritoContext';

export default function ProductoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { agregarItem } = useCarrito();
  
  const [producto, setProducto] = useState<Producto | null>(null);
  const [variantes, setVariantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(10);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [imagenActual, setImagenActual] = useState(0);

  const tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    async function cargarProducto() {
      try {
        const id = parseInt(params.id as string);
        const { producto: prod, variantes: vars } = await ProductosService.obtenerProductoPorId(id);
        
        if (prod) {
          setProducto(prod);
          setVariantes(vars);
        } else {
          router.push('/productos');
        }
      } catch (error) {
        console.error('Error cargando producto:', error);
        router.push('/productos');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      cargarProducto();
    }
  }, [params.id, router]);

  const handleAgregar = () => {
    if (!producto) return;

    if (!tallaSeleccionada) {
      setMensaje('Por favor selecciona una talla');
      return;
    }

    if (cantidad < 10) {
      setMensaje('La cantidad mínima es 10 unidades');
      return;
    }

    if (cantidad > producto.stock) {
      setMensaje(`Solo hay ${producto.stock} unidades disponibles`);
      return;
    }

    agregarItem({
      producto_id: producto.id,
      nombre: producto.nombre,
      imagen: producto.imagen,
      precio: producto.precio,
      cantidad,
      talla: tallaSeleccionada,
      stock: producto.stock
    });

    setMensaje('¡Producto agregado al carrito!');
    setTimeout(() => setMensaje(''), 3000);
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-[#d4a574]' />
      </div>
    );
  }

  if (!producto) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <div className='flex items-center gap-2 text-sm'>
            <Link href='/' className='text-gray-600 hover:text-[#d4a574]'>Inicio</Link>
            <span className='text-gray-400'>/</span>
            <Link href='/productos' className='text-gray-600 hover:text-[#d4a574]'>Productos</Link>
            <span className='text-gray-400'>/</span>
            <span className='text-gray-900 font-medium'>{producto.nombre}</span>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-12'>
        {/* Botón volver */}
        <Link
          href='/productos'
          className='inline-flex items-center gap-2 text-gray-600 hover:text-[#d4a574] mb-8 transition'
        >
          <ChevronLeft className='w-5 h-5' />
          Volver a productos
        </Link>

        <div className='grid lg:grid-cols-2 gap-12'>
          {/* Galería de imágenes */}
          <div className='space-y-4'>
            {/* Imagen principal */}
            <div className='relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-lg'>
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                fill
                className='object-cover'
                priority
              />
            </div>

            {/* Miniaturas (si hay más imágenes) */}
            {/* Aquí puedes agregar más imágenes si tienes imagenes_secundarias */}
          </div>

          {/* Información del producto */}
          <div className='space-y-6'>
            {/* Categoría */}
            <div>
              <span className='inline-block px-3 py-1 bg-[#d4a574]/10 text-[#d4a574] text-sm font-medium rounded-full'>
                {producto.categorias?.nombre}
              </span>
            </div>

            {/* Título */}
            <div>
              <h1 className='text-4xl font-bold text-gray-900 mb-3'>
                {producto.nombre}
              </h1>
              
              {/* Rating (puedes agregar esto después) */}
              <div className='flex items-center gap-2'>
                <div className='flex gap-1'>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className='w-5 h-5 fill-[#d4a574] text-[#d4a574]' />
                  ))}
                </div>
                <span className='text-gray-600 text-sm'>(Producto mayorista)</span>
              </div>
            </div>

            {/* Precio */}
            <div className='bg-gradient-to-br from-[#d4a574]/10 to-[#c97a97]/10 p-6 rounded-xl border border-[#d4a574]/20'>
              <div className='flex items-baseline gap-3 mb-2'>
                <span className='text-5xl font-bold text-[#d4a574]'>
                  S/ {producto.precio.toFixed(2)}
                </span>
                <span className='text-gray-600'>por unidad</span>
              </div>
              <p className='text-sm text-gray-600'>
                Precio especial para compras desde 400 unidades
              </p>
            </div>

            {/* Descripción */}
            {producto.descripcion && (
              <div>
                <h3 className='text-lg font-bold text-gray-900 mb-2'>Descripción</h3>
                <p className='text-gray-700 leading-relaxed'>
                  {producto.descripcion}
                </p>
              </div>
            )}

            {/* Stock */}
            <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
              <Package className='w-5 h-5 text-gray-600' />
              <div>
                <p className='text-sm text-gray-600'>Stock disponible</p>
                <p className='font-bold text-gray-900'>{producto.stock} unidades</p>
              </div>
            </div>

            {/* Selector de talla */}
            <div>
              <label className='block text-sm font-bold text-gray-900 mb-3'>
                Seleccionar talla *
              </label>
              <div className='flex gap-2 flex-wrap'>
                {tallas.map(talla => (
                  <button
                    key={talla}
                    onClick={() => setTallaSeleccionada(talla)}
                    className={`px-6 py-3 border-2 rounded-lg font-medium transition ${
                      tallaSeleccionada === talla
                        ? 'bg-[#d4a574] border-[#d4a574] text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-[#d4a574]'
                    }`}
                  >
                    {talla}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de cantidad */}
            <div>
              <label className='block text-sm font-bold text-gray-900 mb-3'>
                Cantidad (mínimo 400 unidades)
              </label>
              <div className='flex items-center gap-4'>
                <button
                  onClick={() => setCantidad(Math.max(10, cantidad - 10))}
                  className='w-12 h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-bold text-xl'
                >
                  -
                </button>
                <input
                  type='number'
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(10, parseInt(e.target.value) || 10))}
                  className='w-24 text-center border-2 border-gray-300 rounded-lg py-3 text-lg font-bold focus:border-[#d4a574] outline-none'
                  min='10'
                  max={producto.stock}
                />
                <button
                  onClick={() => setCantidad(Math.min(producto.stock, cantidad + 10))}
                  className='w-12 h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-bold text-xl'
                >
                  +
                </button>
              </div>
              <p className='text-sm text-gray-600 mt-2'>
                Total: <span className='font-bold text-[#d4a574]'>S/ {(producto.precio * cantidad).toFixed(2)}</span>
              </p>
            </div>

            {/* Botón agregar al carrito */}
            <button
              onClick={handleAgregar}
              className='w-full bg-gradient-to-r from-[#d4a574] to-[#c97a97] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl transition-all transform hover:scale-[1.02]'
            >
              <ShoppingCart className='w-6 h-6' />
              Agregar al Carrito
            </button>

            {/* Mensaje */}
            {mensaje && (
              <div className={`p-4 rounded-lg text-center font-medium ${
                mensaje.includes('Por favor') || mensaje.includes('mínima') || mensaje.includes('Solo hay')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {mensaje}
              </div>
            )}

            {/* Beneficios */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-[#d4a574]/10 rounded-full flex items-center justify-center flex-shrink-0'>
                  <Truck className='w-6 h-6 text-[#d4a574]' />
                </div>
                <div>
                  <p className='font-semibold text-sm text-gray-900'>Envío rápido</p>
                  <p className='text-xs text-gray-600'>A todo Lima</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-[#d4a574]/10 rounded-full flex items-center justify-center flex-shrink-0'>
                  <Shield className='w-6 h-6 text-[#d4a574]' />
                </div>
                <div>
                  <p className='font-semibold text-sm text-gray-900'>Calidad garantizada</p>
                  <p className='text-xs text-gray-600'>100% original</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-[#d4a574]/10 rounded-full flex items-center justify-center flex-shrink-0'>
                  <Package className='w-6 h-6 text-[#d4a574]' />
                </div>
                <div>
                  <p className='font-semibold text-sm text-gray-900'>Stock disponible</p>
                  <p className='text-xs text-gray-600'>Entrega inmediata</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección adicional - Productos relacionados */}
        <div className='mt-20'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Productos Relacionados</h2>
          <p className='text-gray-600'>
            Aquí puedes agregar productos de la misma categoría...
          </p>
        </div>
      </div>
    </div>
  );
}