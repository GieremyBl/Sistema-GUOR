import { Router } from 'express';
import { productosController } from '../controllers/productos.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', productosController.getAll);
router.post('/', authenticate, productosController.create);
router.put('/:id', authenticate, productosController.updateStock);
router.delete('/:id', authenticate, productosController.delete);

export default router;