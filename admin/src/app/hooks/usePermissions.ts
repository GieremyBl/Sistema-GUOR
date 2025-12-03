"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { hasPermission } from '@/lib/roles-config';

interface User {
  id: string;
  email: string;
  rol: string;
  nombre_completo: string;
}

export function usePermissions() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('id, email, rol, nombre_completo')
          .eq('email', authUser.email)
          .single();
        
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const can = (action: 'create' | 'view' | 'edit' | 'delete' | 'export', resource: string): boolean => {
    if (!user) return false;
    return hasPermission(user.rol.toLowerCase(), action, resource);
  };

  const checkPermission = (permission: string): boolean => {
    if (!user) return false;
    // Soporta ambos formatos: "usuarios.view" y "view:usuarios"
    if (permission.includes('.')) {
      const [resource, action] = permission.split('.') as [string, 'create' | 'view' | 'edit' | 'delete' | 'export'];
      return can(action, resource);
    } else {
      const [action, resource] = permission.split(':') as ['create' | 'view' | 'edit' | 'delete' | 'export', string];
      return can(action, resource);
    }
  };

  const checkAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => checkPermission(permission));
  };

  const checkAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => checkPermission(permission));
  };

  const isAdmin = (): boolean => {
    return user?.rol.toLowerCase() === 'administrador';
  };

  return {
    user,
    loading,
    isLoading: loading, // alias para consistencia con PermissionGuard
    can,
    isAdmin,
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,
  };
}