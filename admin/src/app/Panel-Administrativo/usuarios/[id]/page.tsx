'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import UseForm from '@/components/usuarios/UseForm';
import { useToast } from '@/app/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsuario();
  }, [params.id]);

  const fetchUsuario = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${params.id}`
      );

      if (!response.ok) {
        throw new Error('Usuario no encontrado');
      }

      const data = await response.json();
      setUsuario(data.usuario);
    } catch (error) {
      console.error('Error cargando usuario:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cargar el usuario',
      });
      router.push('/Panel-Administrativo/usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${params.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error actualizando usuario');
      }

      toast({
        title: 'Éxito',
        description: 'Usuario actualizado correctamente',
      });

      router.push('/Panel-Administrativo/usuarios');
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

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Usuario</h1>
        <p className="text-gray-600 mt-1">
          Modifica los datos del usuario
        </p>
      </div>

      <UseForm initialData={usuario} onSubmit={handleSubmit} isEditing />
    </div>
  );
}