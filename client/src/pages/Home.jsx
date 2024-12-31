import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search } from "lucide-react";
import { MediaCard } from "../components/MediaCard";
import { searchMulti, getTrending } from "../lib/tmdb";
import { useRatings } from "../context/RatingsContext";
import toast from "react-hot-toast";
import { ErrorMessage } from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import { AuthError } from "../lib/apiClient";

export const Home = () => {
  const [query, setQuery] = useState("");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addRating } = useRatings();
  const { handleUnauthorized } = useAuth();

  // Ref for the search input
  const searchInputRef = useRef(null);

  const [searchTimeout, setSearchTimeout] = useState(null);

  const searchMedia = async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchQuery.trim()) {
        const data = await getTrending();
        setMedia(data.results);
        return;
      }

      const data = await searchMulti(searchQuery);
      setMedia(
        data.results.filter(
          (item) =>
            (item.media_type === "movie" || item.media_type === "tv") &&
            item.poster_path
        )
      );
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

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      searchMedia(value);
    }, 300);

    setSearchTimeout(timeoutId);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  useEffect(() => {
    // Initial load of trending content
    searchMedia("");
  }, []);

  useEffect(() => {
    // Focus input on initial load
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleRate = async (media, rating, notes) => {
    try {
      await addRating(media, rating, notes);
      toast.success("Rating saved");
    } catch (error) {
      toast.error("Failed to save rating");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 pt-24">
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  ref={searchInputRef}
                  value={query}
                  onChange={handleSearchInput}
                  placeholder="Search for movies and TV shows..."
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20"
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-5 h-5 text-primary/60" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <ErrorMessage message={error} retry={() => searchMedia(query)} />
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
            <p className="text-primary/60">
              {query ? "Searching..." : "Loading trending content..."}
            </p>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-primary/60">
              {query ? "No results found" : "No content available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {media.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={item.title || item.name}
                name={item.name}
                poster_path={item.poster_path}
                vote_average={item.vote_average}
                media_type={item.media_type}
                onRate={(rating, notes) => handleRate(item, rating, notes)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
