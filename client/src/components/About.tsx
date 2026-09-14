import { Zap, Trophy, Mic, Target, Users } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const features = [
  {
    icon: Zap,
    title: '36-Hour Sprint',
    description:
      'Two intense days where teams go head-to-head, pushing creativity, speed, and technical skill to their absolute limit.',
    accent: 'text-orange-400',
    glow: 'group-hover:shadow-orange-500/20',
  },
  {
    icon: Users,
    title: 'Mentorship & Guidance',
    description:
      'Receive hands-on guidance and architecture feedback from coordinators and mentors throughout your 36-hour build.',
    accent: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/20',
  },
  {
    icon: Trophy,
    title: 'Industry Judges',
    description:
      'Distinguished speakers and industry leaders from top companies mentor participants and judge the final prototypes.',
    accent: 'text-orange-400',
    glow: 'group-hover:shadow-orange-500/20',
  },
  {
    icon: Target,
    title: 'Real-World Impact',
    description:
      'Solve real problems with real impact across IoT, AI, Healthcare Tech, and Embedded Systems. Build what matters.',
    accent: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/20',
  },
];

export default function About() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />

      <div ref={ref} className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">
            The Arena
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-3 mb-6">
            Not a showcase. A battleground.
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto text-balance">
            Sensora 2.0 is where the sharpest minds come together to compete, build, and
            define what's next. Teams race against each other — refining ideas under
            pressure, pivoting fast, and defending solutions in front of the toughest
            judges in the industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative p-8 rounded-2xl border border-gray-800 bg-gray-900/30 hover:bg-gray-900/60 transition-all duration-500 hover:border-gray-700 hover:shadow-2xl ${feature.glow} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-800/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={24} className={feature.accent} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
