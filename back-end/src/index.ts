import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import usuariosRoutes from './routes/usuarios.routes';
import productosRoutes from './routes/productos.routes';
import pedidosRoutes from './routes/pedidos.routes';
import confeccionesRoutes from './routes/confecciones.routes';
import despachosRoutes from './routes/despachos.routes';
import talleresRoutes from './routes/talleres.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/confecciones', confeccionesRoutes);
app.use('/api/despachos', despachosRoutes);
app.use('/api/talleres', talleresRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});