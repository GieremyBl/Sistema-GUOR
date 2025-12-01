import { Router } from 'express';
import { 
    getCategorias, 
    getCategoria, 
    createCategoria, 
    updateCategoria, 
    deleteCategoria 
} from '../controllers/categorias.controller';

const router = Router();

// Rutas CRUD de Categorías
router.get('/', getCategorias);
router.post('/', createCategoria);
router.get('/:id', getCategoria);
router.patch('/:id', updateCategoria);
router.delete('/:id', deleteCategoria);

export default router;