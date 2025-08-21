import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { createError } from './errorHandler';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = createError(
          'Validation failed',
          400
        );
        validationError.message = error.errors.map(e => e.message).join(', ');
        next(validationError);
      } else {
        next(error);
      }
    }
  };
};

export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(createError('No file uploaded', 400));
  }
  
  // Check file type
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ];
  
  if (!allowedTypes.includes(req.file.mimetype)) {
    return next(createError('Invalid file type. Only Excel files (.xlsx, .xls) are allowed', 400));
  }
  
  // Check file size (100MB limit)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (req.file.size > maxSize) {
    return next(createError('File size too large. Maximum size is 100MB', 400));
  }
  
  next();
};
