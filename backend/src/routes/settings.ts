import { Router } from 'express';
import { settingsController } from '../controllers/settingsController';

const router = Router();

// Get current settings
router.get('/', settingsController.getSettings);

// Update settings
router.put('/', settingsController.updateSettings);

// Reset settings to defaults
router.post('/reset', settingsController.resetSettings);

export default router;
