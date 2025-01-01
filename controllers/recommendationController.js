const axios = require('axios');
const TMDB_API_KEY = process.env.KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const UserController = require('../controllers/userController');
const { Op } = require('sequelize'); // Import Op for filtering
const Rating = require('../models/Rating');
const User = require('../models/User');
const Movie = require('../models/Movie');

const getSimilarContentForUserFromTMDB = async (req, res) => {
    const MAX_ITEMS_FOR_SIMILAR = 15; // Maximum number of items to fetch similar content for
    console.log('Request received');
    try {
        // get user id form the request
        const userId = req.user.userId;
        console.log('User ID:', userId);
        // Check if userId is defined and not null
        if (userId === undefined || userId === null) {
            console.log('User ID is undefined or null');
        }
        const ratings = await Rating.findAll({
            where: {
                user_id: userId,
                rating: { [Op.gte]: 4 }
            },
            attributes: ['movie_id', 'media_type'],
            include: [{
                model: Movie,
                attributes: ['movie_id']
            }]
        });
        const shuffledRatings = ratings.sort(() => 0.5 - Math.random());
        const limitedRatings = shuffledRatings.slice(0, MAX_ITEMS_FOR_SIMILAR);

        const similarRequests = limitedRatings.map(async (rating) => {
            const mediaType = rating.media_type;
            const id = rating.movie_id;
            const url = `${TMDB_BASE_URL}/${mediaType}/${id}/similar?api_key=${TMDB_API_KEY}&page=1`;
            
            try {
                const response = await fetch(url);
                const data = await response.json();
                return data.results || [];
            } catch (error) {
                console.error(`Error fetching similar content for ${mediaType} ${id}:`, error);
                return [];
            }
        });

        const similarResults = await Promise.all(similarRequests);
        
        // Flatten results and take first 10 unique items
        const uniqueResults = Array.from(
            new Map(
                similarResults.flat()
                    .map(item => [item.id, item])
            ).values()
        ).slice(0, 10);

        return res.json({ results: uniqueResults });
    } catch (error) {
        console.error('Error fetching similar content:', error);
        res.status(500).json({
            message: "Failed to fetch similar content",
            error: error.message
        });
    }
};

module.exports = {
    getSimilarContentForUserFromTMDB
};