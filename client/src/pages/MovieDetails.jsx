import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRatings } from "../context/RatingsContext";
import toast from "react-hot-toast";
import { getMovieDetails, getMovieCredits } from "../lib/tmdb";

export const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    title: "",
    backdrop_path: "",
    poster_path: "",
    overview: "",
    release_date: "",
    runtime: 0,
    vote_average: 0,
    genres: [],
    director: null,
    cast: [],
    crew: [],
  });
  const [loading, setLoading] = useState(true);
  const { addRating } = useRatings();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieData, creditsData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
        ]);

        setMovie({
          ...movieData,
          title: movieData.title || "Untitled",
          backdrop_path: movieData.backdrop_path || "",
          poster_path: movieData.poster_path || "",
          overview: movieData.overview || "No overview available",
          release_date: movieData.release_date || "",
          runtime: movieData.runtime || 0,
          vote_average: movieData.vote_average || 0,
          genres: movieData.genres || [],
          director:
            creditsData.crew?.find((person) => person?.job === "Director") ||
            null,
          cast: (creditsData.cast || [])
            .filter((member) => member?.name)
            .slice(0, 6),
          crew: (creditsData.crew || [])
            .filter(
              (person) =>
                person?.job &&
                person?.name &&
                [
                  "Director of Photography",
                  "Original Music Composer",
                  "Screenplay",
                ].includes(person.job)
            )
            .slice(0, 3),
        });
      } catch (error) {
        console.error("Error fetching movie details:", error);
        toast.error("Failed to fetch movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleRate = async (rating) => {
    try {
      await addRating(
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
        },
        rating
      );
      toast.success("Rating saved!");
    } catch (error) {
      toast.error("Failed to save rating");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative">
        {/* Backdrop Image with smooth fade */}
        <div className="absolute inset-0 h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-b 
            from-transparent 
            via-gray-900/80 
            to-gray-900"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t 
            from-gray-900 
            to-transparent 
            opacity-90"
          />
          {movie.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800" />
          )}
        </div>

        {/* Content - Added z-20 to ensure it's above the gradients */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 pt-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white mb-6 hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster with gradient fade */}
            <div className="flex-shrink-0 relative w-64">
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/90 
                pointer-events-none z-10 rounded-lg"
              />
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              ) : (
                <div className="w-full h-[96px] bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No Poster</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">
                {movie.title}
              </h1>

              {/* Rating Stars */}
              <div className="flex items-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRate(rating)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  </button>
                ))}
              </div>

              <div className="text-gray-300 mb-4">
                <span>{movie.release_date?.split("-")[0]}</span>
                <span className="mx-2">•</span>
                <span>{movie.runtime} min</span>
                <span className="mx-2">•</span>
                <span>{movie.vote_average?.toFixed(1)} ⭐</span>
              </div>

              <p className="text-gray-200 mb-6">{movie.overview}</p>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Genres
                </h2>
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {movie.director && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Director
                  </h2>
                  <p className="text-gray-200 mb-2">{movie.director.name}</p>
                </div>
              )}

              {movie.cast.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Cast
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.map((castMember) => (
                      <span
                        key={castMember.id}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm"
                      >
                        {castMember.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {movie.crew.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Crew
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {movie.crew.map((crewMember) => (
                      <span
                        key={crewMember.id}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm"
                      >
                        {`${crewMember.name} (${crewMember.job})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
