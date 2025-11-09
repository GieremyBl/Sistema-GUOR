import { Router } from 'express';
import { talleresController } from '../controllers/talleres.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, talleresController.getAll);
router.post('/', authenticate, talleresController.create);
router.put('/:id', authenticate, talleresController.update);
router.delete('/:id', authenticate, talleresController.delete);

export default router;