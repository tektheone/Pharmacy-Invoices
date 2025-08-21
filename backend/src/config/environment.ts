import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

export const config = {
  // Server configuration
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  databaseUrl: process.env.DATABASE_URL || 'postgresql://admin:password@localhost:5433/pharmacy_invoices',
  
  // External APIs
  mockApiUrl: process.env.MOCKAPI_URL || 'https://685daed17b57aebd2af6da54.mockapi.io/api/v1/drugs',
  
  // File upload configuration
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600', 10), // 100MB default
  
  // Frontend URL for CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per window
  
  // Validation thresholds
  unitPriceThreshold: parseInt(process.env.UNIT_PRICE_THRESHOLD || '10', 10), // 10% default
  
  // Cache configuration
  cacheDurationHours: parseInt(process.env.CACHE_DURATION_HOURS || '24', 10), // 24 hours default
} as const;

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`⚠️  Warning: ${envVar} is not set`);
  }
}
