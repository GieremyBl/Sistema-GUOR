import { Router } from 'express';
import { cotizacionesController } from '../controllers/cotizaciones.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../utils/api-protection';
import { Permission } from '../types/roles';

const router = Router();

// Rutas protegidas
router.get('/', authenticate, cotizacionesController.getAll);
router.get('/:id', authenticate, cotizacionesController.getById);
router.get('/cliente/:clienteId', authenticate, cotizacionesController.getByCliente);
router.post('/', authenticate, requirePermission(Permission.MANAGE_QUOTES), cotizacionesController.create);
router.put('/:id/status', authenticate, requirePermission(Permission.MANAGE_QUOTES), cotizacionesController.updateStatus);
router.delete('/:id', authenticate, requirePermission(Permission.MANAGE_QUOTES), cotizacionesController.delete);

export default router;