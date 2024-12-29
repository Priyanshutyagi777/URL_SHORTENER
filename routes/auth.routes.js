const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const authController = require('../controllers/auth.controller');

router.post('/google',
  [
    body('token').notEmpty().withMessage('Google token is required')
  ],
  validate,
  authController.googleSignIn
);

router.post('/logout', authController.logout);

module.exports = router;