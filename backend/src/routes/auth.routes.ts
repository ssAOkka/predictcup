import { Router } from 'express';
import { register, login, refreshToken, getMe } from '@/controllers/auth.controller';
import { authenticateToken } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validate-request';
import { authLimiter } from '@/middleware/rate-limit';
import { registerSchema, loginSchema } from '@/utils/validation-schemas';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/refresh', refreshToken);
router.get('/me', authenticateToken, getMe);

export default router;
