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
    console.log(`🔍 File upload attempt: ${file.originalname}, mimetype: ${file.mimetype}`);
    
    // Check file type - be more flexible with MIME types
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/octet-stream' || // Some systems send this for Excel files
      file.originalname.toLowerCase().endsWith('.xlsx') ||
      file.originalname.toLowerCase().endsWith('.xls')
    ) {
      console.log(`✅ File accepted: ${file.originalname}`);
      cb(null, true);
    } else {
      console.log(`❌ File rejected: ${file.originalname} (mimetype: ${file.mimetype})`);
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
