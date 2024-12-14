const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const Rating = require('../models/Rating');
const Movie = require('../models/Movie');
const movieController = require('./movieController');




const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);
        
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'no user' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'incorrect password' });
        }

        const token = jwt.sign(
            { userId: user.user_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        };

        console.log('Setting cookie with token:', token);
        console.log('Cookie options:', cookieOptions);

        res.cookie('jwt', token, cookieOptions);
        
        // Check if cookie was set
        console.log('Response headers:', res.getHeaders());

        const userData = {
            user_id: user.user_id,
            email: user.email,
            name: user.name
        };
        
        res.json({
            message: 'Login successful',
            user: userData
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = jwt.sign(
            { userId: user.user_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        };

        res.cookie('jwt', token, cookieOptions);

        res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const checkUser = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ where: { user_id: payload.userId } });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.json({
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

const rateMovie = async (req, res) => {
    try {
        const { movieId, rating } = req.body;
        const userId = req.user.userId;
        console.log("userId", userId, "movieId", movieId, "rating", rating);
        if (!movieId || !rating || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
            
            
        }

        // Validate rating value
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check for existing rating
        const existingRating = await Rating.findOne({
            where: { user_id: userId, movie_id: movieId }
        });

        // Check if movie exists in database, if not query it from TMDB
        const movie = await Movie.findOne({ where: { movie_id: movieId } });
        if (!movie) {
            await movieController.fetchAndSaveMovie(movieId);
        }



        if (existingRating) {
            // Update existing rating
            await existingRating.update({ rating });
            return res.json({ message: 'Rating updated successfully' });
        }

        // Create new rating
        await Rating.create({
            user_id: userId,
            movie_id: movieId,
            rating
        });

        res.status(201).json({ message: 'Rating added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteRating = async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.userId;

        const rating = await Rating.findOne({
            where: { user_id: userId, movie_id: movieId }
        });

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        await rating.destroy();
        res.json({ message: 'Rating deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserRatings = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const ratings = await Rating.findAll({
            where: { user_id: userId },
            include: [{ model: Movie }]
        });

        res.json(ratings);
    } catch (error) {
        console.error('Error fetching user ratings:', error);
        res.status(500).json({ 
            message: 'Failed to fetch ratings',
            error: error.message 
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    login,
    register,
    checkUser,
    logout,
    rateMovie,
    deleteRating,
    getUserRatings
};