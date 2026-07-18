import { useState } from 'react';
import { Link } from 'wouter';
import { SitePage, PageHero, Section } from '@/components/SitePage';
import { VeyraMark } from '@/components/VeyraLogo';

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-1.94c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.14v3.17c0 .31.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function CreatorPortrait() {
  const [failed, setFailed] = useState(false);
  const src = `${import.meta.env.BASE_URL}assets/wafi-syed.jpg`;
  return (
    <div
      className="rounded-full overflow-hidden flex-shrink-0 border border-cyan-400/40 flex items-center justify-center bg-white/[0.04]"
      style={{
        width: 'clamp(120px, 16vw, 170px)',
        height: 'clamp(120px, 16vw, 170px)',
        boxShadow: '0 0 32px rgba(0,212,255,0.18)',
      }}
      data-testid="creator-portrait"
    >
      {failed ? (
        <span className="font-sans font-semibold tracking-[0.2em] text-cyan-300/80 text-2xl">WS</span>
      ) : (
        <img
          src={src}
          alt="Portrait of Wafi Syed"
          className="w-full h-full object-cover object-center"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

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

      {/* Creator profile */}
      <Section eyebrow="Creator" title="Designed and built by Wafi Syed">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          <CreatorPortrait />
          <div className="flex-1 text-center md:text-left max-w-2xl">
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-cyan-400/70 mb-4">
              Creator &amp; Developer
            </p>
            <p className="text-white/50 leading-relaxed text-base mb-7">
              VEYRA is an original autonomous mobility concept designed and developed for the
              3D Websites Hackathon. The vehicle, interface, branding, and interactive
              experience were created specifically for this project.
            </p>
            <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-3 mb-9">
              <a
                href="https://www.linkedin.com/in/wafisyed/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 font-mono text-[11px] tracking-[0.2em] uppercase px-6 py-3 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 transition-colors"
                data-testid="link-linkedin"
              >
                <LinkedInIcon />
                LinkedIn
              </a>
              <a
                href="https://github.com/WafflesNZXT"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 font-mono text-[11px] tracking-[0.2em] uppercase px-6 py-3 border border-white/15 text-white/70 hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 transition-colors"
                data-testid="link-github"
              >
                <GitHubIcon />
                GitHub
              </a>
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40 mb-3">Stack</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {STACK.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[11px] tracking-wide text-white/55 border border-white/10 px-3 py-1.5"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-6 font-mono text-[10px] tracking-[0.25em] uppercase text-white/25">
                Built for the 3D Websites Hackathon — an independent design study
              </p>
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
