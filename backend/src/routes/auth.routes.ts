import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  login,
  register,
  getProfile,
  updateProfile
} from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

export default router;