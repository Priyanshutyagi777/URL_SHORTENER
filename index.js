const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database.config');
const setupMiddleware = require('./middleware/setup.middleware');
const setupRoutes = require('./routes');
const { getRedisClient } = require('./utils/redis.utils');

dotenv.config();

const startServer = async () => {
  const app = express();
  
  // Initialize Redis connection
  try {
    await getRedisClient();
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    // Continue app startup even if Redis fails
  }
  
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
};

startServer().catch(console.error);