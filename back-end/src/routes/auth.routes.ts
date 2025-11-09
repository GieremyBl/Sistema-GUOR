import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const controller = new AuthController();

// Rutas públicas (sin autenticación)
router.post('/login', controller.login.bind(controller));
router.post('/refresh', controller.refresh.bind(controller));

// Rutas protegidas
router.get('/me', authenticate, controller.me.bind(controller));

export default router;