import { SitePage, PageHero, Section, TechCard } from '@/components/SitePage';

const ECOSYSTEM = [
  {
    label: 'Fleet',
    title: 'Connected Fleet',
    body: 'Every VEYRA One shares what it learns. A hazard mapped by one vehicle reroutes the entire fleet within seconds.',
  },
  {
    label: 'Routing',
    title: 'Intelligent Routing',
    body: 'Demand prediction positions vehicles before they are requested — the ride is often already around the corner.',
  },
  {
    label: 'Ride Flow',
    title: 'Seamless Pickup',
    body: 'Precise curb-side rendezvous with light-bar identification. Your vehicle greets you; no license-plate squinting.',
  },
  {
    label: 'Energy',
    title: 'Charging Hubs',
    body: 'Fleet vehicles rotate through urban charging hubs during demand valleys, arriving charged for every peak.',
  },
  {
    label: 'City',
    title: 'Urban Integration',
    body: 'Anonymized flow data helps cities time signals, shape curb policy, and reclaim parking for public space.',
  },
  {
    label: 'Access',
    title: 'Mobility for Everyone',
    body: 'Step-free vehicles, multi-modal communication, and coverage that does not thin out at the edge of the map.',
  },
];

const METRICS: [string, string][] = [
  ['Cities (concept)', '50+'],
  ['Fleet utilization target', '3× private car'],
  ['Curb time per pickup', '< 45 s'],
  ['Parking demand reduction', 'Up to 30%'],
];

/** Stylized animated city-network diagram (pure SVG). */
function NetworkMap() {
  const nodes: [number, number][] = [
    [80, 70], [220, 40], [370, 90], [520, 50], [660, 110],
    [140, 180], [300, 160], [460, 190], [610, 220],
    [90, 290], [250, 270], [410, 300], [560, 320], [680, 280],
  ];
  const links: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 2], [6, 7],
    [7, 3], [7, 8], [8, 4], [5, 9], [9, 10], [10, 6], [10, 11],
    [11, 7], [11, 12], [12, 8], [12, 13], [13, 8],
  ];
  return (
    <svg viewBox="0 0 760 360" className="w-full h-auto" data-testid="network-map">
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="rgba(0,212,255,0.18)"
          strokeWidth="1"
        />
      ))}
      {/* animated route */}
      <polyline
        points="80,70 140,180 300,160 460,190 560,320"
        fill="none"
        stroke="#00d4ff"
        strokeWidth="1.6"
        strokeDasharray="6 8"
        className="route-dash"
        style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.6))' }}
      />
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 5 : 3}
          fill={i % 4 === 0 ? '#00d4ff' : 'rgba(255,255,255,0.35)'}
          opacity={i % 4 === 0 ? 0.9 : 0.7}
        />
      ))}
      {/* hub labels */}
      <text x={80} y={56} fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="monospace" letterSpacing="2">HUB A</text>
      <text x={560} y={340} fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="monospace" letterSpacing="2">HUB B</text>
    </svg>
  );
}

export default function Network() {
  return (
    <SitePage>
      <PageHero
        eyebrow="VEYRA Network"
        title="Network"
        lede="One autonomous vehicle is a product. A coordinated fleet is a new layer of the city — always moving, always learning, never parked in the way."
      />

      {/* Animated map */}
      <div className="px-6 md:px-10">
        <div className="max-w-5xl mx-auto border border-white/5 bg-white/[0.015] p-6 md:p-10 relative overflow-hidden">
          <p className="font-mono text-[10px] tracking-[0.35em] text-white/30 uppercase mb-6 text-center">
            Live fleet — intelligent routing between hubs
          </p>
          <NetworkMap />
        </div>
      </div>

      {/* Ecosystem grid */}
      <Section eyebrow="Ecosystem" title="More than one car">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ECOSYSTEM.map((e) => (
            <TechCard key={e.title} {...e} />
          ))}
        </div>
      </Section>

      {/* Impact metrics */}
      <Section eyebrow="Urban Impact" title="What a fleet gives back" center>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {METRICS.map(([k, v]) => (
            <div key={k} className="text-center">
              <p className="font-sans font-bold text-2xl md:text-3xl text-cyan-400 mb-2">{v}</p>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/35">{k}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase">
          Concept projections — illustrative of the design study
        </p>
      </Section>
    </SitePage>
  );
}
