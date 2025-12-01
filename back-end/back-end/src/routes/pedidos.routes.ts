import { Router } from 'express';
import { 
    getPedidos, 
    getPedido, 
    createPedido, 
    updatePedido, 
    deletePedido,
    getEstadisticas,
    getHistorial      
} from '../controllers/pedidos.controller';

const router = Router();

// Rutas Especiales - Deben ir antes de la ruta dinámica /:id
router.get('/estadisticas', getEstadisticas);
router.get('/historial', getHistorial);

// Rutas CRUD de Pedidos
router.get('/', getPedidos);
router.get('/:id', getPedido);
router.post('/', createPedido);
router.patch('/:id', updatePedido);
router.delete('/:id', deletePedido);

export default router;