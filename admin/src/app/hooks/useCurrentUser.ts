"use client";

import { useEffect, useState } from 'react';
import { supabase, getUsuarioCompleto, UsuarioCompleto } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function useCurrentUser() {
  const [usuario, setUsuario] = useState<UsuarioCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getUsuarioCompleto();
        if (!user) {
          router.push('/login');
          return;
        }
        setUsuario(user);
      } catch (error) {
        console.error('Error loading user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/login');
        } else if (event === 'SIGNED_IN') {
          loadUser();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return { usuario, loading };
}