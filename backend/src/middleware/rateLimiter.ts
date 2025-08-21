import { Request, Response, NextFunction } from 'express';
import { config } from '../config/environment';

// Simple in-memory rate limiting (in production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = config.rateLimitWindowMs;
  const maxRequests = config.rateLimitMax;
  
  // Get current request count for this IP
  const clientData = requestCounts.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    // First request or window expired
    requestCounts.set(clientIP, {
      count: 1,
      resetTime: now + windowMs,
    });
    next();
  } else if (clientData.count < maxRequests) {
    // Within limit
    clientData.count++;
    next();
  } else {
    // Rate limit exceeded
    res.status(429).json({
      error: {
        message: 'Too many requests, please try again later',
        statusCode: 429,
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
      },
    });
  }
};
