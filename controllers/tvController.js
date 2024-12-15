const TMDB_API_KEY = process.env.KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const Movie = require('../models/Movie');

const getTvShowDetails = async (req, res) => {
    try {
        const { tvId } = req.params;
        
        if (!tvId) {
            return res.status(400).json({ 
                message: 'TV Show ID is required'
            });
        }

        const response = await fetch(
            `${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.status_message || 'Failed to fetch TV show details');
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching TV show details:', error);
        return res.status(error.status || 500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

const getTvShowCredits = async (req, res) => {
    try {
        const { tvId } = req.params;
        
        if (!tvId) {
            return res.status(400).json({ 
                message: 'TV Show ID is required'
            });
        }

        const response = await fetch(
            `${TMDB_BASE_URL}/tv/${tvId}/credits?api_key=${TMDB_API_KEY}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.status_message || 'Failed to fetch TV show credits');
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching TV show credits:', error);
        return res.status(error.status || 500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

const getTvShowSeasons = async (req, res) => {
    try {
        const { tvId, seasonNumber } = req.params;
        
        if (!tvId || !seasonNumber) {
            return res.status(400).json({ 
                message: 'TV Show ID and season number are required'
            });
        }

        const response = await fetch(
            `${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.status_message || 'Failed to fetch TV show season details');
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching TV show season:', error);
        return res.status(error.status || 500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

const fetchAndSaveTvShow = async (tvId) => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.status_message);
        }

        const [show] = await Movie.upsert({
            movie_id: data.id,
            title: data.name,
            overview: data.overview,
            release_date: data.first_air_date,
            genre: data.genres.map(g => g.name).join(', '),
            metadata: {
                poster_path: data.poster_path,
                vote_average: data.vote_average,
                original_language: data.original_language,
                media_type: 'tv'
            }
        });

        return show;
    } catch (error) {
        throw new Error(`Failed to fetch and save TV show: ${error.message}`);
    }
};

module.exports = {
    getTvShowDetails,
    getTvShowCredits,
    getTvShowSeasons,
    fetchAndSaveTvShow
}; 