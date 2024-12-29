const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth } = require('../middleware/auth.middleware');
const { rateLimiter } = require('../middleware/rateLimit.middleware');
const validate = require('../middleware/validate.middleware');
const urlController = require('../controllers/url.controller');

router.post('/shorten', 
  auth,
  rateLimiter,
  [
    body('longUrl').isURL().withMessage('Must be a valid URL'),
    body('topic').optional().isIn(['acquisition', 'activation', 'retention'])
  ],
  validate,
  urlController.createShortUrl
);

router.get('/:alias', urlController.redirectUrl);

module.exports = router;