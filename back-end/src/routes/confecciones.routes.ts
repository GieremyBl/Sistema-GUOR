import { Router } from 'express';
import { confeccionesController } from '../controllers/confecciones.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, confeccionesController.getAll);
router.post('/', authenticate, confeccionesController.create);
router.patch('/:id/estado', authenticate, confeccionesController.updateStatus);

export default router;