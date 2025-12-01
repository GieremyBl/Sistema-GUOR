import { Router } from 'express';
import { 
    getAllProductos, 
    getProducto, 
    createProducto, 
    updateProducto, 
    deleteProducto,
    getStockBajo,
    updateStock
} from '../controllers/productos.controller';

const router = Router();

// Rutas Especiales - Deben ir antes de la ruta dinámica /:id
router.get('/stock-bajo', getStockBajo);
// Rutas CRUD de Productos
router.get('/', getAllProductos);
router.post('/', createProducto);

// Rutas que requieren ID
router.get('/:id', getProducto);
router.put('/:id', updateProducto);
// PATCH para actualizar solo una parte del recurso (el stock)
router.patch('/:id/stock', updateStock); 
router.delete('/:id', deleteProducto);

export default router;