import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  createPayment,
  updatePaymentStatus,
  getPaymentById,
  getUserPayments
} from '../controllers/payment.controller';

const router = Router();

// Protected payment routes
router.use(auth);
router.post('/', createPayment);
router.get('/', getUserPayments);
router.get('/:id', getPaymentById);
router.put('/:id/status', updatePaymentStatus);

export default router;