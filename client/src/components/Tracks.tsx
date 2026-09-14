import { Cpu, Brain, HeartPulse, CircuitBoard } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const tracks = [
  {
    icon: Cpu,
    title: 'Intelligent Hardware & IoT',
    description:
      'Build connected systems that bridge the physical and digital worlds. Smart devices, sensor networks, and edge computing.',
    gradient: 'from-cyan-500/20 to-blue-500/10',
    border: 'hover:border-cyan-500/40',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Brain,
    title: 'AI & Data-Driven Innovation',
    description:
      'Harness the power of machine learning, generative AI, and big data to solve complex problems with intelligent systems.',
    gradient: 'from-orange-500/20 to-red-500/10',
    border: 'hover:border-orange-500/40',
    iconColor: 'text-orange-400',
  },
  {
    icon: HeartPulse,
    title: 'Healthcare Technologies',
    description:
      'Create solutions that save lives and improve patient outcomes. Medtech, diagnostics, and accessible healthcare for all.',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'hover:border-emerald-500/40',
    iconColor: 'text-emerald-400',
  },
  {
    icon: CircuitBoard,
    title: 'Embedded Systems',
    description:
      'Push the limits of embedded design with firmware, real-time systems, and hardware-software integration at the lowest level.',
    gradient: 'from-violet-500/20 to-purple-500/10',
    border: 'hover:border-violet-500/40',
    iconColor: 'text-violet-400',
  },
];

export default function Tracks() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="tracks" className="relative py-24 md:py-32">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-orange-400 tracking-widest uppercase">
            Focus Areas
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-3 mb-6">
            Choose your battleground
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto text-balance">
            Compete in the domains that matter most. Four tracks, each demanding bold ideas
            and sharp execution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tracks.map((track, i) => (
            <div
              key={track.title}
              className={`group relative p-8 rounded-2xl border border-gray-800 bg-gradient-to-br ${track.gradient} ${track.border} transition-all duration-500 hover:scale-[1.02] cursor-default overflow-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-current" />

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gray-900/60 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <track.icon size={28} className={track.iconColor} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{track.title}</h3>
                <p className="text-gray-400 leading-relaxed">{track.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
