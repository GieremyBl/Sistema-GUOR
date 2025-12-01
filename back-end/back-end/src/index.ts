import './config/env';
import { env } from './config/env'; 
import express, { Request, Response, NextFunction } from 'express';
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
import * as crypto from 'crypto';

const app = express();
// Render asigna el puerto automáticamente en producción
const port = process.env.PORT || env.PORT || 10000;

// CONFIGURACIÓN DE SEGURIDAD

// Helmet con configuración para APIs
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Desactivar para APIs
}));

// Generar JWT Secret si no existe (mejor tomarlo del .env en producción)
if (!global.JWT_SECRET_KEY) {
  if (process.env.JWT_SECRET) {
    global.JWT_SECRET_KEY = process.env.JWT_SECRET;
    console.log('🔑 JWT Secret cargado desde variables de entorno.');
  } else {
    global.JWT_SECRET_KEY = crypto.randomBytes(32).toString('hex');
    console.warn('⚠️  JWT Secret generado dinámicamente (no recomendado en producción).');
  }
}

// CONFIGURACIÓN DE CORS

// Lista completa de orígenes permitidos
const allowedOrigins = [
  // Desarrollo local
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  
  // Variables de entorno (Vercel)
  env.ADMIN_URL,
  env.CLIENT_URL,
  process.env.VERCEL_ADMIN_URL,
  process.env.VERCEL_CLIENT_URL,
].filter(Boolean); // Elimina valores undefined/null

console.log('🌐 Orígenes CORS permitidos:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, apps móviles, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Permitir orígenes específicos de la lista
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Permitir subdominios específicos
    const allowedDomainPatterns = [
      /\.vercel\.app$/,          // Cualquier subdominio de Vercel
      /\.github\.dev$/,          // GitHub Codespaces
      /\.onrender\.com$/,        // Render (para testing)
      /localhost:\d+$/,          // Cualquier puerto de localhost
    ];
    
    const isAllowedDomain = allowedDomainPatterns.some(pattern => 
      pattern.test(origin)
    );
    
    if (isAllowedDomain) {
      return callback(null, true);
    }
    
    // En desarrollo, permitir todo
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  DESARROLLO: Permitiendo origin:', origin);
      return callback(null, true);
    }
    
    // Rechazar otros orígenes en producción
    console.warn('❌ CORS bloqueado para origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 horas - reduce preflight requests
}));

// MIDDLEWARES DE PARSEO

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log de requests en desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
  });
}

// RUTAS DE SISTEMA

// Health Check - IMPORTANTE para Render
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Endpoint raíz
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Sistema GUOR API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api/*',
    },
    documentation: 'https://github.com/tu-usuario/sistema-guor',
  });
});

// ==========================================
// RUTAS DE LA API
// ==========================================

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

// ==========================================
// MANEJO DE ERRORES
// ==========================================

// 404 - Ruta no encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Error handler global
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log del error
  console.error('❌ Error:', {
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Respuesta al cliente
  const statusCode = err.statusCode || err.status || 500;
  
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack,
      details: err.details,
    }),
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

const server = app.listen(port, () => {
  console.log('═══════════════════════════════════════');
  console.log('🚀 Sistema GUOR API');
  console.log('═══════════════════════════════════════');
  console.log(`📡 Puerto: ${port}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${port}`);
  console.log(`✅ Health Check: http://localhost:${port}/health`);
  console.log(`📊 Base de datos: ${env.DATABASE_URL ? 'Conectada' : 'No configurada'}`);
  console.log('═══════════════════════════════════════');
});

// Manejo de shutdown graceful
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido. Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido. Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection en:', promise, 'razón:', reason);
  process.exit(1);
});

export default app;