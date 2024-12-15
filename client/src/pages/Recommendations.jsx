import React, { useEffect, useState } from "react";
import { MediaCard } from "../components/MediaCard";
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
        toast.error("Please log in to see recommendations");
        return;
      }

      try {
        const data = await getRecommendations(userId);

        if (data && Array.isArray(data.results)) {
          setRecommendations(data.results.filter((movie) => movie.poster_path));
        } else {
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            No Recommendations Yet
          </h2>
          <p className="text-primary/60">
            Rate more movies and TV shows to get personalized recommendations!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Recommended for You
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recommendations.map((media) => (
            <MediaCard key={media.id} {...media} />
          ))}
        </div>
      </div>
    </div>
  );
};
