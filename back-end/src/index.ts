import './config/env';
import { env } from './config/env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import clientesRoutes from './routes/clientes.routes';
import usuariosRoutes from './routes/usuarios.routes';
import productosRoutes from './routes/productos.routes';
import pedidosRoutes from './routes/pedidos.routes';
import confeccionesRoutes from './routes/confecciones.routes';
import despachosRoutes from './routes/despachos.routes';
import talleresRoutes from './routes/talleres.routes';
import categoriaRoutes from './routes/categorias.routes';
import cotizacionesRoutes from './routes/cotizaciones.routes';
import variantesRoutes from './routes/variantes.routes';

const app = express();
const port = env.PORT;

// HEALTH CHECK (debe ir antes de otros middlewares)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'GUOR API',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV || 'development'
  });
});


// MIDDLEWARES GLOBALES
app.use(helmet());

// CORS configurado para múltiples entornos
const allowedOrigins = [
  // Desarrollo local
  'http://localhost:3000',
  'http://localhost:3001',
  // Producción (desde variables de entorno)
  env.ADMIN_URL,
  env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requests sin origin (Postman, móviles, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Permite orígenes en la lista
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    
    // Permite GitHub Codespaces (desarrollo)
    if (origin.includes('.github.dev') || origin.includes('.app.github.dev')) {
      callback(null, true);
      return;
    }

    // Permite previews de Vercel (desarrollo/staging)
    if (origin.includes('.vercel.app')) {
      callback(null, true);
      return;
    }

    console.warn('⚠️ CORS bloqueado:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/confecciones', confeccionesRoutes);
app.use('/api/despachos', despachosRoutes);
app.use('/api/talleres', talleresRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/cotizaciones', cotizacionesRoutes);
app.use('/api/variantes', variantesRoutes);

// ============================================
// RUTA 404
// ============================================
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `La ruta ${req.originalUrl} no existe`,
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📡 Conectado a Supabase`);
  console.log(`🌍 Entorno: ${env.NODE_ENV || 'development'}`);
  console.log(`✅ CORS habilitado para:`, allowedOrigins.filter(Boolean));
});