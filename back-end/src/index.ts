// ESTO DEBE SER LA PRIMERA LÍNEA - carga y valida todas las variables
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
app.use(cors({
  origin: env.FRONTEND_URL,
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