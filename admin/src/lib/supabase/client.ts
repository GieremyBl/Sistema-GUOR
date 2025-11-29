import { createBrowserClient } from '@supabase/ssr';

// La función debe retornar la instancia del cliente de navegador.
// No necesita parámetros, ya que toma las variables públicas de process.env
// automáticamente en el cliente (Browser).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const supabase = createClient();