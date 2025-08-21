import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error for debugging
  console.error(`[ERROR] ${statusCode} - ${message}`);
  console.error(err.stack);

  // Don't leak error details in production
  const errorResponse = {
    error: {
      message: statusCode === 500 ? 'Internal Server Error' : message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  };

  res.status(statusCode).json(errorResponse);
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};
