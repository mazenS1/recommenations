import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config";
import { fetchWithAuth } from "../lib/apiClient";

const RatingsContext = createContext(null);

export const RatingsProvider = ({ children }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRatings = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users/ratings`);

      if (!response.ok) {
        throw new Error("Failed to fetch ratings");
      }

      const data = await response.json();

      const transformedRatings = data.map((rating) => ({
        id: rating.Movie.movie_id,
        title: rating.Movie.title,
        poster_path: rating.Movie.metadata?.poster_path,
        rating: rating.rating,
        media_type: "movie",
        release_date: rating.Movie.release_date,
        vote_average: rating.Movie.metadata?.vote_average || 0,
      }));

      setRatings(transformedRatings);
    } catch (error) {
      toast.error("Failed to load ratings");
    } finally {
      setLoading(false);
    }
  }, []);

  const addRating = async (media, rating) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users/rate-movie`, {
        method: "POST",
        body: JSON.stringify({
          movieId: media.id,
          rating: parseInt(rating),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save rating");
      }

      setRatings((prev) => {
        const exists = prev.find((r) => r.id === media.id);
        if (exists) {
          return prev.map((r) =>
            r.id === media.id ? { ...media, rating } : r
          );
        }
        return [...prev, { ...media, rating }];
      });

      toast.success("Rating saved successfully");
    } catch (error) {
      toast.error(error.message || "Failed to save rating");
    } finally {
      setLoading(false);
    }
  };

  const removeRating = async (id) => {
    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/users/rate-movie/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove rating");
      }

      setRatings((prev) => prev.filter((r) => r.id !== id));
      toast.success("Rating removed successfully");
    } catch (error) {
      toast.error(error.message || "Failed to remove rating");
    }
  };

  return (
    <RatingsContext.Provider
      value={{
        ratings,
        addRating,
        removeRating,
        loading,
        fetchRatings,
      }}
    >
      {children}
    </RatingsContext.Provider>
  );
};

export const useRatings = () => {
  const context = useContext(RatingsContext);
  if (!context) {
    throw new Error("useRatings must be used within a RatingsProvider");
  }
  return context;
};
