const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const Rating = require('../models/Rating');
const Movie = require('../models/Movie');
const movieController = require('./movieController');
const tvController = require('./tvController');




const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
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



        res.cookie('jwt', token, cookieOptions);
        

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

const rateMedia = async (req, res) => {
  try {
    const { movieId, rating, mediaType, notes } = req.body;
    const userId = req.user.userId;


    if (!movieId || !rating || !userId || !mediaType) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { movieId, rating, mediaType, userId }
      });
    }

    // Validate rating value
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5',
        received: rating
      });
    }

    // First ensure the media exists in our database
    let media = await Movie.findOne({ where: { movie_id: movieId }});
    if (!media) {
      // If media doesn't exist, fetch and save it based on type
      media = mediaType === 'tv' 
        ? await tvController.fetchAndSaveTvShow(movieId)
        : await movieController.fetchAndSaveMovie(movieId);
    }

    const existingRating = await Rating.findOne({
      where: { 
        user_id: userId, 
        movie_id: movieId
      }
    });

    if (existingRating) {
      await existingRating.update({ 
        rating,
        media_type: mediaType,
        notes: notes || existingRating.notes
      });
      return res.json({ message: 'Rating updated successfully' });
    }

    await Rating.create({
      user_id: userId,
      movie_id: movieId,
      media_type: mediaType,
      rating,
      notes
    });

    res.status(201).json({ message: 'Rating added successfully' });
  } catch (error) {
    console.error('Error in rateMedia:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message
    });
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
      include: [{
        model: Movie,
        attributes: ['movie_id', 'title', 'metadata']
      }]
    });

    const transformedRatings = ratings.map(rating => ({
      id: rating.Movie.movie_id,
      title: rating.Movie.title,
      poster_path: rating.Movie.metadata?.poster_path,
      vote_average: rating.Movie.metadata?.vote_average,
      rating: rating.rating,
      media_type: rating.media_type,
      notes: rating.notes
    }));

    res.json(transformedRatings);
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    res.status(500).json({ 
      message: 'Failed to fetch ratings',
      error: error.message 
    });
  }
};

const { Op } = require('sequelize');

const getUserHighlyRated = async (req, res) => {
  try{
    const userId = req.user.userId;
    const ratings = await Rating.findAll({
      where: {
        user_id: userId,
        rating: { [Op.gte]: 4 }
      },
      include: [{
        model: Movie,
        attributes: ['movie_id', 'title', 'metadata']
      }]
    });

    const transformedRatings = ratings.map(rating => ({
      id: rating.Movie.movie_id,
      title: rating.Movie.title,
      poster_path: rating.Movie.metadata?.poster_path,
      vote_average: rating.Movie.metadata?.vote_average,
      rating: rating.rating,
      media_type: rating.media_type,
      notes: rating.notes
    }));

    res.json(transformedRatings);
  }
  catch (error) {
    console.error('Error fetching user ratings:', error);
    res.status(500).json({ 
      message: 'Failed to fetch ratings',
      error: error.message 
    });
  }
}

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
    rateMedia,
    deleteRating,
    getUserRatings,
    getUserHighlyRated
};