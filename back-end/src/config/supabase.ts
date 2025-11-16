import { createClient } from '@supabase/supabase-js';

// Obtener y validar las variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validar que existan ANTES de usarlas
if (!supabaseUrl) {
    throw new Error('❌ SUPABASE_URL no está definida en el archivo .env');
}

if (!supabaseKey) {
    throw new Error('❌ SUPABASE_SERVICE_ROLE_KEY no está definida en el archivo .env');
}

// Ahora TypeScript sabe que son strings, no undefined
export const supabase = createClient(
    supabaseUrl,
    supabaseKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);