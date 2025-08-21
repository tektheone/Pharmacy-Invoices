import { Router } from 'express';
import { exportController } from '../controllers/exportController';

const router = Router();

// Export validation results to PDF
router.get('/pdf/:id', exportController.exportToPDF);

// Export validation results to Excel
router.get('/excel/:id', exportController.exportToExcel);

// Export validation results to CSV
router.get('/csv/:id', exportController.exportToCSV);

// Bulk export multiple validations
router.post('/bulk', exportController.bulkExport);

export default router;
