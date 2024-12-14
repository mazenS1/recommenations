const axios = require('axios');
const TMDB_API_KEY = process.env.KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const getRecommendationsFromTMDB = async (req, res) => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&page=1&vote_count.gte=1000`
        );
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.status_message || 'Failed to fetch recommendations');
        }

        return res.json({ results: data.results }); // Wrap in results object
    } catch (error) {
        console.error("Error fetching TMDB recommendations:", error);
        return res.status(500).json({
            message: "Failed to fetch TMDB recommendations",
            error: error.message
        });
    }
};

const getRecommendationById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "User ID required" });
        }

        // Remove the external API call and just use TMDB
        console.log("Fetching recommendations from TMDB");
        return await getRecommendationsFromTMDB(req, res);
        
    } catch (error) {
        console.error("Error in getRecommendationById:", error);
        return res.status(500).json({ 
            message: "Error fetching recommendations",
            error: error.message 
        });
    }
};

module.exports = {
    getRecommendationById,
    getRecommendationsFromTMDB
};