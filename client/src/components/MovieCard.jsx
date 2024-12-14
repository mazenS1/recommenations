import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export const MovieCard = ({
  id,
  title,
  poster_path,
  vote_average = 0,
  media_type = "movie",
  rating,
  onRate,
}) => {
  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/placeholder.png";

  return (
    <div className="relative group">
      <Link
        to={`/${media_type}/${id}`}
        className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105"
      >
        <div className="aspect-[2/3] relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
            {title}
          </h3>
          <div className="mt-2 flex items-center text-sm">
            <Star
              className={`w-4 h-4 ${
                rating ? "text-yellow-400" : "text-gray-400"
              }`}
            />
            <span className="ml-1 text-gray-600 dark:text-gray-400">
              {rating ||
                (vote_average && (vote_average / 2).toFixed(1)) ||
                "N/A"}
            </span>
          </div>
        </div>
      </Link>
      {onRate && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => onRate(value)}
              className={`p-1 ${
                rating >= value ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              <Star className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
