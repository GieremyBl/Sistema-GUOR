import { Router } from 'express';
import { 
    getTalleres, 
    getTaller, 
    createTaller, 
    updateTaller, 
    deleteTaller,
    getEstadisticas      
} from '../controllers/talleres.controller';

const router = Router();

// Rutas Especiales - Deben ir antes de la ruta dinámica /:id
router.get('/estadisticas', getEstadisticas);

// Rutas CRUD de Talleres
router.get('/', getTalleres);
router.get('/:id', getTaller);
router.post('/', createTaller);
router.patch('/:id', updateTaller);
router.delete('/:id', deleteTaller);

export default router;