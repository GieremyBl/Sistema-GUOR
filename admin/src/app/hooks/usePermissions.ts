// src/hooks/usePermissions.ts

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { hasPermission } from '@/roles-config';

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

  const isAdmin = (): boolean => {
    return user?.rol.toLowerCase() === 'administrador';
  };

  return {
    user,
    loading,
    can,
    isAdmin,
  };
}