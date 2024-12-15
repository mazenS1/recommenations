import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  login as authLogin,
  register as authRegister,
  getCurrentUser,
  logout as authLogout,
} from "../lib/auth";
import { API_BASE_URL } from "../config";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleAuthError = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    toast.error("Session expired. Please login again.");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const data = await getCurrentUser();
        if (data) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          handleAuthError();
        }
      } catch (error) {
        handleAuthError();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [navigate]);

  // Add this method to handle auth errors anywhere in the app
  const handleUnauthorized = () => {
    handleAuthError();
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authLogin(email, password);
      if (!response.user) {
        throw new Error("No user data received");
      }
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await authRegister(name, email, password);
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authLogout();
    } catch (error) {
    } finally {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading, handleUnauthorized }}
    >
      {children}
    </AuthContext.Provider>
  );
};
