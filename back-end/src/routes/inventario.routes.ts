import { Router } from 'express';
import { inventarioController } from '../controllers/inventario.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, inventarioController.getAll);
router.get('/:id', authenticate, inventarioController.getById);
router.post('/', authenticate, inventarioController.create);
router.put('/:id', authenticate, inventarioController.update);
router.delete('/:id', authenticate, inventarioController.delete);
router.patch('/:id/stock', authenticate, inventarioController.updateStock);

export default router;