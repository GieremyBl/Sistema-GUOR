"use client";

import { useCurrentUser } from '@/app/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { usuario, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && usuario && !allowedRoles.includes(usuario.rol)) {
      router.push('/dashboard');
    }
  }, [usuario, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!usuario || !allowedRoles.includes(usuario.rol)) {
    return null;
  }

  return <>{children}</>;
}