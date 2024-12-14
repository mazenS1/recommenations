const Movie = require('../models/Movie');
const Genre = require('../models/Genre');
const MovieGenre = require('../models/MovieGenre');

const TMDB_API_KEY = process.env.KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const getMovieFromTMDB = async (req, res) => {
    try {
        const { movieId } = req.params;
        
        if (!movieId) {
            return res.status(400).json({ 
                message: 'Movie ID is required'
            });
        }

        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.status_message || 'Failed to fetch movie data');
        }

        const movieData = {
            movie_id: data.id,
            title: data.title,
            overview: data.overview,
            release_date: data.release_date,
            genre: data.genres.map(g => g.name).join(', '), // Convert genres array to string
            metadata: {
                poster_path: data.poster_path,
                vote_average: data.vote_average,
                original_language: data.original_language
            }
        };

        return res.status(200).json(movieData);

    } catch (error) {
        console.error('Error fetching movie from TMDB:', error);
        return res.status(error.status || 500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};


const fetchAndSaveMovie = async (movieId) => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.status_message);
        }

        // First, handle the movie creation
        const [movie] = await Movie.upsert({
            movie_id: data.id,
            title: data.title,
            overview: data.overview,
            release_date: data.release_date,
            genre: data.genres.map(g => g.name).join(', '), // Keep for backward compatibility
            metadata: {
                poster_path: data.poster_path,
                vote_average: data.vote_average,
                original_language: data.original_language
            }
        });

        // Handle genres
        if (data.genres && data.genres.length > 0) {
            // Get or create genres by name only
            const genrePromises = data.genres.map(async (genreData) => {
                const [genre] = await Genre.findOrCreate({
                    where: { name: genreData.name }
                });
                return genre;
            });
            
            const genres = await Promise.all(genrePromises);

            // Clear existing associations and create new ones
            await MovieGenre.destroy({ where: { movie_id: movie.movie_id } });
            await Promise.all(genres.map(genre => 
                MovieGenre.create({
                    movie_id: movie.movie_id,
                    genre_id: genre.genre_id
                })
            ));
        }

        return movie;
    } catch (error) {
        console.error('Error in fetchAndSaveMovie:', error);
        throw new Error(`Failed to fetch and save movie: ${error.message}`);
    }
};

const getMovieDetails = async (req, res) => {
    try {
        const { movieId } = req.params;
        
        if (!movieId) {
            return res.status(400).json({ 
                message: 'Movie ID is required'
            });
        }

        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.status_message || 'Failed to fetch movie details');
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching movie details:', error);
        return res.status(error.status || 500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

const getMovieCredits = async (req, res) => {
    try {
        const { movieId } = req.params;
        
        if (!movieId) {
            return res.status(400).json({ 
                message: 'Movie ID is required'
            });
        }

        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.status_message || 'Failed to fetch movie credits');
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching movie credits:', error);
        return res.status(error.status || 500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

module.exports = { 
    getMovieFromTMDB,
    fetchAndSaveMovie,
    getMovieDetails,
    getMovieCredits
};