import { MapPin, Calendar, Users, Clock, Ticket } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const details = [
  {
    icon: Calendar,
    label: 'Date',
    value: 'September 16 - 17, 2026',
    sub: 'Two intense days',
  },
  {
    icon: Clock,
    label: 'Time',
    value: '10:00 AM - 08:00 PM',
    sub: '36 hours of building',
  },
  {
    icon: MapPin,
    label: 'Venue',
    value: 'Shakespeare Gallery - I',
    sub: 'Hosted on campus',
  },
  {
    icon: Users,
    label: 'Team Size',
    value: '1 - 4 Members',
    sub: 'Solo or squad up',
  },
];

export default function Venue() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="venue" className="relative py-24 md:py-32">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-orange-400 tracking-widest uppercase">
            Event Details
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-3 mb-6">
            Mark your calendar
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {details.map((detail, i) => (
            <div
              key={detail.label}
              className={`group p-6 rounded-2xl border border-gray-800 bg-gray-900/40 hover:bg-gray-900/70 hover:border-cyan-500/30 transition-all duration-500 hover:scale-105 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-gray-800/60 flex items-center justify-center mb-4 group-hover:bg-cyan-500/10 transition-colors duration-300">
                <detail.icon size={20} className="text-cyan-400" />
              </div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                {detail.label}
              </p>
              <p className="text-base font-bold text-white mb-1">{detail.value}</p>
              <p className="text-xs text-gray-500">{detail.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
