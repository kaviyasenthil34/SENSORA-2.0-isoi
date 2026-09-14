import { useState } from "react";
import { useInView } from "../hooks/useInView";
import { submitQueryApi } from "../lib/api";
import {
  Mail,
  Phone,
  Linkedin,
  Instagram,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from "lucide-react";

// =========================================================================
// SOCIAL & CONTACT LINKS CONFIGURATION
// You can easily update your official ISOI URLs below:
// =========================================================================
export const ISOI_SOCIAL_CONFIG = {
  // Official ISOI LinkedIn page URL:
  linkedinUrl: "https://www.linkedin.com/company/isoi-vit-vellore/",
  // Official ISOI Instagram profile URL:
  instagramUrl: "https://www.instagram.com/isoi.vit?stkn=NTByemplcWd6OW5r",
  // Official ISOI email:
  email: "isoi@vit.ac.in",
  // Official contact phone:
  phone: "+91 98765 43210",
  // Campus Venue:
  venue: "Shakespeare Gallery - I, Technology Tower, VIT Vellore",
};

export default function Contact() {
  const { ref, inView } = useInView<HTMLDivElement>();

  // Query Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    teamName: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation: All 4 fields are strictly mandatory
    if (!form.name.trim() || !form.email.trim() || !form.teamName.trim() || !form.message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill in all mandatory fields: Name, Email, Team Name, and your Question.");
      return;
    }

    setStatus("submitting");

    try {
      await submitQueryApi({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        teamName: form.teamName.trim(),
        message: form.message.trim(),
      });

      setStatus("success");
      setForm({ name: "", email: "", teamName: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(
        err?.response?.data?.message || "Failed to submit query. Please try again."
      );
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 scroll-mt-20">
      {/* Anchor for Queries */}
      <div id="queries" className="absolute -top-20" />

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-cyan-400 tracking-widest uppercase inline-flex items-center gap-1.5">
            <Sparkles size={14} />
            Reach Us & Participant Queries
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-3 mb-4">
            Have Questions? Ask Us Directly.
          </h2>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto text-balance">
            Connect with the ISOI team or submit your query below. Our organizing committee and mentors will assist your team promptly.
          </p>
        </div>

        {/* TOP: TOUCHABLE / CLICKABLE SOCIAL & REACH-OUT CARDS */}
        <div className="mb-14">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-6">
            Official Chapter Channels (Tap to Connect)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* LinkedIn Card */}
            <a
              href={ISOI_SOCIAL_CONFIG.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-2xl border border-gray-800 bg-gray-900/50 hover:bg-gray-850 hover:border-cyan-500/50 transition-all duration-300 flex items-center gap-4 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/40"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
                <Linkedin size={22} />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    LinkedIn
                  </p>
                  <ExternalLink size={12} className="text-gray-500 group-hover:text-cyan-400" />
                </div>
                <p className="text-xs text-gray-400 truncate">ISOI Student Chapter</p>
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href={ISOI_SOCIAL_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-2xl border border-gray-800 bg-gray-900/50 hover:bg-gray-850 hover:border-orange-500/50 transition-all duration-300 flex items-center gap-4 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/40"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500/15 to-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:bg-gradient-to-tr group-hover:from-orange-500 group-hover:to-pink-500 group-hover:text-white transition-all flex-shrink-0">
                <Instagram size={22} />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                    Instagram
                  </p>
                  <ExternalLink size={12} className="text-gray-500 group-hover:text-orange-400" />
                </div>
                <p className="text-xs text-gray-400 truncate">@isoi_vit</p>
              </div>
            </a>

            {/* ISOI Gmail Card */}
            <a
              href={`mailto:${ISOI_SOCIAL_CONFIG.email}`}
              className="group p-5 rounded-2xl border border-gray-800 bg-gray-900/50 hover:bg-gray-850 hover:border-emerald-500/50 transition-all duration-300 flex items-center gap-4 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/40"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all flex-shrink-0">
                <Mail size={22} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Email Us
                </p>
                <p className="text-xs text-gray-400 truncate">{ISOI_SOCIAL_CONFIG.email}</p>
              </div>
            </a>
          </div>
        </div>

        {/* CENTERED ASK QUERY FORM */}
        <div className="max-w-2xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900/60 backdrop-blur-xl relative">
            <div className="flex items-center gap-2.5 mb-2">
              <MessageSquare className="text-cyan-400" size={20} />
              <h3 className="text-xl font-bold text-white">Ask a Query</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-6">
              Please provide your details and team name so we can identify and address your query accurately.
            </p>

            {status === "success" ? (
              <div className="text-center py-10 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold text-white">Query Submitted!</h4>
                <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
                  Thank you! Our coordinators have received your query and will assist your team promptly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Ask Another Question
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name (Mandatory) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Your Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Alex Johnson"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>

                {/* Email (Mandatory) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Your Email <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. alex@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>

                {/* Team Name (Mandatory) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Team Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.teamName}
                    onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                    placeholder="e.g. InnovatorsHub"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>

                {/* Query / Message (Mandatory) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Your Query <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What would you like to ask regarding tracks, hardware, evaluation, or logistics?"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all resize-y"
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-300">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold text-sm hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending query...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Query</span>
                    </>
                  )}
                </button>
              </form>
            )}


          </div>
        </div>
      </div>
    </section>
  );
}

