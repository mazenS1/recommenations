import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { MediaCard } from "../components/MediaCard";
import { searchMulti, getTrending } from "../lib/tmdb";
import { useRatings } from "../context/RatingsContext";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import { ErrorMessage } from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import { AuthError } from "../lib/apiClient";

const key = import.meta.env.VITE_TMDB_API_KEY;
export const Home = () => {
  const [query, setQuery] = useState("");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addRating } = useRatings();
  const { handleUnauthorized } = useAuth();

  const searchMedia = async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchQuery.trim()) {
        const data = await getTrending();
        if (data && Array.isArray(data.results)) {
          setMedia(data.results.filter((item) => item.poster_path));
        } else {
          console.error("Invalid trending data:", data);
          setMedia([]);
        }
        return;
      }

      const data = await searchMulti(searchQuery);
      if (data && Array.isArray(data.results)) {
        setMedia(
          data.results.filter(
            (item) =>
              (item.media_type === "movie" || item.media_type === "tv") &&
              item.poster_path
          )
        );
      } else {
        console.error("Invalid search data:", data);
        setMedia([]);
      }
    } catch (error) {
      if (error instanceof AuthError) {
        handleUnauthorized();
        return;
      }
      setError(error.message || "Failed to load content");
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => searchMedia(query), 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const handleRate = async (item, rating) => {
    try {
      await addRating(
        {
          id: item.id,
          title: item.title || item.name,
          poster_path: item.poster_path,
          vote_average: item.vote_average,
        },
        rating
      );
    } catch (error) {
      toast.error("Failed to save rating");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 pt-24">
        <div className="mb-4 sm:mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for movies and TV shows..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none pr-10"
                disabled={loading}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {error ? (
          <ErrorMessage message={error} retry={() => searchMedia(query)} />
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {query ? "Searching..." : "Loading trending content..."}
            </p>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {query ? "No results found" : "No content available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {media.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={item.title || item.name}
                name={item.name}
                poster_path={item.poster_path}
                vote_average={item.vote_average}
                media_type={item.media_type}
                onRate={(rating) => handleRate(item, rating)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
