const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Protect all recommendation routes
router.use(authenticateToken);

router.get('/:id', recommendationController.getRecommendationById);

module.exports = router;