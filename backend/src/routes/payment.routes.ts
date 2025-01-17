import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  createPayment,
  getPayments,
  getPayment
} from '../controllers/payment.controller';

const router = Router();

router.post('/', auth, createPayment);
router.get('/', auth, getPayments);
router.get('/:id', auth, getPayment);

export default router;