import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Film, LogOut, Star, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import clsx from "clsx";

export const Navbar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Discover" },
    { path: "/recommendations", label: "Recommendations" },
    { path: "/my-ratings", label: "My Ratings", icon: Star },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-indigo-600/80 dark:bg-gray-900/80 backdrop-blur-sm text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Film className="w-8 h-8" />
            <span className="font-bold text-xl"> قيم</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={clsx(
                  "hover:text-indigo-200 flex items-center space-x-1",
                  location.pathname === path
                    ? "text-white font-semibold"
                    : "text-indigo-100"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{label}</span>
              </Link>
            ))}
            <div className="flex items-center space-x-4">
              <span className="text-sm">{user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 hover:text-indigo-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={clsx(
                  "block hover:text-indigo-200 py-2 flex items-center space-x-2",
                  location.pathname === path
                    ? "text-white font-semibold"
                    : "text-indigo-100"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{label}</span>
              </Link>
            ))}
            <div className="pt-4 border-t border-indigo-500">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm">{user?.name}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-1 hover:text-indigo-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
