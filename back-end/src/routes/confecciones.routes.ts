import { Router } from 'express';
import { confeccionesController } from '../controllers/confecciones.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, confeccionesController.getAll);
router.post('/', authMiddleware, confeccionesController.create);
router.patch('/:id/estado', authMiddleware, confeccionesController.updateStatus);

export default router;