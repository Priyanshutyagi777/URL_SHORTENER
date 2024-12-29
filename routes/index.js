// const authRoutes = require('./auth.routes');
// const urlRoutes = require('./url.routes');
// const analyticsRoutes = require('./analytics.routes');

// function setupRoutes(app) {
//   app.use('/api/auth', authRoutes);
//   app.use('/api', urlRoutes);
//   app.use('/api/analytics', analyticsRoutes);
// }

// module.exports = setupRoutes;
const authRoutes = require('./auth.routes');
const urlRoutes = require('./url.routes');
const analyticsRoutes = require('./analytics.routes');
const swaggerMiddleware = require('../middleware/swagger.middleware');

function setupRoutes(app) {
  // API Documentation
  app.use('/api-docs', swaggerMiddleware.serve, swaggerMiddleware.setup);
  
  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api', urlRoutes);
  app.use('/api/analytics', analyticsRoutes);
}

module.exports = setupRoutes;