const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database.config');
const setupMiddleware = require('./middleware/setup.middleware');
const setupRoutes = require('./routes');
const { getRedisClient } = require('./utils/redis.utils');

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env') });

const startServer = async () => {
  try {
    // Validate required environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    const app = express();
    
    // Initialize Redis connection but don't block server startup
    getRedisClient().catch(error => {
      console.warn('Redis initialization failed, continuing without Redis:', error.message);
    });
    
    // Setup middleware
    setupMiddleware(app);
    
    // Setup routes
    setupRoutes(app);
    
    // Connect to MongoDB
    await connectDB();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error.message);
    process.exit(1);
  }
};

startServer().catch(error => {
  console.error('Unhandled server error:', error.message);
  process.exit(1);
});