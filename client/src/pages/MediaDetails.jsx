import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Calendar, Clock, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRatings } from "../context/RatingsContext";
import {
  getMovieDetails,
  getMovieCredits,
  getTvDetails,
  getTvCredits,
  getTvSeason,
} from "../lib/tmdb";
import { ErrorMessage } from "../components/ErrorMessage";

export const MediaDetails = () => {
  const { id, mediaType = "movie" } = useParams();
  const [media, setMedia] = useState({
    title: "",
    name: "",
    backdrop_path: "",
    poster_path: "",
    overview: "",
    release_date: "",
    first_air_date: "",
    runtime: 0,
    episode_run_time: [],
    vote_average: 0,
    genres: [],
    director: null,
    creator: null,
    cast: [],
    crew: [],
    seasons: [],
    number_of_seasons: 0,
    number_of_episodes: 0,
  });
  const [loading, setLoading] = useState(true);
  const { addRating } = useRatings();
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // First fetch the details
        const details = await (mediaType === "movie"
          ? getMovieDetails(id)
          : getTvDetails(id));

        setMedia({
          ...details,
          title: details.title || details.name || "Untitled",
          backdrop_path: details.backdrop_path || "",
          poster_path: details.poster_path || "",
          overview: details.overview || "No overview available",
          release_date: details.release_date || details.first_air_date || "",
          runtime: details.runtime || details.episode_run_time?.[0] || 0,
          vote_average: details.vote_average || 0,
          genres: details.genres || [],
          creator:
            mediaType === "tv"
              ? details.created_by?.find((person) => person?.name)
              : null,
          seasons: details.seasons || [],
          number_of_seasons: details.number_of_seasons || 0,
          number_of_episodes: details.number_of_episodes || 0,
          cast: [],
          crew: [],
        });

        // Then fetch credits separately
        try {
          const credits = await (mediaType === "movie"
            ? getMovieCredits(id)
            : getTvCredits(id));

          setMedia((prev) => ({
            ...prev,
            director:
              mediaType === "movie"
                ? credits.crew?.find((person) => person?.job === "Director")
                : null,
            cast: (credits.cast || [])
              .filter((member) => member?.name)
              .slice(0, 6),
            crew: (credits.crew || [])
              .filter(
                (person) =>
                  person?.job &&
                  person?.name &&
                  [
                    "Director of Photography",
                    "Original Music Composer",
                    "Screenplay",
                  ].includes(person.job)
              )
              .slice(0, 3),
          }));
        } catch (error) {
          toast.error("Failed to fetch credits");
          // Don't set main error state for credits failure
        }
      } catch (error) {
        setError(error.message || "Failed to load content");
        toast.error("Failed to fetch details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, mediaType]);

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <ErrorMessage message={error} retry={() => window.location.reload()} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
          <p className="text-primary/60">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {media.backdrop_path && (
        <div className="relative h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent z-10" />
          <img
            src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
            alt={media.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-80 relative z-20 pt-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-64 flex-shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
              alt={media.title}
              className="w-full rounded-lg shadow-xl border border-border"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {media.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-primary/60 mb-6">
              {media.release_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(media.release_date).getFullYear()}</span>
                </div>
              )}
              {media.runtime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{media.runtime} min</span>
                </div>
              )}
              {mediaType === "tv" && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {media.number_of_seasons} Seasons,{" "}
                    {media.number_of_episodes} Episodes
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{media.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {media.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="text-foreground mb-6">{media.overview}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Cast</h3>
                <div className="space-y-2">
                  {media.cast.map((person) => (
                    <div key={person.id} className="text-gray-300">
                      {person.name} as {person.character}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Crew</h3>
                <div className="space-y-2">
                  {mediaType === "movie" && media.director && (
                    <div className="text-gray-300">
                      Director: {media.director.name}
                    </div>
                  )}
                  {mediaType === "tv" && media.creator && (
                    <div className="text-gray-300">
                      Creator: {media.creator.name}
                    </div>
                  )}
                  {media.crew.map((person) => (
                    <div key={person.id} className="text-gray-300">
                      {person.job}: {person.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {mediaType === "tv" && media.seasons.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Seasons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {media.seasons.map((season) => (
                    <div
                      key={season.id}
                      className="bg-secondary rounded-lg p-4 flex gap-4"
                    >
                      {season.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${season.poster_path}`}
                          alt={season.name}
                          className="w-20 h-30 object-cover rounded"
                        />
                      )}
                      <div>
                        <h4 className="text-foreground font-semibold">
                          {season.name}
                        </h4>
                        <p className="text-primary/60 text-sm">
                          {season.episode_count} Episodes
                        </p>
                        {season.air_date && (
                          <p className="text-primary/60 text-sm">
                            {new Date(season.air_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
