// src/app/Panel-Administrativo/productos/nuevo/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateProductoForm from '@/components/productos/CreateProductoDialog'; 
import { useToast } from '@/app/hooks/use-toast';
import { createProducto, fetchCategorias, Categoria } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NuevoProductoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const data = await fetchCategorias();
      setCategorias(data);
    } catch (error: any) {
      console.error('Error cargando categorías:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar las categorías',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      // 🔍 DEBUG: Ver qué llega
      console.log('📥 Datos recibidos en handleSubmit:', data);
      console.log('📋 categoriaId:', data.categoriaId);

      // ✅ VALIDACIÓN: Asegurarse que categoriaId existe
      if (!data.categoria_id) {
        throw new Error('La categoría es obligatoria');
      }

      // Mapeamos los datos del formulario a lo que espera tu API (Snake Case)
      const productoData = {
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        precio: parseFloat(data.precio),
        categoria_id: data.categoria_id,
        stock: parseInt(data.stock) || 0,
        stock_minimo: parseInt(data.stockMinimo) || 400, 
        imagen: data.imagen || null,
        estado: data.estado, 
      };

      console.log('📤 Datos a enviar a la API:', productoData);

      await createProducto(productoData);

      toast({
        title: 'Éxito',
        description: 'Producto creado correctamente',
      });

      // Redirigir al listado
      router.push('/Panel-Administrativo/productos');
      router.refresh(); 
    } catch (error: any) {
      console.error('❌ Error en handleSubmit:', error);
      
      // Re-lanzar el error para que el formulario lo capture
      throw error;
    }
  };

  const categoriasTransformadas = categorias.map((cat) => ({
    id: cat.id.toString(),
    nombre: cat.nombre,
  }));

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      
      {/* Header con botón de regresar */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Producto</h1>
          <p className="text-gray-600 mt-1">
            Completa el formulario para agregar un nuevo producto al catálogo
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <CreateProductoForm
          categorias={categoriasTransformadas}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}