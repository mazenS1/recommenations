import { toast } from "react-hot-toast";

export class AuthError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthError";
  }
}

export const fetchWithAuth = async (url, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  };

  // Clean up the URL to prevent double slashes
  const cleanUrl = url.replace(/([^:]\/)\/+/g, "$1");
  
  try {
    const response = await fetch(cleanUrl, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
      credentials: 'include',
    });

    // Handle authentication errors
    if (response.status === 401) {
      localStorage.removeItem("user");
      throw new AuthError();
    }

    

    return response;
  } catch (error) {
    throw error;
  }
}; 