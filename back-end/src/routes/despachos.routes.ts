import { Router } from 'express';
import { despachosController } from '../controllers/despachos.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, despachosController.getAll);
router.post('/', authenticate, despachosController.create);
router.patch('/:id/estado', authenticate, despachosController.updateStatus);

export default router;