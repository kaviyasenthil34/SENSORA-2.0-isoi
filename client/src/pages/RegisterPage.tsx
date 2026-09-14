import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  School,
  Building,
  GraduationCap,
  Home,
  Phone,
  User as UserIcon,
  Lock,
  Mail
} from "lucide-react";

export default function RegisterPage() {
  const { registerWithData, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "male" as "male" | "female" | "other",
    registrationNumber: "",
    hostelDetails: "",
    collegeName: "",
    departmentName: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cleanEmail = formData.email.trim().toLowerCase();

  const participantType = useMemo(() => {
    if (cleanEmail.endsWith("@vitstudent.ac.in")) return "internal";
    if (cleanEmail.endsWith("@gmail.com")) return "external";
    return null;
  }, [cleanEmail]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!participantType) {
      setError(
        "Please enter a valid email ending with @vitstudent.ac.in (Internal) or @gmail.com (External)."
      );
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your contact phone number.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (participantType === "internal") {
      if (!formData.registrationNumber.trim()) {
        setError("Registration Number is required for internal participants.");
        return;
      }
      if (!formData.hostelDetails.trim()) {
        setError("Hostel details are required for internal participants.");
        return;
      }
    } else {
      if (!formData.collegeName.trim()) {
        setError("College Name is required for external participants.");
        return;
      }
      if (!formData.departmentName.trim()) {
        setError("Department Name is required for external participants.");
        return;
      }
    }

    setSubmitting(true);

    try {
      await registerWithData({
        name: formData.name.trim(),
        email: cleanEmail,
        password: formData.password,
        phone: formData.phone.trim(),
        gender: formData.gender,
        registrationNumber:
          participantType === "internal" ? formData.registrationNumber.trim() : undefined,
        hostelDetails:
          participantType === "internal" ? formData.hostelDetails.trim() : undefined,
        collegeName:
          participantType === "external" ? formData.collegeName.trim() : undefined,
        departmentName:
          participantType === "external" ? formData.departmentName.trim() : undefined,
      });

      setSuccess("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 900);
    } catch (err: any) {
      const serverMessage =
        err?.response?.data?.message || err?.message || "Registration failed. Please try again.";
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

      <div className="relative w-full max-w-xl">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900/60 backdrop-blur-xl shadow-2xl shadow-cyan-500/5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
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
                  ISOI Hackathon Registration
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hidden sm:inline-block">
              36h Sprint
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white mt-4 mb-2">
            Create Participant Account
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Register yourself first. Once signed in, you can create a team or join your teammate's team using their team code.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3.5 text-gray-500" size={18} />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 text-gray-500" size={18} />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@vitstudent.ac.in or you@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>

                {/* Live Detection Badge */}
                {participantType === "internal" && (
                  <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium animate-fade-in">
                    <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0" />
                    <span>Internal Participant auto-detected (VIT Vellore)</span>
                  </div>
                )}

                {participantType === "external" && (
                  <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-medium animate-fade-in">
                    <CheckCircle2 size={14} className="text-orange-400 flex-shrink-0" />
                    <span>External Participant auto-detected (Personal Email)</span>
                  </div>
                )}

                {cleanEmail && !participantType && (
                  <p className="text-xs text-amber-400/90 mt-1.5 flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    Only @vitstudent.ac.in and @gmail.com email addresses are eligible.
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Password <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 text-gray-500" size={18} />
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Phone Number <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 text-gray-500" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Gender <span className="text-cyan-400">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* DYNAMIC EXTRA FIELDS */}
            <div className="pt-2">
              {!participantType && (
                <div className="p-4 rounded-xl border border-dashed border-gray-700 bg-gray-800/30 text-center">
                  <Sparkles className="w-5 h-5 text-gray-500 mx-auto mb-1.5 animate-pulse" />
                  <p className="text-xs font-medium text-gray-400">
                    Enter your email address above to unlock your participant details section.
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    VIT students: @vitstudent.ac.in &bull; External participants: @gmail.com
                  </p>
                </div>
              )}

              {participantType === "internal" && (
                <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-3.5 animate-slide-up">
                  <div className="flex items-center gap-2 pb-1 border-b border-cyan-500/20">
                    <GraduationCap size={16} className="text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      VIT Internal Participant Details
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Registration Number <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        required
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        placeholder="e.g. 22BCE0123"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-gray-900/80 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Hostel Details <span className="text-cyan-400">*</span>
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-2.5 text-gray-500" size={16} />
                        <input
                          type="text"
                          name="hostelDetails"
                          required
                          value={formData.hostelDetails}
                          onChange={handleChange}
                          placeholder="e.g. MH Block D, Room 402"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-gray-900/80 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {participantType === "external" && (
                <div className="p-4 rounded-2xl border border-orange-500/30 bg-orange-950/20 space-y-3.5 animate-slide-up">
                  <div className="flex items-center gap-2 pb-1 border-b border-orange-500/20">
                    <School size={16} className="text-orange-400" />
                    <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">
                      External Participant Academic Details
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        College / University Name <span className="text-orange-400">*</span>
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-2.5 text-gray-500" size={16} />
                        <input
                          type="text"
                          name="collegeName"
                          required
                          value={formData.collegeName}
                          onChange={handleChange}
                          placeholder="e.g. IIT Madras"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-gray-900/80 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Department / Major <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="departmentName"
                        required
                        value={formData.departmentName}
                        onChange={handleChange}
                        placeholder="e.g. Computer Science & Engg"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-gray-900/80 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-300 font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-emerald-300 font-medium">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold text-sm sm:text-base hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Registering account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Switch to login */}
          <div className="mt-6 text-center text-xs sm:text-sm text-gray-400 pt-4 border-t border-gray-800">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 transition-colors"
            >
              Sign In to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
