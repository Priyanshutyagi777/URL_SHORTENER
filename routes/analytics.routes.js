const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const analyticsController = require('../controllers/analytics.controller');

router.get('/:alias', auth, analyticsController.getUrlAnalytics);
router.get('/topic/:topic', auth, analyticsController.getTopicAnalytics);
router.get('/overall', auth, analyticsController.getOverallAnalytics);

module.exports = router;