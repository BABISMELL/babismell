import { Router } from 'express';
import { 
  createOrder, 
  getOrderById, 
  getUserOrders, 
  updateOrderStatus 
} from '../controllers/order.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Protected order routes
router.use(auth);
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router;