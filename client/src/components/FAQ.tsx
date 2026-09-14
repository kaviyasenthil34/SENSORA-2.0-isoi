import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    category: 'Problem Statement',
    q: 'Will the problem statements be provided by the organizers, or can teams choose their own problem statement and prepare before the hackathon?',
    a: 'The event guidelines mention that projects should fall under the themes of Intelligent Hardware & IoT, Artificial Intelligence & Data-Driven Innovation, Healthcare Technologies, and Embedded Systems. Detailed information regarding problem statement selection will be communicated by the organizing team before the event.',
  },
  {
    category: 'Components & Hardware',
    q: 'Will the organizers provide components and hardware, or should participants bring their own? Are ESP32, Arduino, and sensors allowed?',
    a: 'Electronic components from the organizers’ inventory will be available on a first-come, first-served basis. Participants are strongly encouraged to bring their own components as well. Bringing general-purpose hardware such as ESP32, Arduino boards, sensors, breadboards, jumper wires, and similar components is permitted and recommended.',
  },
  {
    category: 'Pre-developed Work',
    q: 'Since the solution must be built from scratch, what preparations are allowed before the hackathon?',
    a: 'Teams must build their solution entirely from scratch during the hackathon. Pre-developed code, trained models, or hardware prototypes are not permitted. However, the use of open-source libraries and frameworks is allowed.',
  },
  {
    category: 'Accommodation',
    q: 'Is accommodation provided during the hackathon for external participants?',
    a: 'Accommodation is available for external participants. Participants must register as external participants and book accommodation through the event website. Further details regarding accommodation charges and duration will be shared through the registration process.',
  },
  {
    category: 'Food & Refreshments',
    q: 'Will food, snacks, and refreshments be provided during the hackathon?',
    a: 'Food will not be provided directly by the organizers. Food stalls will be available outside the venue, and participants who have opted for accommodation will receive meals through the hostel mess. Snacks and food are not allowed inside the hackathon venue.',
  },
  {
    category: 'Schedule & Reporting',
    q: 'What are the reporting time, starting time, and ending time of the hackathon?',
    a: 'The hackathon will be conducted from 16 September to 17 September as a continuous 36-hour event. Participants are requested to report at least 45 minutes before the event begins. The detailed event schedule and round-wise flow will be shared two days before the event.',
  },
  {
    category: 'Final Submission',
    q: 'What are the final submission requirements for the hackathon?',
    a: 'Details regarding the expected deliverables, such as prototype demonstrations, presentations, source code, or documentation, will be communicated by the organizing team before the event.',
  },
  {
    category: 'Venue & Facilities',
    q: 'What facilities will be available at the venue (power supply, Wi-Fi, extension boards, equipment)?',
    a: 'Plug points (power supply) will be available at the venue, and participants are welcome to bring their own extension board or wire box if required. Information regarding Wi-Fi, soldering stations, multimeters, and other facilities will be shared by the organizers if applicable.',
  },
  {
    category: 'Team Formation & Eligibility',
    q: 'Who can participate and what is the team size limit?',
    a: 'Internal participants from VIT Vellore register with their @vitstudent.ac.in email, while external participants register with a @gmail.com address. Teams can have 1 to 4 members. Internal and external participants register in their respective team categories.',
  },
];

export default function FAQ() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div ref={ref} className={`max-w-3xl mx-auto px-6 lg:px-8 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-orange-400 tracking-widest uppercase">
            Questions
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-3 mb-6">
            Frequently Asked
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border bg-gray-900/40 transition-all duration-300 ${
                openIndex === i ? 'border-cyan-500/30' : 'border-gray-800'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="pr-4">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 inline-block mb-1.5">
                    {faq.category}
                  </span>
                  <h4 className="text-base font-semibold text-white">{faq.q}</h4>
                </div>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-cyan-400 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
