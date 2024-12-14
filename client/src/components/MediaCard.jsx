import React from "react";
import { Star, Tv, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MediaCard = ({
  id,
  title,
  name,
  poster_path,
  vote_average,
  media_type,
  onRate,
  userRating,
}) => {
  const navigate = useNavigate();
  const displayTitle = title || name;
  const TypeIcon = media_type === "movie" ? Film : Tv;

  const handleCardClick = (e) => {
    // Don't navigate if clicking on rating stars
    if (e.target.closest(".rating-stars")) return;
    navigate(`/${media_type}/${id}`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={displayTitle}
          className="w-full h-[200px] sm:h-[300px] object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2">
          <TypeIcon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-1 dark:text-white">
          {displayTitle}
        </h3>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
          <span className="dark:text-gray-300">{vote_average.toFixed(1)}</span>
        </div>
        {onRate && (
          <div className="mt-2 sm:mt-3 rating-stars">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRate(rating);
                  }}
                  className="focus:outline-none touch-manipulation"
                >
                  {rating <= (userRating || 0) ? (
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
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
