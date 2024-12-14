const movieController = require('../controllers/movieController');
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { rateLimiterMiddleware } = require('../middleware/rateLimiter');

router.get('/:movieId', authenticateToken, rateLimiterMiddleware, movieController.getMovieFromTMDB);
router.get('/:movieId/details', authenticateToken, rateLimiterMiddleware, movieController.getMovieDetails);
router.get('/:movieId/credits', authenticateToken, rateLimiterMiddleware, movieController.getMovieCredits);

module.exports = router;