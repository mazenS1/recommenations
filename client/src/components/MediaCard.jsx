import React, { useState } from "react";
import { Star, Tv, Film, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const MediaCard = ({
  id,
  title,
  name,
  poster_path,
  vote_average,
  media_type = "movie",
  onRate,
  userRating,
}) => {
  const [isRating, setIsRating] = useState(false);
  const navigate = useNavigate();
  const displayTitle = title || name;
  const TypeIcon = media_type === "movie" ? Film : Tv;

  const handleCardClick = (e) => {
    if (e.target.closest(".rating-stars")) return;
    navigate(`/${media_type}/${id}`);
  };

  const handleRate = async (ratingValue) => {
    if (isRating) return;
    setIsRating(true);
    try {
      await onRate(ratingValue);
    } catch (error) {
      console.error("Rating error:", error);
      toast.error("Failed to save rating");
    } finally {
      setIsRating(false);
    }
  };

  return (
    <div
      className="bg-background border rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={displayTitle}
          className="w-full h-[200px] sm:h-[300px] object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm rounded-full p-2">
          <TypeIcon className="w-4 h-4" />
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-1">
          {displayTitle}
        </h3>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
          <span className="text-primary/80">{vote_average.toFixed(1)}</span>
        </div>
        {onRate && (
          <div className="mt-2 sm:mt-3 rating-stars">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRate(value);
                  }}
                  disabled={isRating}
                  className="focus:outline-none touch-manipulation disabled:opacity-50"
                >
                  {isRating ? (
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-primary/60" />
                  ) : value <= (userRating || 0) ? (
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
