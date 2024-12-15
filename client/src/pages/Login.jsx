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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="flex justify-center mb-8">
          <Film className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          {isLogin ? "Welcome Back!" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="flex items-center border dark:border-gray-700 rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-gray-700">
                <User className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-2" />
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 outline-none dark:bg-gray-700 dark:text-white"
                  required={!isLogin}
                />
              </label>
            </div>
          )}
          <div>
            <label className="flex items-center border dark:border-gray-700 rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-gray-700">
              <Mail className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-2" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 outline-none dark:bg-gray-700 dark:text-white"
                required
              />
            </label>
          </div>

          <div>
            <label className="flex items-center border dark:border-gray-700 rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-gray-700">
              <Lock className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 outline-none dark:bg-gray-700 dark:text-white"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-semibold hover:text-indigo-800"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};
