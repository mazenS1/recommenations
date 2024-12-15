import React, { useEffect, useState } from "react";
import { MovieCard } from "../components/MovieCard";
import { getRecommendations } from "../lib/tmdb";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const Recommendations = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (authLoading) return;

      const userId = user?.id || user?.user_id || user?._id;
      if (!userId) {
        console.error("User not found", user);
        toast.error("Please log in to see recommendations");
        return;
      }

      try {
        console.log("Fetching recommendations for user:", userId);
        const data = await getRecommendations(userId);
        console.log("Recommendations:", data);

        if (data && Array.isArray(data.results)) {
          setRecommendations(data.results.filter((movie) => movie.poster_path));
        } else {
          console.error("Invalid recommendations data:", data);
          setRecommendations([]);
        }
      } catch (error) {
        setError(error.message || "Failed to fetch recommendations");
        toast.error("Failed to fetch recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, authLoading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Recommendations Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Rate more movies and TV shows to get personalized recommendations!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Recommended for You
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recommendations.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster_path={movie.poster_path}
              vote_average={movie.vote_average}
              media_type="movie"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
