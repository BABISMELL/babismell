import { Router } from 'express';
import { auth, requireAdmin } from '../middleware/auth';
import {
  getPerfumes,
  getPerfume,
  createPerfume,
  updatePerfume,
  deletePerfume
} from '../controllers/perfume.controller';

const router = Router();

// Public routes
router.get('/', getPerfumes);
router.get('/:id', getPerfume);

// Admin routes
router.post('/', auth, requireAdmin, createPerfume);
router.put('/:id', auth, requireAdmin, updatePerfume);
router.delete('/:id', auth, requireAdmin, deletePerfume);

export default router;