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
    console.log('Making authenticated request to:', cleanUrl);

    // Add SameSite and Secure attributes for cross-origin cookies
    const response = await fetch(cleanUrl, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
      credentials: 'include', // Ensure this is always set
    });

    console.log('Response received:', { status: response.status });

    // Handle authentication errors
    if (response.status === 401) {
      console.log('Authentication error - clearing user data');
      localStorage.removeItem("user");
      throw new AuthError();
    }

    return response;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}; 