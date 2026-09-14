import { useInView } from '../hooks/useInView';
import {
  Wrench,
  Mic2,
  GraduationCap,
  Cpu,
  Zap,
  Trophy,
  Users,
  Handshake,
  BrainCircuit,
  Target,
  Quote,
  Sparkles,
} from 'lucide-react';

/* ───── Board members ───── */
const boardMembers = [
  { name: 'Kaushik Kumar', role: 'Chairperson' },
  { name: 'Abisek Sasikumar', role: 'Vice Chairperson' },
  { name: 'Avinash', role: 'Secretary' },
  { name: 'Rithanya', role: 'Co-Secretary' },
  { name: 'Vedant Mali', role: 'Technical Head' },
  { name: 'Vaithiswarran', role: 'Logistics Head' },
  { name: 'Kaviya Shree', role: 'Events Head' },
  { name: 'Krishna Priya', role: 'R&D Head' },
  { name: 'Sakthi Deepashika', role: 'PR Head' },
  { name: 'Aswin', role: 'Design Head' },
  { name: 'Aniritha', role: 'Projects Head' },
];

/* ───── Stats ───── */
const stats = [
  { value: '2023', label: 'Founded' },
  { value: '250+', label: 'Members' },
  { value: '45+', label: 'Events' },
];

/* ───── Activities ───── */
const activities = [
  { icon: Wrench, title: 'Technical Sessions', desc: 'Hands-on learning on PLCs, SCADA, IoT, embedded systems, and industrial automation tools.' },
  { icon: Mic2, title: 'Industrial Seminars', desc: 'Seminars featuring industry leaders sharing real-world instrumentation and control practices.' },
  { icon: GraduationCap, title: 'Guest Lectures', desc: 'Expert talks from academicians and industry veterans on emerging technologies.' },
  { icon: Cpu, title: 'Technical Projects', desc: 'Collaborative student projects spanning sensors, control systems, and smart automation.' },
  { icon: Zap, title: 'Hackathons', desc: 'Intensive innovation sprints solving real instrumentation and automation challenges.' },
  { icon: Trophy, title: 'Competitions', desc: 'Technical contests testing knowledge in measurement, control, and system design.' },
  { icon: Users, title: 'Leadership Development', desc: 'Programs building communication, management, and team leadership capabilities.' },
  { icon: BrainCircuit, title: 'Hands-on Training', desc: 'Practical training on industry-grade instruments and automation platforms.' },
  { icon: Handshake, title: 'Networking', desc: 'Connecting students with peers, alumni, and industry professionals nationwide.' },
];

/* ───── Helpers ───── */
function SectionFadeIn({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  );
}

