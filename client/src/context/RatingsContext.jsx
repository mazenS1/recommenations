import React, { createContext, useContext, useState, useCallback } from "react";
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
      setRatings(data);
    } catch (error) {
      toast.error("Failed to load ratings");
    } finally {
      setLoading(false);
    }
  }, []);

  const addRating = async (media, rating, notes) => {
    try {
      if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
        throw new Error("Invalid rating value");
      }

      setRatings((prevRatings) => {
        const exists = prevRatings.find((r) => r.id === media.id);
        if (exists) {
          return prevRatings.map((r) =>
            r.id === media.id ? { ...r, rating, notes } : r
          );
        }
        return [...prevRatings, { ...media, rating, notes }];
      });

      const payload = {
        movieId: media.id,
        rating: parseInt(rating),
        mediaType: media.media_type || "movie",
        notes,
      };

      const response = await fetchWithAuth(`${API_BASE_URL}/users/rate-movie`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save rating");
      }
    } catch (error) {
      await fetchRatings();
      throw error;
    }
  };

  const removeRating = async (id) => {
    try {
      setRatings((prevRatings) => prevRatings.filter((r) => r.id !== id));

      const response = await fetchWithAuth(
        `${API_BASE_URL}/users/rate-movie/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove rating");
      }
    } catch (error) {
      await fetchRatings();
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
