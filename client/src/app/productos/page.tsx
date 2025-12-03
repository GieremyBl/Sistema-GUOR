'use client';

import { useState, useEffect } from 'react';
import { ProductosService } from '@/services/productos.service';
import { CategoriasService } from '@/services/categorias.service';
import { Producto, Categoria } from '@/types/database';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, X, Loader2 } from 'lucide-react';

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [ordenar, setOrdenar] = useState<'precio_asc' | 'precio_desc' | 'nombre'>('nombre');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Cargar categorías al montar
  useEffect(() => {
    async function cargarCategorias() {
      const data = await CategoriasService.obtenerCategorias();
      setCategorias(data);
    }
    cargarCategorias();
  }, []);

  // Cargar productos cuando cambien los filtros
  useEffect(() => {
    async function cargarProductos() {
      setLoading(true);
      try {
        const data = await ProductosService.obtenerProductos({
          categoria_id: categoriaSeleccionada || undefined,
          busqueda: busqueda || undefined,
          ordenar
        });
        setProductos(data);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(cargarProductos, 300); // Debounce de 300ms
    return () => clearTimeout(timer);
  }, [busqueda, categoriaSeleccionada, ordenar]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoriaSeleccionada(null);
    setOrdenar('nombre');
  };

  const categoriaActual = categorias.find(c => c.id === categoriaSeleccionada);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header con imagen de fondo */}
      <div 
        className='relative bg-gradient-to-r from-[#d4a574] to-[#c97a97] py-20'
        style={{
          backgroundImage: "url('/hero-productos.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className='absolute inset-0 bg-gradient-to-r from-[#d4a574]/80 to-[#c97a97]/80'></div>
        <div className='relative max-w-7xl mx-auto px-4 text-center text-white'>
          <h1 className='text-5xl font-bold mb-4'>Nuestros Productos</h1>
          <p className='text-xl opacity-95'>Ropa femenina de calidad al por mayor desde 400 prendas</p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='grid lg:grid-cols-4 gap-8'>
          {/* Sidebar de filtros - Desktop */}
          <aside className='hidden lg:block space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-bold text-gray-900'>Filtros</h3>
                {(busqueda || categoriaSeleccionada) && (
                  <button
                    onClick={limpiarFiltros}
                    className='text-sm text-[#d4a574] hover:text-[#c99564] font-medium'
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Buscador */}
              <div className='mb-6'>
                <label className='block text-sm font-medium mb-2 text-gray-700'>
                  Buscar producto
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder='Ej: vestido, blusa...'
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a574] focus:border-transparent outline-none'
                  />
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                </div>
              </div>

              {/* Categorías */}
              <div className='mb-6'>
                <label className='block text-sm font-medium mb-3 text-gray-700'>
                  Categorías
                </label>
                <div className='space-y-2'>
                  <button
                    onClick={() => setCategoriaSeleccionada(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      categoriaSeleccionada === null
                        ? 'bg-[#d4a574] text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Todas las categorías
                  </button>
                  {categorias.map((categoria) => (
                    <button
                      key={categoria.id}
                      onClick={() => setCategoriaSeleccionada(categoria.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        categoriaSeleccionada === categoria.id
                          ? 'bg-[#d4a574] text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {categoria.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ordenar por */}
              <div>
                <label className='block text-sm font-medium mb-3 text-gray-700'>
                  Ordenar por
                </label>
                <select
                  value={ordenar}
                  onChange={(e) => setOrdenar(e.target.value as any)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a574] focus:border-transparent outline-none'
                >
                  <option value='nombre'>Nombre (A-Z)</option>
                  <option value='precio_asc'>Precio: Menor a Mayor</option>
                  <option value='precio_desc'>Precio: Mayor a Menor</option>
                </select>
              </div>
            </div>

            {/* Banner informativo */}
            <div className='bg-gradient-to-br from-[#d4a574]/10 to-[#c97a97]/10 p-6 rounded-lg border border-[#d4a574]/20'>
              <h4 className='font-bold text-gray-900 mb-2'>Venta al por mayor</h4>
              <p className='text-sm text-gray-600 mb-3'>
                Pedido mínimo de 400 unidades por producto
              </p>
              <div className='space-y-2 text-sm text-gray-700'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-[#d4a574] rounded-full'></div>
                  <span>Precios especiales mayoristas</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-[#d4a574] rounded-full'></div>
                  <span>Envíos a todo Lima</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-[#d4a574] rounded-full'></div>
                  <span>Calidad garantizada</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Contenido principal */}
          <main className='lg:col-span-3'>
            {/* Barra superior - Mobile */}
            <div className='lg:hidden mb-6 space-y-4'>
              {/* Buscador mobile */}
              <div className='relative'>
                <input
                  type='text'
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder='Buscar productos...'
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a574] focus:border-transparent outline-none'
                />
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              </div>

              {/* Botones de filtro mobile */}
              <div className='flex gap-3'>
                <button
                  onClick={() => setMostrarFiltros(true)}
                  className='flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50'
                >
                  <Filter className='w-5 h-5' />
                  Filtros
                </button>
                <select
                  value={ordenar}
                  onChange={(e) => setOrdenar(e.target.value as any)}
                  className='flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg'
                >
                  <option value='nombre'>Nombre</option>
                  <option value='precio_asc'>Precio ↑</option>
                  <option value='precio_desc'>Precio ↓</option>
                </select>
              </div>
            </div>

            {/* Información de resultados */}
            <div className='flex items-center justify-between mb-6'>
              <div>
                <p className='text-gray-700'>
                  {loading ? (
                    'Cargando...'
                  ) : (
                    <>
                      Mostrando <span className='font-bold'>{productos.length}</span> productos
                      {categoriaActual && (
                        <> en <span className='font-bold'>{categoriaActual.nombre}</span></>
                      )}
                    </>
                  )}
                </p>
                {(busqueda || categoriaSeleccionada) && (
                  <button
                    onClick={limpiarFiltros}
                    className='text-sm text-[#d4a574] hover:underline mt-1'
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>

            {/* Grid de productos */}
            {loading ? (
              <div className='flex items-center justify-center py-20'>
                <Loader2 className='w-8 h-8 animate-spin text-[#d4a574]' />
              </div>
            ) : productos.length === 0 ? (
              <div className='text-center py-20'>
                <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Search className='w-10 h-10 text-gray-400' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  No se encontraron productos
                </h3>
                <p className='text-gray-600 mb-4'>
                  Intenta ajustar tus filtros o búsqueda
                </p>
                <button
                  onClick={limpiarFiltros}
                  className='px-6 py-2 bg-[#d4a574] text-white rounded-lg hover:bg-[#c99564] transition'
                >
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {productos.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal de filtros - Mobile */}
      {mostrarFiltros && (
        <div className='fixed inset-0 z-50 lg:hidden'>
          <div 
            className='absolute inset-0 bg-black/50'
            onClick={() => setMostrarFiltros(false)}
          />
          <div className='absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-bold'>Filtros</h3>
                <button
                  onClick={() => setMostrarFiltros(false)}
                  className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>

              {/* Categorías */}
              <div className='mb-6'>
                <label className='block text-sm font-medium mb-3'>Categorías</label>
                <div className='space-y-2'>
                  <button
                    onClick={() => {
                      setCategoriaSeleccionada(null);
                      setMostrarFiltros(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      categoriaSeleccionada === null
                        ? 'bg-[#d4a574] text-white'
                        : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    Todas las categorías
                  </button>
                  {categorias.map((categoria) => (
                    <button
                      key={categoria.id}
                      onClick={() => {
                        setCategoriaSeleccionada(categoria.id);
                        setMostrarFiltros(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition ${
                        categoriaSeleccionada === categoria.id
                          ? 'bg-[#d4a574] text-white'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      {categoria.nombre}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={limpiarFiltros}
                className='w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition'
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
