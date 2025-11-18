// back-end/src/routes/pedidos.routes.ts
import { Router } from 'express';
import {
  getPedidos,
  getPedido,
  createPedido,
  updatePedido,
  deletePedido,
  getEstadisticas
} from '../controllers/pedidos.controller';

const router = Router();

// GET /api/pedidos/estadisticas - Debe ir antes de /:id
router.get('/estadisticas', getEstadisticas);

// CRUD básico
router.get('/', getPedidos);
router.get('/:id', getPedido);
router.post('/', createPedido);
router.patch('/:id', updatePedido);
router.delete('/:id', deletePedido);

export default router;