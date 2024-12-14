import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Recommendations } from "./pages/Recommendations";
import { MyRatings } from "./pages/MyRatings";
import { MediaDetails } from "./pages/MediaDetails";
import { Navbar } from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { RatingsProvider } from "./context/RatingsContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Toaster position="top-right" />
      {user ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/my-ratings" element={<MyRatings />} />
            <Route path="/:mediaType/:id" element={<MediaDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <RatingsProvider>
          <AppRoutes />
        </RatingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
