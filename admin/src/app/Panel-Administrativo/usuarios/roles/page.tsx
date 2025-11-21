'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/components/supabase/client';
import { Shield, Users, CheckCircle2 } from 'lucide-react';

interface RoleCount {
  rol: string;
  count: number;
}

export default function RolesPermisosPage() {
  const [roleCounts, setRoleCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoleCounts();
  }, []);

  const fetchRoleCounts = async () => {
    try {
      setLoading(true);
      
      // Obtener conteo de usuarios por rol
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('estado', 'activo');

      if (error) throw error;

      // Contar usuarios por rol
      const counts: Record<string, number> = {
        administrador: 0,
        recepcionista: 0,
        diseñador: 0,
        cortador: 0,
        ayudante: 0,
        representante_taller: 0,
      };

      usuarios?.forEach((user) => {
        const rol = user.rol.toLowerCase();
        if (counts.hasOwnProperty(rol)) {
          counts[rol]++;
        }
      });

      setRoleCounts(counts);
    } catch (error) {
      console.error('Error al obtener conteo de roles:', error);
    } finally {
      setLoading(false);
    }
  };


  const getRoleColor = (roleId: string) => {
    const colors: Record<string, string> = {
      administrador: 'bg-red-500',
      recepcionista: 'bg-blue-500',
      diseñador: 'bg-purple-500',
      cortador: 'bg-orange-500',
      ayudante: 'bg-green-500',
      representante_taller: 'bg-yellow-500',
    };
    return colors[roleId] || 'bg-gray-500';
  };

  const getPermissionsByRole = (roleId: string) => {
    const permissions: Record<string, string[]> = {
      administrador: [
        '✓ Gestión de usuarios (crear, editar, eliminar)',
        '✓ Gestión de clientes (crear, editar, eliminar)',
        '✓ Gestión de talleres externos (crear, editar, eliminar)',
        '✓ Visualizar productos, pedidos y cotizaciones',
        '✓ Visualizar categorías, inventario y confecciones',
        '✓ Visualizar despachos y reportes',
        '✓ Exportar todos los datos a Excel/PDF',
        '✓ Reportes y estadísticas completas',
        '✓ Configuración del sistema',
      ],
      recepcionista: [
        '✓ Crear y editar pedidos',
        '✓ Gestión de clientes',
        '✓ Ver inventario',
        '✓ Reportes básicos',
      ],
      diseñador: [
        '✓ Crear diseños',
        '✓ Editar diseños asignados',
        '✓ Ver pedidos',
        '✓ Subir archivos de diseño',
      ],
      cortador: [
        '✓ Ver pedidos asignados',
        '✓ Actualizar estado de corte',
        '✓ Ver patrones',
      ],
      ayudante: [
        '✓ Ver pedidos',
        '✓ Ver inventario',
        '✓ Actualizar progreso',
      ],
      representante_taller: [
        '✓ Gestión de pedidos de taller',
        '✓ Ver inventario',
        '✓ Reportes de producción',
      ],
    };
    return permissions[roleId] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Roles y Permisos
            </h1>
            <p className="text-gray-600 mt-1">
              Visualiza los roles del sistema y sus permisos asociados
            </p>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries({
          administrador: 'Administrador',
          recepcionista: 'Recepcionista',
          diseñador: 'Diseñador',
          cortador: 'Cortador',
          ayudante: 'Ayudante',
          representante_taller: 'Representante de Taller',
        }).map(([roleId, roleName]) => (
          <div
            key={roleId}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Role Header */}
            <div className={`${getRoleColor(roleId)} p-6 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="font-bold text-lg">
                    {loading ? '...' : roleCounts[roleId] || 0}
                  </span>
                  <span className="text-sm opacity-90">usuarios</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{roleName}</h3>
              <p className="text-white/90 text-sm">
                {roleId === 'administrador' && 'Acceso total a gestión y visualización'}
                {roleId === 'recepcionista' && 'Gestión de pedidos y clientes'}
                {roleId === 'diseñador' && 'Gestión de diseños y patrones'}
                {roleId === 'cortador' && 'Gestión de corte de telas'}
                {roleId === 'ayudante' && 'Apoyo en producción'}
                {roleId === 'representante de taller' && 'Coordinación con talleres externos'}
              </p>
            </div>

            {/* Permissions List */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Permisos:</span>
              </div>
              <ul className="space-y-2">
                {getPermissionsByRole(roleId).map((permission, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{permission.replace('✓ ', '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="max-w-7xl mx-auto mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Nota Importante sobre el Rol Administrador
            </h4>
            <p className="text-blue-800 text-sm">
              El administrador tiene acceso a <strong>visualizar y exportar</strong> todos los datos del sistema,
              pero solo puede <strong>crear, editar y eliminar</strong> usuarios, clientes y talleres externos.
              Para productos, pedidos, cotizaciones, categorías e inventario solo tiene permisos de visualización y exportación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}