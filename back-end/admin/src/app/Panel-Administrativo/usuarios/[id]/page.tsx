'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CreateUsuarioDialog from '@/components/usuarios/CreateUsuarioDialog';
import { useToast } from '@/app/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getUsuarioById, updateUsuario, deleteUsuario } from '@/lib/actions/usuarios.actions'
import { Usuario } from '@/lib/types';

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = typeof params.id === 'string' ? params.id : params.id?.[0];

  useEffect(() => {
    if (userId){
        loadUsuario();
    }
  }, [userId]);

  const loadUsuario = async () => {
    if (!userId) return;
    
      try {
      const result= await getUsuarioById(Number(userId));

      if (result.success) {
        setUsuario(result.data) 
      } else {
        throw new Error(result.error);
      }
    
    } catch (error: any) {
      console.error('Error cargando usuario:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo cargar el usuario',
      });
      router.push('/Panel-Administrativo/usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    if (!userId) return;

    try {
      const result = await updateUsuario(Number(userId), {
        nombre_completo: data.nombre_completo,
        telefono: data.telefono,
        rol: data.rol,
        estado: data.estado,
      });

      if (result.success) {
        toast({
                title: 'Éxito',
                description: 'Usuario actualizado correctamente',
        });
        router.push('/Panel-Administrativo/usuarios'); 
        router.refresh();
      } else {
        throw new Error(result.error);
      }

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo actualizar el usuario',
      });
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!userId) return;

    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }
  
    try {
      const result = await deleteUsuario(Number(userId));

      if (result.success) {
        toast({
          title: 'Éxito',
          description: 'Usuario eliminado correctamente',
          });
          router.push('/Panel-Administrativo/usuarios');
          router.refresh();
        } else {
          throw new Error(result.error);
        }
    } catch (error: any) {
      console.error('Error:', error),
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo eliminar el usuario',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando usuario...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Usuario no encontrado</p>
          <button
            onClick={() => router.push('/Panel-Administrativo/usuarios')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Usuario</h1>
          <p className="text-gray-600 mt-1">
            Modifica los datos del usuario
          </p>
        </div>
        
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Eliminar Usuario
        </button>
      </div>

      <CreateUsuarioDialog 
        initialData={usuario} 
        onSubmit={handleSubmit} 
        onOpenChange={(isOpen) => {
            if (!isOpen) router.push('/Panel-Administrativo/usuarios');
        }}
        open={true}
      />
    </div>
  );
}