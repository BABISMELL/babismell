import { Router } from 'express';
import { testDatabase } from '../controllers/test.controller';

const router = Router();

// Test endpoints
router.get('/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

router.get('/test/db', testDatabase);

// Health check route
router.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

export default router;