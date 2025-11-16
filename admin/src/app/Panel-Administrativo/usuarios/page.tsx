'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserTable from '@/components/usuarios/UserTable';
import UserFilters from '@/components/usuarios/UserFilters';
import DeleteUserDialog from '@/components/usuarios/DeleteUserDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';

interface Usuario {
  id: string;
  nombre_completo: string;
  email: string;
  telefono?: string;
  rol: string;
  estado: string;
  created_at: string;
}

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

  // Cargar usuarios cuando cambian los filtros o la página
  useEffect(() => {
    fetchUsuarios();
  }, [filters, pagination.page]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filters.busqueda) params.append('busqueda', filters.busqueda);
      if (filters.rol) params.append('rol', filters.rol);
      if (filters.estado) params.append('estado', filters.estado);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios?${params}`
      );
      
      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const data = await response.json();

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${userToDelete.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }

      toast({
        title: 'Éxito',
        description: 'Usuario eliminado correctamente',
      });

      // Recargar lista
      await fetchUsuarios();
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
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset a página 1
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
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

      {/* Filtros */}
      <UserFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Tabla */}
      <UserTable
        usuarios={usuarios}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      {/* Modal de confirmación */}
      <DeleteUserDialog
        user={userToDelete}
        open={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}