import { Router } from 'express';
import {
  getCurrentUser,
  getCurrentSession,
  signIn,
  signOut,
  signUp,
  updatePasswordUser,
} from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { requireAuth } from '../middlewares/auth.middleware';
import {
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
} from '../utils/validators/auth.validator';

const router = Router();

// Endpoint untuk registrasi (sign-up)
router.post('/sign-up', validate(signUpSchema), signUp);

// Endpoint untuk login (sign-in)
router.post('/sign-in', validate(signInSchema), signIn);

// Endpoint untuk logout (sign-out)
router.post('/sign-out', requireAuth, signOut);

// Endpoint untuk mendapatkan informasi pengguna saat ini
router.get('/get-user', requireAuth, getCurrentUser);

// Endpoint untuk mendapatkan informasi sesi saat ini
router.get('/get-session', requireAuth, getCurrentSession);

// Endpoint untuk memperbarui password pengguna
router.post(
  '/update-password',
  requireAuth,
  validate(updatePasswordSchema),
  updatePasswordUser,
);

export default router;
