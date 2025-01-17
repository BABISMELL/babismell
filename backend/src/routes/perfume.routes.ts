import { Router } from 'express';
import { auth, isAdmin } from '../middleware/auth';
import { 
  getAllPerfumes,
  getPerfumeById,
  createPerfume,
  updatePerfume,
  deletePerfume
} from '../controllers/perfume.controller';

const router = Router();

// Public routes
router.get('/', getAllPerfumes);
router.get('/:id', getPerfumeById);

// Admin routes
router.post('/', auth, isAdmin, createPerfume);
router.put('/:id', auth, isAdmin, updatePerfume);
router.delete('/:id', auth, isAdmin, deletePerfume);

export default router;