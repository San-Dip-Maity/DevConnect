import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}auth/register`,
        form
      );
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
      <div className="w-full max-w-md bg-green-950/60 backdrop-blur-md border border-emerald-700/30 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
        {/* Green dot theme indicator */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-emerald-400 shadow-lg animate-pulse" />

        <h2 className="text-3xl font-extrabold text-center mb-6 tracking-wide text-emerald-200">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-200 bg-red-700/20 border border-red-500/20 rounded-md text-sm p-2 mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-emerald-300">
              Name
            </label>
            <div className="flex items-center bg-green-800/30 rounded-md border border-green-700 focus-within:ring-2 focus-within:ring-emerald-500 transition">
              <span className="px-3 text-emerald-400">
                <User size={18} />
              </span>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                onChange={handleChange}
                required
                className="w-full bg-transparent py-2 pr-4 text-white placeholder-emerald-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-emerald-300">
              Email
            </label>
            <div className="flex items-center bg-green-800/30 rounded-md border border-green-700 focus-within:ring-2 focus-within:ring-emerald-500 transition">
              <span className="px-3 text-emerald-400">
                <Mail size={18} />
              </span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
                className="w-full bg-transparent py-2 pr-4 text-white placeholder-emerald-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-emerald-300">
              Password
            </label>
            <div className="flex items-center bg-green-800/30 rounded-md border border-green-700 focus-within:ring-2 focus-within:ring-emerald-500 transition relative">
              <span className="px-3 text-emerald-400">
                <Lock size={18} />
              </span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onChange={handleChange}
                required
                className="w-full bg-transparent py-2 pr-10 text-white placeholder-emerald-300 focus:outline-none"
              />
              <span
                className="absolute right-3 cursor-pointer text-emerald-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition active:scale-95"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
