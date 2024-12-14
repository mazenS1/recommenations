const tvController = require('../controllers/tvController');
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { rateLimiterMiddleware } = require('../middleware/rateLimiter');

// All routes require authentication and are rate limited
router.get('/:tvId/details', authenticateToken, rateLimiterMiddleware, tvController.getTvShowDetails);
router.get('/:tvId/credits', authenticateToken, rateLimiterMiddleware, tvController.getTvShowCredits);
router.get('/:tvId/season/:seasonNumber', authenticateToken, rateLimiterMiddleware, tvController.getTvShowSeasons);

module.exports = router; 