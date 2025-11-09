import { Router } from 'express';
import { pedidosController } from '../controllers/pedidos.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, pedidosController.getAll);
router.post('/', authenticate, pedidosController.create);
router.patch('/:id/estado', authenticate, pedidosController.updateStatus);

export default router;