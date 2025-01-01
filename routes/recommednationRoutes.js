const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { authenticateToken } = require('../middleware/auth');

// Protect all recommendation routes
router.use(authenticateToken);

// Only use the new similar endpoint
router.get('/similar', recommendationController.getSimilarContentForUserFromTMDB);

module.exports = router;