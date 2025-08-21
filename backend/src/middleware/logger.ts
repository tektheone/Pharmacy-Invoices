import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip}`);
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusColor = status >= 400 ? '\x1b[31m' : status >= 300 ? '\x1b[33m' : '\x1b[32m';
    const resetColor = '\x1b[0m';
    
    console.log(
      `${statusColor}[${status}]${resetColor} ${req.method} ${req.path} - ${duration}ms`
    );
  });
  
  next();
};
