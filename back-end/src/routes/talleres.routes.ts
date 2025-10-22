import { Router } from 'express';
import { talleresController } from '../controllers/talleres.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, talleresController.getAll);
router.post('/', authMiddleware, talleresController.create);
router.put('/:id', authMiddleware, talleresController.update);
router.delete('/:id', authMiddleware, talleresController.delete);

export default router;