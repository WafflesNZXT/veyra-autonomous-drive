import { SitePage, PageHero, Section, TechCard } from '@/components/SitePage';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useEffect, useRef, useState } from 'react';

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

interface ImpactMetric {
  target: number;
  label: string;
  desc?: string;
  prefix?: string;
  suffix?: string;
}

const METRICS: ImpactMetric[] = [
  { target: 50, suffix: '+', label: 'Cities', desc: 'Concept coverage' },
  { target: 3, suffix: '×', label: 'Vehicle Utilization', desc: 'vs. a private car' },
  { target: 45, prefix: '<', suffix: 's', label: 'Curb Time', desc: 'Per pickup' },
  { target: 30, suffix: '%', label: 'Parking Reduction', desc: 'Up to, per district' },
];

function ImpactMetricValue({ target, prefix = '', suffix = '' }: ImpactMetric) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!node || reducedMotion || !('IntersectionObserver' in window)) {
      setValue(target);
      return undefined;
    }

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      observer.disconnect();
      const start = performance.now();
      const duration = 1500;

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));

        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    }, { threshold: 0.45 });

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  const displayPrefix = value === 0 ? '' : prefix;

  return (
    <p
      ref={ref}
      className="font-sans font-bold text-cyan-400 mb-3 whitespace-nowrap leading-none"
      style={{ fontSize: 'clamp(2rem,3.5vw,2.75rem)' }}
      aria-label={`${prefix}${target}${suffix}`}
    >
      {displayPrefix}{value}{suffix}
    </p>
  );
}

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
          {ECOSYSTEM.map((entry, index) => (
            <ScrollReveal key={entry.title} delay={index * 70}>
              <TechCard {...entry} />
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Impact metrics */}
      <Section eyebrow="Urban Impact" title="What a fleet gives back" center>
        <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 max-w-4xl mx-auto">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center flex flex-col items-center">
              <ImpactMetricValue {...m} />
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60 leading-relaxed">
                {m.label}
              </p>
              {m.desc && (
                <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-white/30 mt-1 leading-relaxed">
                  {m.desc}
                </p>
              )}
            </div>
          ))}
        </ScrollReveal>
        <p className="mt-10 font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase">
          Concept projections — illustrative of the design study
        </p>
      </Section>
    </SitePage>
  );
}
