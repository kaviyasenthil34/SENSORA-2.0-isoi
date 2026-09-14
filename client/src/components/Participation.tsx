import { Building2, Globe, CheckCircle2, Users } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export default function Participation() {
  const { ref, inView } = useInView<HTMLDivElement>();

  const categories = [
    {
      icon: Building2,
      title: 'Internal Participants',
      subtitle: 'VIT Vellore Students',
      emailDomain: '@vitstudent.ac.in',
      accent: 'cyan',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/5',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
      textColor: 'text-cyan-300',
      features: [
        'Use your VIT student email to register',
        'Automatically identified as internal',
        'On-campus participation',
        'Access to all sessions and facilities',
      ],
    },
    {
      icon: Globe,
      title: 'External Participants',
      subtitle: 'Outside VIT Vellore',
      emailDomain: '@gmail.com',
      accent: 'orange',
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/5',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      textColor: 'text-orange-300',
      features: [
        'Register with your Gmail address',
        'Automatically identified as external',
        'Travel and accommodation self-managed',
        'Full access to all event activities',
      ],
    },
  ];

  return (
    <section id="participation" className="relative py-24 md:py-32">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">
            Who Can Participate
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-3 mb-6">
            Two paths. One arena.
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto text-balance">
            Sensora 2.0 welcomes participants from VIT Vellore and beyond. Your participant
            type is automatically determined by your email address — no manual selection needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className={`p-8 rounded-2xl border ${cat.border} ${cat.bg} transition-all duration-500 hover:scale-[1.02] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${cat.iconBg} flex items-center justify-center mb-5`}>
                <cat.icon size={28} className={cat.iconColor} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{cat.title}</h3>
              <p className={`text-sm font-medium ${cat.textColor} mb-1`}>{cat.subtitle}</p>
              <p className="text-xs text-gray-500 mb-6 font-mono">{cat.emailDomain}</p>

              <div className="space-y-3">
                {cat.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className={`${cat.iconColor} flex-shrink-0 mt-0.5`} />
                    <p className="text-sm text-gray-400">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 max-w-4xl mx-auto p-6 rounded-2xl border border-gray-800 bg-gray-900/40 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-800/60 flex items-center justify-center flex-shrink-0">
            <Users size={20} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-1">Team Formation Rules</p>
            <p className="text-sm text-gray-400">
              Teams must consist of 1–4 members. To ensure fairness, internal and external participants cannot be mixed within the same team. Every member must independently create their account and join using the leader's unique team code.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
