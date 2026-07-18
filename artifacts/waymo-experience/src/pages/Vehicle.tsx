import { SitePage, PageHero, Section, TechCard } from '@/components/SitePage';
import { VehicleViewer } from '@/components/VehicleViewer';

const DESIGN_FEATURES = [
  {
    label: 'Exterior',
    title: 'Monolithic Silhouette',
    body: 'One continuous surface from nose to ducktail. No grille, no handles, no interruptions — the body reads as a single machined form shaped by airflow.',
  },
  {
    label: 'Glasshouse',
    title: 'Panoramic Canopy',
    body: 'A raked, single-piece greenhouse wraps the cabin in glass. With no driver, every seat is a window seat facing the city.',
  },
  {
    label: 'Lighting',
    title: 'Signal Language',
    body: 'A full-width light bar and angled DRL blades communicate intent — pedestrians and cyclists can read what VEYRA One is about to do.',
  },
  {
    label: 'Aero',
    title: 'Turbine Wheels',
    body: 'Five-spoke covered aero wheels reduce turbulence at the arches, extending range while keeping the profile calm and technical.',
  },
  {
    label: 'Sensors',
    title: 'Integrated Perception',
    body: 'LiDAR, radar, cameras, and ultrasonics are designed into the body — not bolted on. Sensing is part of the design language.',
  },
  {
    label: 'Interior',
    title: 'Lounge Direction',
    body: 'Concept direction: four facing seats, a floating console, and ambient light that follows the ride state. Space, not cockpit.',
  },
];

const SPECS: [string, string][] = [
  ['Length', '4.60 m'],
  ['Width', '1.98 m'],
  ['Height', '1.63 m'],
  ['Drivetrain', 'Dual-motor electric'],
  ['Range (concept)', '520 km'],
  ['Autonomy', 'Level 4 — no driver controls'],
  ['LiDAR', '128-beam, 360°, 200 m'],
  ['Cameras', '8 × 4K, full coverage'],
  ['Radar', 'Long-range mmWave, 250 m'],
  ['Ultrasonics', '16 sensors, 8 m'],
  ['Compute', 'VEYRA Core — 254 TOPS'],
  ['Seating', '4 passengers, lounge layout'],
];

const SENSOR_POINTS = [
  { name: 'Roof LiDAR', pos: 'Highest point — unobstructed 360° scan horizon' },
  { name: 'Front radar', pos: 'Behind fascia — long-range forward tracking' },
  { name: 'Fender cameras', pos: 'Front quarter panels — cross-traffic vision' },
  { name: 'B-pillar pods', pos: 'Mid-body — lateral coverage and blind-zone watch' },
  { name: 'Ultrasonic ring', pos: 'Front + rear bumpers — centimeter-level proximity' },
  { name: 'Compute deck', pos: 'Rear shelf — VEYRA Core with quad redundancy' },
];

export default function Vehicle() {
  return (
    <SitePage>
      <PageHero
        eyebrow="VEYRA One"
        title="The Vehicle"
        lede="A premium autonomous concept shaped by one idea: when the driver disappears, the car can finally be designed around the people inside it."
      />

      {/* Interactive 3D viewer */}
      <div className="px-0 md:px-10 -mt-6">
        <div className="max-w-6xl mx-auto border-y md:border border-white/5 relative overflow-hidden">
          <VehicleViewer />
          <p className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-white/25 uppercase">
            Interactive display — select a view
          </p>
        </div>
      </div>

      {/* Design philosophy */}
      <Section eyebrow="Design Philosophy" title="Nothing decorative. Everything deliberate.">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <p className="text-white/50 leading-relaxed text-base">
            VEYRA One removes everything a driverless car no longer needs — steering, pedals,
            mirrors, a face-like front — and reinvests that space in the ride itself. The result
            is a low, calm, aerodynamic form with a single glass canopy and a sensor suite that
            is worn like instrumentation, not disguise.
          </p>
          <p className="text-white/50 leading-relaxed text-base">
            Every surface earns its shape: the ducktail manages wake, the covered wheels quiet
            the arches, the light bar speaks to the street. It is a machine designed to be
            trusted at a glance — intelligence you can read from the curb.
          </p>
        </div>
      </Section>

      {/* Feature grid */}
      <Section eyebrow="Highlights" title="Feature language">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DESIGN_FEATURES.map((f) => (
            <TechCard key={f.title} {...f} />
          ))}
        </div>
      </Section>

      {/* Sensor placement */}
      <Section eyebrow="VEYRA Sense" title="Sensor placement" accent="#a855f7">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
          {SENSOR_POINTS.map((s, i) => (
            <div key={s.name} className="flex gap-4 items-start">
              <span className="font-mono text-[10px] text-white/30 pt-1 w-6 flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-sans font-semibold text-white/90 text-sm mb-1">{s.name}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{s.pos}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Specs */}
      <Section eyebrow="Concept Specifications" title="VEYRA One — at a glance">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-0 border-t border-white/8">
          {SPECS.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between py-4 border-b border-white/8">
              <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/35">{k}</span>
              <span className="font-sans text-sm text-white/85 text-right">{v}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase">
          Concept figures — design study, not production claims
        </p>
      </Section>
    </SitePage>
  );
}
