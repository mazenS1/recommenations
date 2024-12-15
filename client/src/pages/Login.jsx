import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, register, user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Trim whitespace and validate
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (!trimmedEmail || !trimmedPassword) {
          toast.error("Email and password are required");
          return;
        }

        await login(trimmedEmail, trimmedPassword);
        toast.success("Login successful!");
      } else {
        await register(name, email, password);
        toast.success("Registration successful!");
      }
    } catch (error) {
      toast.error(error.message || "Authentication failed");
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
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 outline-none bg-background text-foreground"
                  required={!isLogin}
                />
              </label>
            </div>
          )}
          <div>
            <label className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-primary bg-background">
              <Mail className="w-5 h-5 text-primary/60 mr-2" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 outline-none bg-background text-foreground"
                required
              />
            </label>
          </div>
          <div>
            <label className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-primary bg-background">
              <Lock className="w-5 h-5 text-primary/60 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 outline-none bg-background text-foreground"
                required
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-foreground text-background rounded-lg py-3 font-semibold hover:bg-foreground/90 transition-colors"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-primary/60">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-semibold hover:text-primary/80"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
        <div className="mt-4 text-center text-sm text-primary/60">
          <p>Demo credentials:</p>
          <p>Email: demo@example.com</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  );
};
