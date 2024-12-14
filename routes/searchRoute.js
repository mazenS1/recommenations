const searchController = require('../controllers/searchController');
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Only need authentication since rate limiting is global
router.get('/', authenticateToken, searchController.searchMulti);
router.get('/trending', authenticateToken, searchController.getTrendingMedia);

module.exports = router; 