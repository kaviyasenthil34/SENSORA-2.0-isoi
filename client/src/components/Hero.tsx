import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Users, MapPin, MessageSquare, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Configurable Event Target Date
export const EVENT_START_DATE = new Date("2026-09-16T10:00:00");

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function Hero() {
  const { user } = useAuth();
  const { days, hours, minutes, seconds } = useCountdown(EVENT_START_DATE);

  const timeUnits = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-pattern"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px] animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-orange-500/15 blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[150px]" />
      </div>

      {/* Watermark ISOI Chapter Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] pointer-events-none opacity-[0.05] select-none filter invert">
        <img src="/isoi-logo.png" alt="" className="w-full h-auto object-contain" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 sm:pt-28 pb-16">
        {/* Chapter pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-cyan-300 tracking-wider uppercase">
            The Instrument Society of India Presents
          </span>
        </div>

        {/* Hackathon title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6 animate-slide-up">
          SENSORA{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-orange-400 bg-clip-text text-transparent text-glow-cyan">
            2.0
          </span>
        </h1>

        <p
          className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-4 text-balance animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Where the sharpest minds compete to engineer hardware, intelligence, and edge systems.
          A 36-hour sprint pushing technical creativity to the absolute limit.
        </p>

        <p
          className="text-sm md:text-base font-bold text-orange-400 mb-10 tracking-wide animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          Think fast. Build faster. Compete to win.
        </p>

        {/* Countdown */}
        <div
          className="flex justify-center gap-2.5 sm:gap-4 md:gap-6 mb-12 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          {timeUnits.map((unit) => (
            <div
              key={unit.label}
              className="flex flex-col items-center justify-center p-3 sm:p-4 md:py-4 md:px-6 rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md min-w-[65px] sm:min-w-[85px] md:min-w-[100px] shadow-xl shadow-black/40"
            >
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 animate-slide-up"
          style={{ animationDelay: "0.25s" }}
        >
          {/* Main Register / Dashboard CTA */}
          <Link
            to={user ? "/dashboard" : "/register"}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-extrabold text-sm sm:text-base hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>{user ? "Go to Team Dashboard" : "Register Now"}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Queries / Reach Us Button (User requirement) */}
          <a
            href="#contact"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/20 text-cyan-300 font-bold text-sm sm:text-base hover:bg-cyan-900/30 hover:border-cyan-400 transition-all duration-300 cursor-pointer"
          >
            <MessageSquare size={16} />
            <span>Queries / Reach Us</span>
          </a>

          {/* Learn More anchor */}
          <a
            href="#about"
            className="px-6 py-3.5 rounded-xl border border-gray-700 text-gray-300 font-semibold text-sm sm:text-base hover:border-gray-500 hover:text-white transition-all duration-300"
          >
            Learn More
          </a>
        </div>

        {/* Quick info badges */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-10 mt-14 text-xs sm:text-sm text-gray-400 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/40 border border-gray-800">
            <Clock size={16} className="text-cyan-400" />
            <span>36 Hours Continuous Sprint</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/40 border border-gray-800">
            <Users size={16} className="text-cyan-400" />
            <span>1–4 Members Per Team</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/40 border border-gray-800">
            <MapPin size={16} className="text-cyan-400" />
            <span>Shakespeare Gallery - I</span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </section>
  );
}
