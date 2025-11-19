'use client';

import { useState, useEffect } from 'react';
import CategoriasTable, { CategoriaTable } from '@/components/categorias/CategoriasTable';
import CreateCategoriaDialog from '@/components/categorias/CreateCategoriaDialog';
import EditCategoriaDialog from '@/components/categorias/EditCategoriaDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  fetchCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  Categoria,
  CategoriaCreateData,
  CategoriaUpdateData,
} from '@/lib/api';

export default function CategoriasPage() {
  const { toast } = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState<Categoria | null>(null);
  const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(null);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    setLoading(true);
    try {
      const data = await fetchCategorias();
      setCategorias(data);
    } catch (error: any) {
      console.error('Error cargando categorías:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudieron cargar las categorías',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: { nombre: string; descripcion?: string; activo: boolean }) => {
    try {
      // Convertir undefined a null para que coincida con CategoriaCreateData
      const categoriaData: CategoriaCreateData & { activo: boolean } = {
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        activo: data.activo,
      };

      await createCategoria(categoriaData);

      toast({
        title: 'Éxito',
        description: 'Categoría creada correctamente',
      });

      await loadCategorias();
    } catch (error: any) {
      console.error('Error creando categoría:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo crear la categoría',
      });
      throw error;
    }
  };

  const handleEdit = (id: string) => {
    const categoria = categorias.find((c) => c.id.toString() === id);
    if (categoria) {
      setCategoriaToEdit(categoria);
    }
  };

  const handleUpdate = async (id: string, data: CategoriaUpdateData) => {
    try {
      await updateCategoria(Number(id), data);

      toast({
        title: 'Éxito',
        description: 'Categoría actualizada correctamente',
      });

      await loadCategorias();
    } catch (error: any) {
      console.error('Error actualizando categoría:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo actualizar la categoría',
      });
      throw error;
    }
  };

  const handleDelete = (categoria: CategoriaTable) => {
    // Convertir el ID de string a number para la API
    const categoriaApi: Categoria = {
      id: Number(categoria.id),
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? null,
      activo: categoria.activo,
      created_at: categoria.created_at,
      updated_at: categoria.updated_at ?? null,
    };
    setCategoriaToDelete(categoriaApi);
  };

  const confirmDelete = async () => {
    if (!categoriaToDelete) return;

    try {
      await deleteCategoria(categoriaToDelete.id);

      toast({
        title: 'Éxito',
        description: 'Categoría eliminada correctamente',
      });

      await loadCategorias();
      setCategoriaToDelete(null);
    } catch (error: any) {
      console.error('Error eliminando categoría:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo eliminar la categoría',
      });
    }
  };

  const handleToggleActivo = async (categoria: CategoriaTable) => {
    try {
      // Enviar todos los campos requeridos por CategoriaUpdateData
      await updateCategoria(Number(categoria.id), { 
        nombre: categoria.nombre,
        descripcion: categoria.descripcion ?? null,
        activo: !categoria.activo 
      });

      toast({
        title: 'Éxito',
        description: `Categoría ${!categoria.activo ? 'activada' : 'desactivada'} correctamente`,
      });

      await loadCategorias();
    } catch (error: any) {
      console.error('Error cambiando estado:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo cambiar el estado',
      });
    }
  };

  const categoriasFiltradas = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Transformar categorías de la API al formato que espera la tabla
  const categoriasTransformadas: CategoriaTable[] = categoriasFiltradas.map((cat) => ({
    id: cat.id.toString(),
    nombre: cat.nombre,
    descripcion: cat.descripcion ?? undefined,
    activo: cat.activo,
    created_at: cat.created_at,
    updated_at: cat.updated_at,
    _count: { productos: 0 }, // TODO: Agregar count real si lo necesitas
  }));

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-gray-600 mt-1">
            Administra las categorías de productos ({categorias.length} total)
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar categorías..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <CategoriasTable
        categorias={categoriasTransformadas}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActivo={handleToggleActivo}
      />

      {/* Diálogo de creación */}
      <CreateCategoriaDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
      />

      {/* Diálogo de edición */}
      {categoriaToEdit && (
        <EditCategoriaDialog
          open={!!categoriaToEdit}
          onOpenChange={(open) => !open && setCategoriaToEdit(null)}
          categoria={{
            id: categoriaToEdit.id.toString(),
            nombre: categoriaToEdit.nombre,
            descripcion: categoriaToEdit.descripcion ?? undefined,
            activo: categoriaToEdit.activo,
          }}
          onSubmit={handleUpdate}
        />
      )}

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={!!categoriaToDelete} onOpenChange={() => setCategoriaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la categoría{' '}
              <strong>{categoriaToDelete?.nombre}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}