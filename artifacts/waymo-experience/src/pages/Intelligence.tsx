import { SitePage, PageHero, Section, TechCard } from '@/components/SitePage';

const SENSORS = [
  {
    label: 'VEYRA Sense',
    title: 'LiDAR Array',
    body: '128 rotating beams sweep the full 360° horizon ten times per second, building a live 3D point cloud of every surface within 200 meters.',
    stat: '2.4M points / second',
  },
  {
    label: 'VEYRA Sense',
    title: 'Camera System',
    body: 'Eight 4K cameras read what geometry alone cannot — traffic lights, lane markings, hand signals, the intent in a pedestrian’s posture.',
    stat: '8 × 4K · 360° coverage',
  },
  {
    label: 'VEYRA Sense',
    title: 'Forward Radar',
    body: 'Millimeter-wave radar measures the speed of everything ahead and keeps watching when rain, fog, or darkness blind the other senses.',
    stat: '250 m · all weather',
  },
  {
    label: 'VEYRA Shield',
    title: 'Ultrasonic Ring',
    body: 'Sixteen short-range sensors form a near-field bubble for curbs, poles, and close passes — precision at parking speeds.',
    stat: '16 sensors · 60 Hz',
  },
];

const PIPELINE = [
  {
    step: '01',
    title: 'Perceive',
    body: 'LiDAR, cameras, radar, and ultrasonics stream in parallel. Each sensor sees the world differently — and none is trusted alone.',
    accent: '#00d4ff',
  },
  {
    step: '02',
    title: 'Fuse',
    body: 'VEYRA Core aligns every stream into one probabilistic world model. Disagreements between sensors are surfaced, weighed, and resolved in milliseconds.',
    accent: '#a855f7',
  },
  {
    step: '03',
    title: 'Predict',
    body: 'Every tracked object gets a future: cyclists drift, doors open, pedestrians step out. The planner reasons about what happens next, not just what is.',
    accent: '#f59e0b',
  },
  {
    step: '04',
    title: 'Move',
    body: 'A safe, comfortable trajectory is selected and re-evaluated 100+ times per second. Every motion carries a verified fallback.',
    accent: '#22c55e',
  },
];

export default function Intelligence() {
  return (
    <SitePage>
      <PageHero
        eyebrow="VEYRA Sense · VEYRA Core"
        title="Intelligence"
        lede="Perception is only half the problem. VEYRA One is built around a single pipeline that turns raw sensing into calm, explainable motion."
      />

      {/* Point-cloud style divider */}
      <div className="px-6 md:px-10">
        <div
          className="max-w-6xl mx-auto h-40 md:h-56 relative overflow-hidden border border-white/5"
          style={{
            background:
              'radial-gradient(circle at 20% 60%, rgba(0,212,255,0.10), transparent 40%), radial-gradient(circle at 75% 35%, rgba(168,85,247,0.10), transparent 45%), repeating-radial-gradient(circle at 50% 120%, rgba(0,212,255,0.05) 0px, rgba(0,212,255,0.05) 1px, transparent 1px, transparent 26px)',
          }}
          data-testid="pointcloud-banner"
        >
          {/* scan line */}
          <div className="absolute inset-y-0 w-px bg-cyan-400/40 scan-sweep" style={{ boxShadow: '0 0 18px rgba(0,212,255,0.5)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-white/40 uppercase">
              World model · live reconstruction
            </p>
          </div>
        </div>
      </div>

      {/* Sensor overview */}
      <Section eyebrow="VEYRA Sense" title="Four senses, one picture">
        <div className="grid sm:grid-cols-2 gap-4">
          {SENSORS.map((s) => (
            <TechCard key={s.title} {...s} />
          ))}
        </div>
      </Section>

      {/* Fusion + pipeline */}
      <Section eyebrow="VEYRA Core" title="Perception to decision" accent="#f59e0b">
        <div className="grid md:grid-cols-4 gap-4">
          {PIPELINE.map((p, i) => (
            <div key={p.step} className="relative border border-white/8 bg-white/[0.02] p-6">
              <div className="absolute top-0 left-0 h-px w-10" style={{ background: p.accent }} />
              <p className="font-mono text-2xl mb-4" style={{ color: p.accent }}>{p.step}</p>
              <h3 className="font-sans font-semibold text-white/90 mb-2">{p.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{p.body}</p>
              {i < PIPELINE.length - 1 && (
                <span className="hidden md:block absolute top-1/2 -right-3 text-white/20 font-mono">→</span>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Compute */}
      <Section eyebrow="Onboard AI" title="VEYRA Core" accent="#f59e0b">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-5 text-white/50 leading-relaxed text-base">
            <p>
              At the rear deck of VEYRA One sits a purpose-built AI computer: a custom accelerator
              delivering 254 TOPS of inference, running four independent processing lanes that
              continuously check one another. If any lane disagrees, the system degrades gracefully
              instead of guessing.
            </p>
            <p>
              Decisions land in under 8 milliseconds — faster than a blink — and every one of them
              is logged, explainable, and reproducible. Intelligence you can audit, not a black box
              on wheels.
            </p>
          </div>
          <div className="space-y-4">
            {[
              ['Inference', '254 TOPS'],
              ['Decision latency', '< 8 ms'],
              ['Processing lanes', '4 × redundant'],
              ['World refresh', '100 Hz'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/8 pb-3">
                <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/35">{k}</span>
                <span className="font-mono text-sm text-amber-400/90">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </SitePage>
  );
}
