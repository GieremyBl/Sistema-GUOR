"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Role } from "@/types/next-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasAccess = session && (!requiredRole || (session.user?.rol as Role) === requiredRole);

  useEffect(() => {
    if (status === "unauthenticated" || !hasAccess) {
      router.push(redirectTo);
    }
  }, [status, hasAccess, redirectTo, router]);

  if (status === "loading") {
    return <div>Cargando...</div>;
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}