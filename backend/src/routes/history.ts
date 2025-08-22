import { Router } from 'express';
import { historyController } from '../controllers/historyController';

const router = Router();

// Get validation history with pagination
router.get('/', historyController.getValidationHistory);

// Search validations (must come before /:id route)
router.get('/search', historyController.searchValidations);

// Get validation by ID
router.get('/:id', historyController.getValidationById);

// Delete validation
router.delete('/:id', historyController.deleteValidation);

export default router;
