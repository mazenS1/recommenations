import React, { useState } from "react";
import { Star, Tv, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { RatingDialog } from "./RatingDialog";

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
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const navigate = useNavigate();
  const displayTitle = title || name;
  const TypeIcon = media_type === "movie" ? Film : Tv;

  const handleCardClick = (e) => {
    if (e.target.closest(".rating-stars")) return;
    navigate(`/${media_type}/${id}`);
  };

  const handleRatingClick = (e) => {
    e.stopPropagation();
    setShowRatingDialog(true);
  };

  const handleRatingSubmit = async (rating, notes) => {
    if (isRating) return;
    setIsRating(true);
    try {
      await onRate(rating, notes);
    } catch (error) {
      toast.error("Failed to save rating");
    } finally {
      setIsRating(false);
    }
  };

  return (
    <>
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
              <button
                onClick={handleRatingClick}
                className="w-full px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
              >
                {userRating ? "Update Rating" : "Rate This"}
              </button>
            </div>
          )}
        </div>
      </div>

      <RatingDialog
        isOpen={showRatingDialog}
        onClose={() => setShowRatingDialog(false)}
        onSubmit={handleRatingSubmit}
        initialRating={userRating}
        mediaTitle={displayTitle}
      />
    </>
  );
};
