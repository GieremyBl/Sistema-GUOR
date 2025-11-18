'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserTable from '@/components/usuarios/UserTable';
import UserFilters from '@/components/usuarios/UserFilters';
import DeleteUserDialog from '@/components/usuarios/DeleteUserDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { fetchUsuarios, deleteUsuario, Usuario } from '@/lib/api'; 

export default function UsuariosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    busqueda: '',
    rol: '',
    estado: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);

  useEffect(() => {
    loadUsuarios();
  }, [filters, pagination.page]);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const data = await fetchUsuarios({
        page: pagination.page,
        limit: pagination.limit,
        busqueda: filters.busqueda || undefined,
        rol: filters.rol || undefined,
        estado: filters.estado || undefined,
      });

      setUsuarios(data.usuarios);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/Panel-Administrativo/usuarios/${id}`);
  };

  const handleDelete = (usuario: Usuario) => {
    setUserToDelete(usuario);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUsuario(userToDelete.id);

      toast({
        title: 'Éxito',
        description: 'Usuario eliminado correctamente',
      });

      await loadUsuarios();
      setUserToDelete(null);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el usuario',
      });
    }
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button onClick={() => router.push('/Panel-Administrativo/usuarios/nuevo')}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <UserFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <UserTable
        usuarios={usuarios}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      <DeleteUserDialog
        user={userToDelete}
        open={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}