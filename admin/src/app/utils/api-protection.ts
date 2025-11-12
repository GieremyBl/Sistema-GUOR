import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

interface ProtectedCallOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function protectedApiCall(
  endpoint: string,
  options: ProtectedCallOptions = {}
): Promise<Response> {
  const session = await getServerSession() as Session | null;

  if (!session) {
    throw new Error("No autorizado");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response;
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Error en la solicitud";
    throw new Error(error);
  }
}

export async function validateToken(): Promise<{ valid: boolean; error?: string }> {
  try {
    return { valid: true };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Error validando token";
    return { valid: false, error };
  }
}

export async function checkUserRole(requiredRole: string): Promise<boolean> {
  const session = await getServerSession() as (Session & { user?: { rol?: string } }) | null;

  if (!session?.user?.rol) {
    return false;
  }

  return session.user.rol === requiredRole;
}