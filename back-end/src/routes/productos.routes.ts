import { Router } from 'express';
import { productosController } from '../controllers/productos.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', productosController.getAll);
router.post('/', authMiddleware, productosController.create);
router.put('/:id', authMiddleware, productosController.updateStock);
router.delete('/:id', authMiddleware, productosController.delete);

export default router;