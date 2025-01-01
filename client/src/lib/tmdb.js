import { fetchWithAuth, AuthError, getSimilarContent } from './apiClient';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../config';


// Simple cache object
const cache = {
  search: new Map(),
  details: new Map(),
  recommendations: new Map()
};

// Cache expiration time (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 3, delayMs = 2000) => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchWithAuth(url, options);
    } catch (error) {
      
      // If it's an auth error, don't retry
      if (error instanceof AuthError) {
        throw error;
      }
      
      lastError = error;
      if (i === retries - 1) break;
      await delay(delayMs * (i + 1));
    }
  }
  
  throw lastError || new Error('Failed after multiple retries');
};

export const searchMulti = async (query) => {
  if (!query.trim()) return { results: [] };
  
  const cacheKey = `search-${query}`;
  const cached = cache.search.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.data;
  }

  const response = await fetchWithRetry(
    `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`,
    {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to search');
  }

  const data = await response.json();
  
  cache.search.set(cacheKey, {
    timestamp: Date.now(),
    data
  });
  
  return data;
};

export const getDetails = async (id, type) => {
  const cacheKey = `${type}-${id}`;
  const cached = cache.details.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.data;
  }

  const response = await fetchWithRetry(
    `${API_BASE_URL}/api/v1/${type}/${id}/details`,
    {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch details');
  }

  cache.details.set(cacheKey, {
    timestamp: Date.now(),
    data
  });
  
  return data;
};

export const getMovieDetails = async (movieId) => {
  const cacheKey = `movie-details-${movieId}`;
  const cached = cache.details.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.data;
  }

  const response = await fetchWithRetry(
    `${API_BASE_URL}/movies/${movieId}/details`,
    {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch movie details');
  }

  cache.details.set(cacheKey, {
    timestamp: Date.now(),
    data
  });
  
  return data;
};

export const getMovieCredits = async (movieId) => {
  const cacheKey = `movie-credits-${movieId}`;
  const cached = cache.details.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.data;
  }

  const response = await fetchWithRetry(
    `${API_BASE_URL}/movies/${movieId}/credits`,
    {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch movie credits');
  }

  cache.details.set(cacheKey, {
    timestamp: Date.now(),
    data
  });
  
  return data;
};

// Add new functions for TV shows
export const getTvDetails = async (tvId) => {
  const cacheKey = `tv-details-${tvId}`;
  const cached = cache.details.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.data;
  }

  const response = await fetchWithRetry(
    `${API_BASE_URL}/tv/${tvId}/details`,
    {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch TV show details');
  }

  cache.details.set(cacheKey, {
    timestamp: Date.now(),
    data
  });
  
  return data;
};

export const getTvCredits = async (tvId) => {
  const cacheKey = `tv-credits-${tvId}`;
  const cached = cache.details.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.data;
  }

  const response = await fetchWithRetry(
    `${API_BASE_URL}/tv/${tvId}/credits`,
    {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch TV show credits');
  }

  cache.details.set(cacheKey, {
    timestamp: Date.now(),
    data
  });
  
  return data;
};

export const getTvSeason = async (tvId, seasonNumber) => {
  const cacheKey = `tv-season-${tvId}-${seasonNumber}`;
  const cached = cache.details.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.data;
  }

  const response = await fetchWithRetry(
    `${API_BASE_URL}/tv/${tvId}/season/${seasonNumber}`,
    {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch TV season details');
  }

  cache.details.set(cacheKey, {
    timestamp: Date.now(),
    data
  });
  
  return data;
};

export const getTrending = async () => {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/search/trending`,
    {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch trending media');
  }
  
  const data = await response.json();
  return data;
};