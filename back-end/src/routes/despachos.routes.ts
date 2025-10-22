import { Router } from 'express';
import { despachosController } from '../controllers/despachos.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, despachosController.getAll);
router.post('/', authMiddleware, despachosController.create);
router.patch('/:id/estado', authMiddleware, despachosController.updateStatus);

export default router;