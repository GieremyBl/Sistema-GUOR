import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { Permission } from '../types/roles';
import { requirePermission } from '../utils/api-protection';
import { clientesController } from '../controllers/clientes.controller';

const router = Router();

// Rutas protegidas
router.get('/', authenticate, requirePermission(Permission.VIEW_CLIENTS), clientesController.getAll);
router.get('/:id', authenticate, requirePermission(Permission.VIEW_CLIENTS), clientesController.getById);
router.post('/', authenticate, requirePermission(Permission.MANAGE_CLIENTS), clientesController.create);
router.put('/:id', authenticate, requirePermission(Permission.MANAGE_CLIENTS), clientesController.update);
router.delete('/:id', authenticate, requirePermission(Permission.MANAGE_CLIENTS), clientesController.delete);

export default router;