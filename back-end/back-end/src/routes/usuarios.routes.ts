import { Router } from 'express';
import {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from '../controllers/usuarios.controller';

const router = Router();

// GET /api/usuarios - Listar todos con filtros
router.get('/', getUsuarios);

// GET /api/usuarios/:id - Obtener uno por ID
router.get('/:id', getUsuario);

// POST /api/usuarios - Crear nuevo
router.post('/', createUsuario);

// PATCH /api/usuarios/:id - Actualizar
router.patch('/:id', updateUsuario);

// DELETE /api/usuarios/:id - Eliminar
router.delete('/:id', deleteUsuario);

export default router;