import app from './app';
import { config } from './config/environment';
import { DatabaseService } from './services/databaseService';

const PORT = config.port || 3001;

const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Environment: ${config.nodeEnv}`);
  
  try {
    // Initialize database connection
    DatabaseService.initialize();
    console.log(`🗄️  Database connection initialized`);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await DatabaseService.disconnect();
    console.log('Process terminated');
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(async () => {
    await DatabaseService.disconnect();
    console.log('Process terminated');
  });
});

export default server;
