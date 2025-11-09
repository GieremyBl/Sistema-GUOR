import { Router } from 'express';
import { categoriasController } from '../controllers/categorias.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../utils/api-protection';
import { Permission } from '../types/roles';

const router = Router();

// Rutas públicas
router.get('/', categoriasController.getAll);
router.get('/:id', categoriasController.getById);

// Rutas protegidas
router.post('/', authenticate, requirePermission(Permission.MANAGE_PRODUCTS), categoriasController.create);
router.put('/:id', authenticate, requirePermission(Permission.MANAGE_PRODUCTS), categoriasController.update);
router.delete('/:id', authenticate, requirePermission(Permission.MANAGE_PRODUCTS), categoriasController.delete);

export default router;