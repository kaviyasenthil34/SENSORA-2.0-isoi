import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
} from "lucide-react";

export default function LoginPage() {
  const { loginWithCredentials, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setSubmitting(true);

    try {
      const loggedUser = await loginWithCredentials(email.trim().toLowerCase(), password);

      // Route based on role or previous location
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === "admin" || loggedUser.role === "superadmin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
      const serverMessage =
        err?.response?.data?.message || err?.message || "Invalid credentials. Please check and try again.";
      setError(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] grid-pattern px-4 sm:px-6 py-16 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900/60 backdrop-blur-xl shadow-2xl shadow-cyan-500/5">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/sensora-logo.png"
              alt="Sensora 2.0"
              className="h-11 w-auto object-contain rounded-xl shadow-lg shadow-purple-500/20"
            />
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block">
                SENSORA <span className="text-cyan-400">2.0</span>
              </span>
              <span className="text-[11px] uppercase tracking-wider text-gray-400">
                Sign In
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Sign in with your registered email and password to access your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-gray-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@vitstudent.ac.in or you@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-gray-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Your password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-300 font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold text-sm sm:text-base hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Switch to register */}
          <div className="mt-6 text-center text-xs sm:text-sm text-gray-400 pt-4 border-t border-gray-800">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 transition-colors"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
