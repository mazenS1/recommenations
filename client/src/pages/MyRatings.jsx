import React, { useEffect } from "react";
import { useRatings } from "../context/RatingsContext";
import { MovieCard } from "../components/MovieCard";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export const MyRatings = () => {
  const { ratings, loading, fetchRatings, removeRating, addRating } =
    useRatings();

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const handleRemoveRating = async (id) => {
    await removeRating(id);
  };

  const handleUpdateRating = async (movie, newRating) => {
    await addRating(movie, newRating);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!ratings.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Ratings Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Start rating movies and TV shows to see them here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          My Ratings
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ratings.map((movie) => (
            <div key={movie.id} className="relative group">
              <MovieCard
                id={movie.id}
                title={movie.title}
                poster_path={movie.poster_path}
                vote_average={movie.vote_average}
                rating={movie.rating}
                media_type="movie"
                onRate={(rating) => handleUpdateRating(movie, rating)}
              />
              <button
                onClick={() => handleRemoveRating(movie.id)}
                className="absolute top-2 right-2 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
