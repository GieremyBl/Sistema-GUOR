import { Router } from 'express';
import { variantesController } from '../controllers/variantes.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../utils/api-protection';
import { Permission } from '../types/roles';

const router = Router();

// Rutas públicas
router.get('/', variantesController.getAll);
router.get('/:id', variantesController.getById);

// Rutas protegidas
router.post('/', authenticate, requirePermission(Permission.MANAGE_PRODUCTS), variantesController.create);
router.put('/:id', authenticate, requirePermission(Permission.MANAGE_PRODUCTS), variantesController.update);
router.put('/:id/stock', authenticate, requirePermission(Permission.MANAGE_PRODUCTS), variantesController.updateStock);
router.delete('/:id', authenticate, requirePermission(Permission.MANAGE_PRODUCTS), variantesController.delete);

export default router;