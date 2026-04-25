import { Router } from 'express';
import authRoutes from './auth.route';
import reportRoutes from './report.route';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Semua route didaftarkan disini
router.use('/auth', authRoutes);
router.use('/report', requireAuth, reportRoutes);

export default router;
