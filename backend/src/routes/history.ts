import { Router } from 'express';
import { historyController } from '../controllers/historyController';

const router = Router();

// Get validation history with pagination
router.get('/', historyController.getValidationHistory);

// Get validation by ID
router.get('/:id', historyController.getValidationById);

// Search validations
router.get('/search', historyController.searchValidations);

// Delete validation
router.delete('/:id', historyController.deleteValidation);

export default router;
