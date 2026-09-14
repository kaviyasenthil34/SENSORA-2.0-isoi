import { Linkedin, Mail, Instagram } from 'lucide-react';
import { ISOI_SOCIAL_CONFIG } from './Contact';

const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Tracks', href: '#tracks' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'ISOI Board', href: '#isoi-board' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Reach Us & Queries', href: '#contact' },
  { label: 'Register', href: '/register' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-800 py-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img
              src="/sensora-logo.png"
              alt="Sensora 2.0"
              className="h-12 w-auto object-contain rounded-xl shadow-lg shadow-purple-500/20"
            />
            <span className="font-extrabold text-xl tracking-tight text-white ml-1">
              SENSORA <span className="text-cyan-400">2.0</span>
            </span>
          </div>

          <p className="text-gray-500 max-w-md mb-8 text-balance">
            The Instrument Society of India's flagship hackathon. Think fast. Build faster.
            Compete to win.
          </p>

          <div className="flex items-center gap-4 mb-8">
            <a
              href={ISOI_SOCIAL_CONFIG.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ISOI LinkedIn"
              className="w-10 h-10 rounded-xl border border-gray-700 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300 hover:scale-110"
            >
              <Linkedin size={18} />
            </a>
            <a
              href={ISOI_SOCIAL_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ISOI Instagram"
              className="w-10 h-10 rounded-xl border border-gray-700 flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/50 transition-all duration-300 hover:scale-110"
            >
              <Instagram size={18} />
            </a>
            <a
              href={`mailto:${ISOI_SOCIAL_CONFIG.email}`}
              aria-label="ISOI Email"
              className="w-10 h-10 rounded-xl border border-gray-700 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all duration-300 hover:scale-110"
            >
              <Mail size={18} />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-8">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-cyan-400 transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="w-full max-w-md h-px bg-gray-800 mb-6" />

          <p className="text-xs text-gray-600">
            © 2026 Sensora 2.0 — The Instrument Society of India, VIT Vellore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
