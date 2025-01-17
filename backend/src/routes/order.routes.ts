import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  createOrder,
  getOrders,
  getOrder
} from '../controllers/order.controller';

const router = Router();

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrder);

export default router;