import { Router } from 'express';
import multer from 'multer';
import { validateFileUpload } from '../middleware/validation';
import { validationController } from '../controllers/validationController';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  },
});

// File upload and validation
router.post('/upload', 
  upload.single('file'),
  validateFileUpload,
  validationController.uploadAndValidate
);

// Get validation status
router.get('/status/:id', validationController.getValidationStatus);

// Get validation results
router.get('/results/:id', validationController.getValidationResults);

// Cancel validation
router.delete('/cancel/:id', validationController.cancelValidation);

export default router;
