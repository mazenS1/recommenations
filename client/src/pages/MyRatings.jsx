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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            No Ratings Yet
          </h2>
          <p className="text-primary/60">
            Start rating movies and TV shows to see them here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Ratings</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ratings.map((media) => (
            <div key={media.id} className="relative group">
              <MediaCard {...media} />
              <button
                onClick={() => handleRemoveRating(media.id)}
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
