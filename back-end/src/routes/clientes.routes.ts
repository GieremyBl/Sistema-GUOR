import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { Permission } from '../types/roles';
import { requirePermission } from '../utils/api-protection';
import { 
    getAllClientes, 
    getCliente, 
    createCliente, 
    createClienteWithInvitation,
    updateCliente, 
    deleteCliente, 
    searchClientes, 
    toggleActivoCliente, 
    getPedidosByCliente 
} from '../controllers/clientes.controller'; 

const router = Router();

// Buscar clientes por término
router.get(
    '/search/:term', 
    authenticate, 
    requirePermission(Permission.VIEW_CLIENTS), 
    searchClientes
);
// Crear cliente con invitación por email (Sin contraseña inicial)
router.post(
    '/invite',
    authenticate,
    requirePermission(Permission.MANAGE_CLIENTS),
    createClienteWithInvitation
);

// Obtener pedidos de un cliente específico
router.get(
    '/:id/pedidos', 
    authenticate, 
    requirePermission(Permission.VIEW_CLIENTS), 
    getPedidosByCliente
);

// Toggle estado activo/inactivo
router.patch(
    '/:id/toggle-activo', 
    authenticate, 
    requirePermission(Permission.MANAGE_CLIENTS), 
    toggleActivoCliente
);

// Listar todos los clientes activos
router.get(
    '/', 
    authenticate, 
    requirePermission(Permission.VIEW_CLIENTS), 
    getAllClientes
);

// Obtener un cliente específico por ID
router.get(
    '/:id', 
    authenticate, 
    requirePermission(Permission.VIEW_CLIENTS), 
    getCliente
);

// Crear nuevo cliente
router.post(
    '/', 
    authenticate, 
    requirePermission(Permission.MANAGE_CLIENTS), 
    createCliente
);

// Actualizar cliente (PUT - reemplazo completo)
router.put(
    '/:id', 
    authenticate, 
    requirePermission(Permission.MANAGE_CLIENTS), 
    updateCliente
);

// Actualizar cliente (PATCH - actualización parcial)
router.patch(
    '/:id', 
    authenticate, 
    requirePermission(Permission.MANAGE_CLIENTS), 
    updateCliente
);

// Eliminar cliente (soft delete)
router.delete(
    '/:id', 
    authenticate, 
    requirePermission(Permission.MANAGE_CLIENTS), 
    deleteCliente
);

export default router;