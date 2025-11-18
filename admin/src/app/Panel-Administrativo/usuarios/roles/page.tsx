'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Settings, Scissors, Palette, Package, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface RolInfo {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  icon: any;
  permisos: string[];
  usuariosCount: number;
}

// Configuración de roles (metadata)
const rolesConfig: Record<string, Omit<RolInfo, 'id' | 'usuariosCount'>> = {
  administrador: {
    nombre: 'Administrador',
    descripcion: 'Acceso total al sistema',
    color: 'bg-red-500',
    icon: Shield,
    permisos: [
      'Gestión de usuarios',
      'Gestión de productos',
      'Gestión de pedidos',
      'Gestión de inventario',
      'Reportes y estadísticas',
      'Configuración del sistema'
    ]
  },
  recepcionista: {
    nombre: 'Recepcionista',
    descripcion: 'Gestión de pedidos y clientes',
    color: 'bg-blue-500',
    icon: Users,
    permisos: [
      'Crear y editar pedidos',
      'Gestión de clientes',
      'Ver inventario',
      'Reportes básicos'
    ]
  },
  diseñador: {
    nombre: 'Diseñador',
    descripcion: 'Gestión de diseños y patrones',
    color: 'bg-purple-500',
    icon: Palette,
    permisos: [
      'Crear diseños',
      'Editar diseños asignados',
      'Ver pedidos',
      'Subir archivos de diseño'
    ]
  },
  cortador: {
    nombre: 'Cortador',
    descripcion: 'Gestión de corte de telas',
    color: 'bg-orange-500',
    icon: Scissors,
    permisos: [
      'Ver pedidos asignados',
      'Actualizar estado de corte',
      'Ver patrones',
      'Gestión de inventario de telas'
    ]
  },
  ayudante: {
    nombre: 'Ayudante',
    descripcion: 'Apoyo en producción',
    color: 'bg-green-500',
    icon: Package,
    permisos: [
      'Ver pedidos',
      'Ver inventario',
      'Actualizar progreso'
    ]
  },
  representante_taller: {
    nombre: 'Representante de Taller',
    descripcion: 'Coordinación con talleres externos',
    color: 'bg-yellow-500',
    icon: Settings,
    permisos: [
      'Gestión de pedidos de taller',
      'Ver inventario',
      'Reportes de producción',
      'Coordinación de entregas'
    ]
  }
};

export default function RolesYPermisosPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<RolInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRolesData();
  }, []);

  const loadRolesData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Obtener conteo de usuarios por rol
      const { data: usuarios, error: usuariosError } = await supabase
        .from('usuarios')
        .select('rol');

      if (usuariosError) throw usuariosError;

      // Contar usuarios por rol
      const rolCounts: Record<string, number> = {};
      usuarios?.forEach((user) => {
        rolCounts[user.rol] = (rolCounts[user.rol] || 0) + 1;
      });

      // Combinar configuración con datos reales
      const rolesData: RolInfo[] = Object.entries(rolesConfig).map(([id, config]) => ({
        id,
        ...config,
        usuariosCount: rolCounts[id] || 0
      }));

      setRoles(rolesData);
    } catch (err: any) {
      console.error('Error cargando roles:', err);
      setError(err.message || 'Error al cargar los roles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Cargando roles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">Error: {error}</p>
          <Button 
            onClick={loadRolesData} 
            variant="outline" 
            className="mt-4"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900">
          Roles y Permisos
        </h1>
        <p className="text-gray-600 mt-2">
          Visualiza los roles del sistema y sus permisos asociados
        </p>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((rol) => {
          const Icon = rol.icon;
          
          return (
            <Card key={rol.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`${rol.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary">
                    {rol.usuariosCount} {rol.usuariosCount === 1 ? 'usuario' : 'usuarios'}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{rol.nombre}</CardTitle>
                <CardDescription>{rol.descripcion}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Permisos:
                  </p>
                  <ul className="space-y-2">
                    {rol.permisos.map((permiso, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{permiso}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Footer */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Los roles se asignan al crear o editar un usuario. 
          Cada rol tiene permisos específicos que determinan qué acciones puede realizar en el sistema.
        </p>
      </div>
    </div>
  );
}