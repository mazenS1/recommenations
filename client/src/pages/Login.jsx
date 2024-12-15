import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Mail, Lock, User, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validateName = (name) => {
  return name.trim().length >= 4;
};

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, register, user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    // Email validation
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!trimmedPassword) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(trimmedPassword)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Name validation (only for registration)
    if (!isLogin) {
      if (!trimmedName) {
        newErrors.name = "Name is required";
      } else if (!validateName(trimmedName)) {
        newErrors.name = "Name must be at least 4 characters long";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email.trim(), password.trim());
        toast.success("Login successful!");
      } else {
        await register(name.trim(), email.trim(), password.trim());
        toast.success("Registration successful!");
      }
    } catch (error) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field, value) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-background border rounded-lg shadow-sm p-8">
        <div className="flex justify-center mb-8">
          <Film className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-center text-foreground mb-8">
          {isLogin ? "Welcome Back!" : "Create Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-primary bg-background">
                <User className="w-5 h-5 text-primary/60 mr-2" />
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="flex-1 outline-none bg-background text-foreground"
                  required={!isLogin}
                />
              </label>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          )}
          <div>
            <label className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-primary bg-background">
              <Mail className="w-5 h-5 text-primary/60 mr-2" />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                className="flex-1 outline-none bg-background text-foreground"
                required
              />
            </label>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-primary bg-background">
              <Lock className="w-5 h-5 text-primary/60 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                className="flex-1 outline-none bg-background text-foreground"
                required
              />
            </label>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-foreground text-background rounded-lg py-3 font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {isLogin ? "Signing in..." : "Signing up..."}
              </>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-primary/60">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className="text-primary font-semibold hover:text-primary/80"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};
