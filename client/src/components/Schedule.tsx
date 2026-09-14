import { useInView } from '../hooks/useInView';

type ScheduleItem = {
  time: string;
  title: string;
  description: string;
  isMajor?: boolean;
};

const day1: ScheduleItem[] = [
  {
    time: '10:00 AM – 11:00 AM',
    title: 'Event Starts: Registrations + Team Formations',
    description: 'Participants report, check in, and finalize team setup.',
    isMajor: true,
  },
  {
    time: '11:00 AM – 01:00 PM',
    title: 'Hack Starts',
    description: 'Official 36-hour sprint commences. Build fast and smart.',
    isMajor: true,
  },
  {
    time: '01:00 PM – 02:00 PM',
    title: 'Lunch Break',
    description: 'Break for lunch outside venue.',
  },
  {
    time: '02:00 PM – 03:00 PM',
    title: 'Mentoring & Technical Support',
    description: 'Coordinators & mentors assist teams with setup & architecture.',
  },
  {
    time: '03:00 PM – 04:00 PM',
    title: 'Idea Discussion & Feedback',
    description: 'Mentors interact with teams to review architecture & give suggestions.',
  },
  {
    time: '04:00 PM – 05:30 PM',
    title: 'Day 1 Project Review & Hacking Resumes',
    description: 'First official project review with organizers and judges.',
    isMajor: true,
  },
  {
    time: '05:30 PM – 06:00 PM',
    title: 'Tea Break',
    description: 'Refreshment break.',
  },
  {
    time: '06:00 PM – 07:30 PM',
    title: 'Hackathon Resumes',
    description: 'Continuous sprint execution.',
  },
  {
    time: '07:30 PM – 08:30 PM',
    title: 'Dinner Break',
    description: 'Dinner break outside venue.',
  },
  {
    time: '08:30 PM – 12:00 AM',
    title: 'Overnight Hackathon Sprint',
    description: 'Late night development sprint at Shakespeare Gallery.',
    isMajor: true,
  },
];

const day2: ScheduleItem[] = [
  {
    time: '12:00 AM – 06:00 AM',
    title: 'Overnight Hacking & Organizing Feedback',
    description: 'Hacking continues with feedback by organizing student team.',
  },
  {
    time: '06:00 AM – 09:00 AM',
    title: 'Release / Break',
    description: 'Morning break and refresh time.',
  },
  {
    time: '09:30 AM – 01:30 PM',
    title: 'Round 1 Elimination Judging',
    description: 'Judges review prototypes (minimum 70% project completion required).',
    isMajor: true,
  },
  {
    time: '01:30 PM – 02:30 PM',
    title: 'Lunch Break',
    description: 'Lunch break.',
  },
  {
    time: '02:30 PM – 06:00 PM',
    title: 'Final Review with Qualified Teams',
    description: 'Final pitch presentations and prototype defense before jury panel.',
    isMajor: true,
  },
  {
    time: '07:00 PM – 07:30 PM',
    title: 'Results Announcement',
    description: 'Official winners announcement & awards ceremony.',
    isMajor: true,
  },
  {
    time: '07:30 PM – 08:00 PM',
    title: 'Vote of Thanks',
    description: 'Closing address by ISOI organizing committee.',
  },
  {
    time: '08:00 PM',
    title: 'Participants Dispersal',
    description: 'Event concludes.',
  },
];

function ScheduleColumn({ day, date, items, inView }: { day: string; date: string; items: ScheduleItem[]; inView: boolean }) {
  return (
    <div className={`flex-1 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center font-black text-black text-lg">
          {day}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Day {day}</h3>
          <p className="text-sm text-cyan-400 font-semibold">{date}</p>
        </div>
      </div>

      <div className="relative pl-8">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/40 via-gray-700 to-transparent" />

        {items.map((item, i) => (
          <div
            key={i}
            className="relative mb-8 last:mb-0"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div
              className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                item.isMajor
                  ? 'bg-orange-400 border-orange-400 shadow-lg shadow-orange-500/40'
                  : 'bg-gray-800 border-gray-600'
              }`}
            />
            <div className="group hover:translate-x-1 transition-transform duration-300">
              <span className="text-xs font-bold text-cyan-400 tracking-wide font-mono">{item.time}</span>
              <h4 className={`text-base font-bold mt-1 ${item.isMajor ? 'text-white' : 'text-gray-300'}`}>
                {item.title}
              </h4>
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Schedule() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="schedule" className="relative py-24 md:py-32">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">
            Official Timeline
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-3 mb-4">
            16th & 17th September 2026
          </h2>
          <p className="text-base text-gray-400 max-w-xl mx-auto">
            36 hours continuous hackathon sprint at Shakespeare Gallery.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <ScheduleColumn day="1" date="Sep 16, 2026" items={day1} inView={inView} />
          <ScheduleColumn day="2" date="Sep 17, 2026" items={day2} inView={inView} />
        </div>
      </div>
    </section>
  );
}
