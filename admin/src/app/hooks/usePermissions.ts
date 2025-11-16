"use client";

import { useCurrentUser } from './useCurrentUser';

type Permission = 
  | 'VIEW_DASHBOARD'
  | 'VIEW_USUARIOS'
  | 'VIEW_PRODUCTOS'
  | 'VIEW_PEDIDOS'
  | 'VIEW_CLIENTES'
  | 'VIEW_COTIZACIONES'
  | 'VIEW_REPORTES'
  | 'MANAGE_USUARIOS'
  | 'MANAGE_PRODUCTOS'
  | 'MANAGE_PEDIDOS';

const rolePermissions: Record<string, Permission[]> = {
  administrador: [
    'VIEW_DASHBOARD',
    'VIEW_USUARIOS',
    'VIEW_PRODUCTOS',
    'VIEW_PEDIDOS',
    'VIEW_CLIENTES',
    'VIEW_COTIZACIONES',
    'VIEW_REPORTES',
    'MANAGE_USUARIOS',
    'MANAGE_PRODUCTOS',
    'MANAGE_PEDIDOS',
  ],
  recepcionista: [
    'VIEW_DASHBOARD',
    'VIEW_PEDIDOS',
    'VIEW_CLIENTES',
    'VIEW_COTIZACIONES',
    'MANAGE_PEDIDOS',
  ],
  diseñador: [
    'VIEW_DASHBOARD',
    'VIEW_PRODUCTOS',
    'VIEW_PEDIDOS',
    'MANAGE_PRODUCTOS',
  ],
  cortador: [
    'VIEW_DASHBOARD',
    'VIEW_PEDIDOS',
  ],
  ayudante: [
    'VIEW_DASHBOARD',
  ],
  representante_taller: [
    'VIEW_DASHBOARD',
    'VIEW_PEDIDOS',
  ],
};

export function usePermissions() {
  const { usuario, loading } = useCurrentUser();

  const hasPermission = (permission: Permission): boolean => {
    if (!usuario) return false;
    const permissions = rolePermissions[usuario.rol] || [];
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(p => hasPermission(p));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(p => hasPermission(p));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    loading,
    rol: usuario?.rol,
  };
}