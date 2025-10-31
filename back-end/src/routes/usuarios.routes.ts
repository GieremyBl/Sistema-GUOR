import { Router } from 'express';
import { usuariosController } from '../controllers/usuarios.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, usuariosController.getAll);
router.post('/', authMiddleware, usuariosController.create);
router.put('/:id', authMiddleware, usuariosController.update);
router.delete('/:id', authMiddleware, usuariosController.delete);

export default router;