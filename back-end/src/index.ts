import './config/env';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';

import authRoutes from './routes/auth.routes';
import clientesRoutes from './routes/clientes.routes';
import usuariosRoutes from './routes/usuarios.routes';
import productosRoutes from './routes/productos.routes';
import pedidosRoutes from './routes/pedidos.routes';
import confeccionesRoutes from './routes/confecciones.routes';
import despachosRoutes from './routes/despachos.routes';
import talleresRoutes from './routes/talleres.routes';

const app = express();
const port = env.PORT;

// Middlewares globales
app.use(helmet());

//CORS para GitHub Codespaces y localhost
app.use(cors({
  origin: (origin, callback) => {
    // Permite localhost y dominios de GitHub Codespaces
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      env.FRONTEND_URL
    ];
    
    // Permite cualquier subdominio de github.dev
    if (!origin || allowedOrigins.includes(origin) || origin.includes('.github.dev')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/confecciones', confeccionesRoutes);
app.use('/api/despachos', despachosRoutes);
app.use('/api/talleres', talleresRoutes);

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📡 Conectado a Supabase`);
});