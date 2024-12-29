const express = require('express');
const cors = require('cors');
const session = require('express-session');

function setupMiddleware(app, redisStore) {
  app.use(cors());
  app.use(express.json());
  app.use(session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
}

module.exports = setupMiddleware;