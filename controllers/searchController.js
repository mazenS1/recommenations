const TMDB_API_KEY = process.env.KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const { redis } = require('../middleware/rateLimiter');

// Cache expiry time (in seconds)
const CACHE_EXPIRY = process.env.NODE_ENV === 'production' 
    ? 3600  // 1 hour in production
    : 300;  // 5 minutes in development

const searchMulti = async (req, res) => {
    try {
        const { query, page = 1 } = req.query;

        if (!query || !query.trim()) {
            return res.status(200).json({ results: [] });
        }

        // Include page in cache key
        const cacheKey = `search-${query.trim().toLowerCase()}-page-${page}`;
        const cachedData = await redis.get(cacheKey);
        
        if (cachedData) {
            try {
                const parsedData = JSON.parse(cachedData);
                return res.status(200).json(parsedData);
            } catch (parseError) {
            }
        }

        const response = await fetch(
            `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.status_message || 'Failed to perform search');
        }

        const filteredResults = data.results.filter(
            item => item.media_type === 'movie' || item.media_type === 'tv'
        );

        const responseData = {
            results: filteredResults,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        };

        try {
            await redis.set(cacheKey, JSON.stringify(responseData), { ex: CACHE_EXPIRY });
        } catch (cacheError) {
            console.error('Error caching data:', cacheError);
        }

        return res.status(200).json(responseData);

    } catch (error) {
        console.error('Error in multi search:', error);
        return res.status(error.status || 500).json({ 
            message: 'Search failed', 
            error: error.message 
        });
    }
};

const getTrendingMedia = async (req, res) => {
    try {
        const cacheKey = 'trending-media-day';
        const cachedData = await redis.get(cacheKey);
        
        if (cachedData) {
            try {
                const parsedData = JSON.parse(cachedData);
                return res.status(200).json(parsedData);
            } catch (parseError) {

            }
        }

        const response = await fetch(
            `${TMDB_BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.status_message || 'Failed to fetch trending media');
        }

        const filteredResults = data.results.filter(
            item => item.media_type === 'movie' || item.media_type === 'tv'
        );

        const responseData = {
            ...data,
            results: filteredResults
        };

        try {
            await redis.set(cacheKey, JSON.stringify(responseData));
            await redis.expire(cacheKey, CACHE_EXPIRY);
        } catch (cacheError) {
            console.error('Error caching data:', cacheError);
        }

        return res.status(200).json(responseData);

    } catch (error) {
        console.error('Error fetching trending media:', error);
        return res.status(error.status || 500).json({ 
            message: 'Failed to fetch trending media', 
            error: error.message 
        });
    }
};

module.exports = {
    searchMulti,
    getTrendingMedia
}; 