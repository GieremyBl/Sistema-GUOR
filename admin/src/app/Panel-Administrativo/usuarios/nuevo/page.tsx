'use client';

import { useRouter } from 'next/navigation';
import UseForm from '@/components/usuarios/UseForm';
import { useToast } from '@/app/hooks/use-toast';

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error creando usuario');
      }

      toast({
        title: 'Éxito',
        description: 'Usuario creado correctamente',
      });

      router.push('/Panel-Administrativo/usuarios');
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo crear el usuario',
      });
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
        <p className="text-gray-600 mt-1">
          Completa el formulario para agregar un nuevo usuario al sistema
        </p>
      </div>
      
      <UseForm onSubmit={handleSubmit} />
    </div>
  );
}