import express from 'express';
import cors from 'cors';
import { config } from './config/environment';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import { DatabaseService } from './services/databaseService';

const app = express();

// Initialize database connection
DatabaseService.connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Request logging
app.use(logger);

// Routes
app.use('/api', routes);

// Error handling (must be last)
app.use(errorHandler);

const PORT = config.port || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(async () => {
    console.log('🔌 HTTP server closed');
    await DatabaseService.disconnect();
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(async () => {
    console.log('🔌 HTTP server closed');
    await DatabaseService.disconnect();
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  });
});

export default server;
