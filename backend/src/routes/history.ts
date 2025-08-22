import { Router } from 'express';
import { historyController } from '../controllers/historyController';

const router = Router();

// Get validation history with pagination
router.get('/', historyController.getHistory);

// Search validations (MUST come before :id route)
router.get('/search', historyController.searchValidations);

// Get validation by ID
router.get('/:id', historyController.getValidationById);

// Get discrepancy results for a validation
router.get('/:id/discrepancies', historyController.getValidationDiscrepancies);

// Delete validation by ID
router.delete('/:id', historyController.deleteValidation);

export default router;
