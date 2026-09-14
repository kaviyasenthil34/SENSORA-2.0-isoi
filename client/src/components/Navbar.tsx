import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Shield,
  MessageSquare,
  UserPlus
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Tracks", href: "#tracks" },
  { label: "Schedule", href: "#schedule" },
  { label: "ISOI", href: "#isoi-board" },
  { label: "FAQ", href: "#faq" },
  { label: "Reach Us & Queries", href: "#contact" },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + href);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-cyan-500/10 shadow-lg shadow-black/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/sensora-logo.png"
              alt="Sensora 2.0"
              className="h-10 w-auto object-contain rounded-lg shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300"
            />

            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white hidden sm:inline">
              SENSORA <span className="text-cyan-400">2.0</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-xs sm:text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors duration-200 relative group cursor-pointer"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Admin Link if Admin */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-semibold hover:bg-red-500/20 transition-all"
                  >
                    <Shield size={14} />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 transition-all"
                >
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Link>

                {/* Participant badge */}
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    user.participantType === "internal"
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  }`}
                >
                  {user.participantType}
                </span>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                {/* Reach Us / Queries Direct Button */}
                <button
                  onClick={() => handleNavClick("#contact")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-gray-700 text-gray-300 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400 transition-all cursor-pointer"
                >
                  <MessageSquare size={13} />
                  <span>Reach Us</span>
                </button>

                {/* Sign In */}
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>

                {/* Register CTA */}
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold text-xs hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <UserPlus size={14} />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-6 pt-3 space-y-3 border-t border-gray-800 bg-[#0a0a0f]/95 rounded-b-2xl">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-900/60 rounded-lg transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-gray-800 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-sm"
                  >
                    <LayoutDashboard size={16} />
                    <span>Go to Team Dashboard</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/20 text-red-300 font-bold text-sm border border-red-500/30"
                    >
                      <Shield size={16} />
                      <span>Admin Center</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 py-2 text-red-400 text-xs font-semibold"
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 rounded-xl border border-gray-700 text-center text-sm font-semibold text-white hover:border-cyan-400"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-center text-sm font-bold text-black shadow-md shadow-cyan-500/20"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}