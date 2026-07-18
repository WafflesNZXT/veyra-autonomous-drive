import { Link } from 'wouter';
import { SitePage, PageHero, Section } from '@/components/SitePage';
import { VeyraMark } from '@/components/VeyraLogo';

const STACK = [
  'React + TypeScript',
  'Three.js / React Three Fiber',
  'GSAP scroll choreography',
  'Procedural 3D modeling',
  'Tailwind CSS',
  'Vite',
];

export default function Vision() {
  return (
    <SitePage>
      <PageHero
        eyebrow="The Mission"
        title="Vision"
        lede="VEYRA exists to answer one question: what does mobility look like when intelligence — not a driver — sits at the center of the machine?"
      />

      {/* Mission statement */}
      <Section center>
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-8">
            <VeyraMark size={36} />
          </div>
          <blockquote className="font-sans font-semibold text-[clamp(1.4rem,3vw,2.2rem)] leading-snug tracking-tight text-white/90">
            “We believe the autonomous vehicle is not a car that drives itself —
            it is a public good that moves people, reshapes streets,
            and gives cities back to the humans who live in them.”
          </blockquote>
          <p className="mt-6 font-mono text-[11px] tracking-[0.3em] uppercase text-cyan-400/70">
            — The VEYRA Concept
          </p>
        </div>
      </Section>

      {/* Narrative */}
      <Section eyebrow="Why This Exists" title="The future of moving">
        <div className="grid md:grid-cols-2 gap-10 text-white/50 leading-relaxed text-base">
          <p>
            For a century, cities have been designed around the driver: lanes, signals, parking,
            fuel. Autonomy breaks that contract. When vehicles see everything, never tire, and
            coordinate as a fleet, the space we surrendered to traffic can be renegotiated —
            street by street.
          </p>
          <p>
            VEYRA One is a design study of that future: a vehicle with no steering wheel to
            apologize for, sensors worn openly as instruments, and a ride designed around trust.
            It was built to make the argument visually — that the safest driver we ever put on
            the road may not be a driver at all.
          </p>
        </div>
      </Section>

      {/* Credits + stack */}
      <Section eyebrow="Credits" title="Built for the 3D Websites Hackathon">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-white/50 leading-relaxed text-base mb-6">
              VEYRA is an original concept created for a 3D-websites hackathon — every model,
              graphic, and word designed for this project. The vehicle is fully procedural:
              built from code, not downloaded.
            </p>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/25">
              An independent design study — not affiliated with any vehicle manufacturer
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-cyan-400/70 mb-4">Stack</p>
            <div className="flex flex-wrap gap-2">
              {STACK.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[11px] tracking-wide text-white/55 border border-white/10 px-3 py-1.5"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section center>
        <div className="max-w-2xl mx-auto py-8">
          <h2 className="font-sans font-bold tracking-tight text-[clamp(1.8rem,4vw,3rem)] mb-10">
            See the future move.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="font-mono text-xs tracking-[0.25em] uppercase px-8 py-4 border border-cyan-400/60 text-cyan-300 hover:bg-cyan-400/10 transition-colors"
              data-testid="cta-experience"
            >
              Re-enter Experience
            </Link>
            <Link
              href="/vehicle"
              className="font-mono text-xs tracking-[0.25em] uppercase px-8 py-4 border border-white/15 text-white/60 hover:border-white/40 hover:text-white transition-colors"
              data-testid="cta-vehicle"
            >
              Explore VEYRA One
            </Link>
          </div>
        </div>
      </Section>
    </SitePage>
  );
}
