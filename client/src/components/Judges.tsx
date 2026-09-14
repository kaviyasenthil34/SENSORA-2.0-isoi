import { useInView } from '../hooks/useInView';
import { Award, Mic } from 'lucide-react';

const judges = [
  {
    name: 'Dr. Rajesh Kumar',
    role: 'Chief Technology Officer',
    company: 'TechCorp India',
    expertise: 'IoT & Embedded Systems',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of AI Research',
    company: 'DataLabs Inc.',
    expertise: 'AI & Machine Learning',
  },
  {
    name: 'Dr. Arjun Mehta',
    role: 'Director of Engineering',
    company: 'HealthTech Solutions',
    expertise: 'Healthcare Technology',
  },
  {
    name: 'Sneha Reddy',
    role: 'Principal Engineer',
    company: 'Innovate Systems',
    expertise: 'Embedded Systems',
  },
];

export default function Judges() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="judges" className="relative py-24 md:py-32">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-orange-400 tracking-widest uppercase">
            Mentors & Judges
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-3 mb-6">
            Judged by the best
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto text-balance">
            Distinguished speakers and industry leaders from top companies mentor participants
            and judge the final prototypes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {judges.map((judge, i) => (
            <div
              key={judge.name}
              className={`group p-6 rounded-2xl border border-gray-800 bg-gray-900/40 hover:bg-gray-900/70 hover:border-cyan-500/30 transition-all duration-500 hover:scale-105 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl font-bold text-white">
                  {judge.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{judge.name}</h3>
              <p className="text-sm text-cyan-400 mb-1">{judge.role}</p>
              <p className="text-sm text-gray-500 mb-3">{judge.company}</p>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-orange-400" />
                <span className="text-xs text-gray-400">{judge.expertise}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto p-6 rounded-2xl border border-gray-800 bg-gray-900/40 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-800/60 flex items-center justify-center flex-shrink-0">
            <Mic size={20} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-1">Live Evaluation & Jury Mentorship</p>
            <p className="text-sm text-gray-400">
              During the 36-hour sprint, expert judges and mentors review team prototypes directly to evaluate innovation, technical execution, and project feasibility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
