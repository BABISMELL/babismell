import { Router } from 'express';
import authRoutes from './auth.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import perfumeRoutes from './perfume.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => res.json({ status: 'ok' }));

// API routes
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/perfumes', perfumeRoutes);

export default router;