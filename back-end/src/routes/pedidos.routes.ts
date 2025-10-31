import { Router } from 'express';
import { pedidosController } from '../controllers/pedidos.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, pedidosController.getAll);
router.post('/', authMiddleware, pedidosController.create);
router.patch('/:id/estado', authMiddleware, pedidosController.updateStatus);

export default router;