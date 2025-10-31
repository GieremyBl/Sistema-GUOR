import { Router } from 'express';
import { inventarioController } from '../controllers/inventario.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, inventarioController.getAll);
router.get('/:id', authMiddleware, inventarioController.getById);
router.post('/', authMiddleware, inventarioController.create);
router.put('/:id', authMiddleware, inventarioController.update);
router.delete('/:id', authMiddleware, inventarioController.delete);
router.patch('/:id/stock', authMiddleware, inventarioController.updateStock);

export default router;