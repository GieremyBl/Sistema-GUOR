'use client';

import { useRouter } from 'next/navigation';
import CreateCategoriaDialog from '@/components/categorias/CreateCategoriaDialog';
import { useToast } from '@/app/hooks/use-toast';
import { createCategoria, CategoriaCreateData } from '@/lib/api';

export default function NuevaCategoriaPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: CategoriaCreateData & { activo: boolean }) => {
    try {
      await createCategoria(data);

      toast({
        title: 'Éxito',
        description: 'Categoría creada correctamente',
      });

      router.push('/Panel-Administrativo/categorias');
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo crear la categoría',
      });
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Categoría</h1>
        <p className="text-gray-600 mt-1">
          Completa el formulario para agregar una nueva categoría de productos
        </p>
      </div>

      <CreateCategoriaDialog
        open={true}
        onOpenChange={(open) => !open && router.push('/Panel-Administrativo/categorias')}
        onSubmit={handleSubmit}
      />
    </div>
  );
}