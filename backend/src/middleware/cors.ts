import { Request, Response, NextFunction } from 'express';
import { config } from '../config/environment';

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', config.frontendUrl);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};
