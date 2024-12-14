const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes

// Apply stricter rate limiting to auth routes
router.post('/register',  userController.register);
router.post('/login',  userController.login);

// Protected routes
router.post('/rate-movie', authenticateToken, userController.rateMovie);
router.delete('/rate-movie/:movieId', authenticateToken, userController.deleteRating);
router.get('/ratings', authenticateToken, userController.getUserRatings);

// check if user is logged in
router.get('/check', authenticateToken, (req, res) => {
    res.json({ 
        message: 'User is logged in',
        id: req.user.userId,
        email: req.user.email
    });
});

// Add logout route
router.post('/logout', userController.logout);

module.exports = router;