import { Router } from 'express';
import validationRoutes from './validation';
import historyRoutes from './history';
import exportRoutes from './export';

const router = Router();

// API version prefix
const API_VERSION = '/v1';

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use(`${API_VERSION}/validation`, validationRoutes);
router.use(`${API_VERSION}/history`, historyRoutes);
router.use(`${API_VERSION}/export`, exportRoutes);

// 404 handler for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: `Route ${req.originalUrl} not found`,
      statusCode: 404,
    },
  });
});

export default router;
