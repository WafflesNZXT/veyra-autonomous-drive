import { SitePage, PageHero, Section, TechCard } from '@/components/SitePage';
import { ScrollReveal } from '@/components/ScrollReveal';

const PRINCIPLES = [
  {
    label: 'Redundancy',
    title: 'No Single Point of Sight',
    body: 'Every region around the vehicle is covered by at least two independent sensor types. Lose a camera, and LiDAR and radar are already watching the same space.',
  },
  {
    label: 'Low Visibility',
    title: 'Designed for the Worst Day',
    body: 'Radar leads in rain and fog, LiDAR in darkness, thermal-tuned exposure in glare. VEYRA One is engineered around degraded conditions, not fair weather.',
  },
  {
    label: 'Response',
    title: 'Emergency Reflexes',
    body: 'Obstacle response paths are pre-computed continuously — hard braking, evasive lateral moves, and controlled stops are always one decision away.',
  },
  {
    label: 'Fallback',
    title: 'Safe-Stop Behavior',
    body: 'If any critical system degrades, VEYRA One executes a minimal-risk maneuver: signal, slow, and settle at the safest reachable edge of the road.',
  },
  {
    label: 'Monitoring',
    title: 'System Health, Always On',
    body: 'Thousands of self-checks per second across sensors, compute lanes, power, and actuation — every subsystem carries a live health score.',
  },
  {
    label: 'Passengers',
    title: 'Reassurance by Design',
    body: 'Clear cabin displays show what the vehicle sees and intends. A hold-to-stop control is always within reach. Calm is a feature.',
  },
];

const SHIELD_LAYERS = [
  { name: 'Perception overlap', desc: 'Multi-sensor coverage of every zone', accent: '#00d4ff' },
  { name: 'Redundant compute', desc: 'Four lanes, continuous cross-checks', accent: '#a855f7' },
  { name: 'Predictive margin', desc: 'Space and time budgeted for the unexpected', accent: '#f59e0b' },
  { name: 'Minimal-risk fallback', desc: 'A safe stop is always in the plan', accent: '#22c55e' },
];

export default function Safety() {
  return (
    <SitePage>
      <PageHero
        eyebrow="VEYRA Shield"
        title="Safety"
        lede="Trust is engineered in layers. VEYRA Shield is the design discipline behind every mile: assume failure, sense twice, and always hold a way out."
        accent="#22c55e"
      />

      {/* Shield layers diagram */}
      <div className="px-6 md:px-10">
        <div className="max-w-3xl mx-auto space-y-3" data-testid="shield-layers">
          {SHIELD_LAYERS.map((l, i) => (
            <div
              key={l.name}
              className="flex items-center gap-5 border border-white/8 bg-white/[0.02] px-6 py-4"
              style={{ marginLeft: `${i * 4}%`, marginRight: `${i * 4}%` }}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.accent, boxShadow: `0 0 8px ${l.accent}88` }} />
              <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <span className="font-sans font-semibold text-sm text-white/85">{l.name}</span>
                <span className="font-mono text-[11px] tracking-wide text-white/35">{l.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Principles */}
      <Section eyebrow="Design Principles" title="Six rules VEYRA One never breaks" accent="#22c55e">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRINCIPLES.map((principle, index) => (
            <ScrollReveal key={principle.title} delay={index * 70}>
              <TechCard {...principle} accent="#22c55e" />
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Accessibility */}
      <Section eyebrow="For Everyone" title="Accessible by default" accent="#22c55e">
        <ScrollReveal className="grid md:grid-cols-2 gap-10 text-white/50 leading-relaxed text-base">
          <p>
            A vehicle without a driver must speak for itself. VEYRA One announces arrivals audibly
            and visually, kneels for step-free entry in the concept design, and keeps doorways,
            handholds, and seating usable without assistance.
          </p>
          <p>
            In-ride communication is multi-modal — voice, display, and haptic cues — so passengers
            of every ability always know where they are, what happens next, and how to reach a
            human at any moment.
          </p>
        </ScrollReveal>
      </Section>

      <div className="px-6 md:px-10 pb-4">
        <p className="max-w-6xl mx-auto font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase">
          VEYRA Shield describes concept design principles for this study — not certified real-world safety claims
        </p>
      </div>
    </SitePage>
  );
}
