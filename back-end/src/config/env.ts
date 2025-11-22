import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar el .env desde la raíz del proyecto
config({ path: resolve(__dirname, '../../.env') });

// Validar que las variables críticas existan
if (!process.env.SUPABASE_URL) {
    throw new Error('❌ SUPABASE_URL no está definida en el archivo .env');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('❌ SUPABASE_SERVICE_ROLE_KEY no está definida en el archivo .env');
}

// Exportar todas las variables validadas
export const env = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    PORT: process.env.PORT || '5000',
    ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:3000',
    CLIENT_URL: process.env.CLIENT_URL || 'htt://localhost:3001',
    NODE_ENV: process.env.NODE_ENV || 'development'
} as const;

console.log('✅ Variables de entorno cargadas correctamente');
console.log(`📍 Entorno: ${env.NODE_ENV}`);
console.log(`🔗 Supabase URL: ${env.SUPABASE_URL}`);