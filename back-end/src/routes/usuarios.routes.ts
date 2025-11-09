import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { Permission } from '../types/roles';
import { requirePermission } from '../utils/api-protection';
import { usuariosController } from '../controllers/usuarios.controller';

const router = Router();  
router.use(authenticate);

router.get('/', requirePermission(Permission.VIEW_USERS), usuariosController.getAll);
router.post('/', requirePermission(Permission.MANAGE_USERS), usuariosController.create);
router.put('/:id', requirePermission(Permission.MANAGE_USERS), usuariosController.update);
router.delete('/:id', requirePermission(Permission.DELETE_USERS), usuariosController.delete);

export default router;