export default function ISOIBoard() {
  const { ref: boardRef, inView: boardInView } = useInView<HTMLDivElement>();

  return (
    <section id="isoi-board" className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle bg accents */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-orange-500/5 blur-[150px] pointer-events-none" />

      {/* Watermark ISOI Chapter Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] pointer-events-none opacity-[0.04] select-none filter invert">
        <img src="/isoi-logo.png" alt="" className="w-full h-auto object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* ═══════ Chapter Intro ═══════ */}
        <SectionFadeIn>
          <div className="text-center mb-8">
            <span className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">
              Student Chapter
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mt-3 mb-6">
              ISOI VIT Vellore Chapter
            </h2>
            <p className="text-sm text-gray-500 font-medium tracking-wider uppercase mb-6">Est. 2023 &bull; VIT Vellore</p>
            <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto text-balance leading-relaxed">
              ISOI Student Chapter at VIT Vellore is a vibrant community dedicated to advancing
              Instrumentation and Control Engineering by bridging academia and industry through
              workshops, technical events, projects, competitions, and professional networking.
            </p>
          </div>
        </SectionFadeIn>

        {/* ═══════ Stats ═══════ */}
        <SectionFadeIn>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 my-14">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center px-6 py-5 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm min-w-[130px] hover:border-cyan-500/30 transition-all duration-300"
              >
                <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-cyan-200">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </SectionFadeIn>

        {/* ═══════ Mission & Motto ═══════ */}
        <SectionFadeIn>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20">
            {/* Mission */}
            <div className="relative p-6 md:p-8 rounded-2xl border border-gray-800 bg-gray-900/40 group hover:border-cyan-500/30 transition-all duration-500">
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Target size={20} className="text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Our Mission</h3>
              </div>
              <div className="flex gap-2">
                <Quote size={16} className="text-cyan-500/40 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-400 leading-relaxed italic">
                  Our mission is to inspire and empower future engineers through technical excellence,
                  leadership, innovation, industry exposure, and collaborative learning.
                </p>
              </div>
            </div>

            {/* Motto */}
            <div className="relative p-6 md:p-8 rounded-2xl border border-gray-800 bg-gray-900/40 group hover:border-orange-500/30 transition-all duration-500">
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Sparkles size={20} className="text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Our Motto</h3>
              </div>
              <div className="flex gap-2">
                <Quote size={16} className="text-orange-500/40 flex-shrink-0 mt-0.5" />
                <p className="text-base md:text-lg text-orange-300/90 font-semibold italic">
                  Let Instruments Take You Away.
                </p>
              </div>
            </div>
          </div>
        </SectionFadeIn>

        {/* ═══════ Activities ═══════ */}
        <SectionFadeIn>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-orange-400 tracking-widest uppercase">
              What We Do
            </span>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-3 mb-4">
              Our Activities
            </h3>
            <p className="text-base text-gray-400 max-w-2xl mx-auto">
              From hands-on workshops to national-level competitions, we offer diverse technical experiences.
            </p>
          </div>
        </SectionFadeIn>

        <SectionFadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
            {activities.map((act, i) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.title}
                  className="group relative p-5 rounded-2xl border border-gray-800 bg-gray-900/40 hover:bg-gray-900/70 hover:border-cyan-500/20 transition-all duration-500 hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/10 to-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={18} className="text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1.5">{act.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{act.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionFadeIn>

        {/* ═══════ Board Members & Leadership ═══════ */}
        <div ref={boardRef} className={`transition-all duration-1000 ${boardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">
              Leadership
            </span>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white mt-3 mb-4">
              Our Team
            </h3>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              The passionate individuals driving ISOI VIT Vellore forward.
            </p>
          </div>

          {/* Board Group Photo Feature Card */}
          <div className="mb-14 max-w-5xl mx-auto rounded-3xl border border-gray-800 bg-gray-900/50 p-3 sm:p-4 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[16/10] bg-gray-950">
              <img
                src="/isoi-board-team.jpg"
                alt="ISOI VIT Vellore Board Members Leadership Team"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 flex flex-wrap items-center justify-between gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-[#0a0a0f]/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  ISOI VIT Board 2026
                </span>
                <span className="text-xs text-gray-300 font-medium bg-[#0a0a0f]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-800 hidden sm:inline-block">
                  Instrument Society of India — Student Chapter
                </span>
              </div>
            </div>
          </div>

          {/* Chairperson & Vice Chairperson — featured row */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {boardMembers.slice(0, 2).map((member, i) => (
              <div
                key={member.name}
                className={`group relative p-6 rounded-2xl border border-cyan-500/25 bg-gradient-to-b from-gray-900/80 to-gray-900/40 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 text-center w-56 ${boardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ring-2 ring-cyan-500/20">
                  <span className="text-lg font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{member.name}</h3>
                <p className="text-xs font-semibold text-cyan-400 mt-1.5 uppercase tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>

          {/* Secretary & Co-Secretary row */}
          <div className="flex flex-wrap justify-center gap-5 mb-8">
            {boardMembers.slice(2, 4).map((member, i) => (
              <div
                key={member.name}
                className={`group p-5 rounded-2xl border border-gray-800 bg-gray-900/40 hover:bg-gray-900/70 hover:border-cyan-500/30 transition-all duration-500 hover:scale-105 text-center w-48 ${boardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${(i + 2) * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/15 to-orange-500/15 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-base font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{member.name}</h3>
                <p className="text-xs text-cyan-400 mt-1">{member.role}</p>
              </div>
            ))}
          </div>

          {/* All Heads — grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {boardMembers.slice(4).map((member, i) => (
              <div
                key={member.name}
                className={`group p-4 rounded-2xl border border-gray-800 bg-gray-900/40 hover:bg-gray-900/70 hover:border-cyan-500/30 transition-all duration-500 hover:scale-105 text-center ${boardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${(i + 4) * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/15 to-orange-500/15 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-sm font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{member.name}</h3>
                <p className="text-[11px] text-cyan-400 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
