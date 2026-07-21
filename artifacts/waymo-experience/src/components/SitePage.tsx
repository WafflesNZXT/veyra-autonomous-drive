import { useEffect, type ReactNode } from 'react';
import { Link } from 'wouter';
import { SiteNav } from './SiteNav';
import { VeyraMark } from './VeyraLogo';

/** Shared shell for the content pages — nav, fade-in, footer. */
export function SitePage({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#04060e] text-white page-fade-in">
      <SiteNav />
      <main className="pt-16">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 px-6 md:px-10 py-12 mt-8" data-testid="site-footer">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <VeyraMark size={20} />
          <span className="font-sans font-semibold tracking-[0.42em] text-white/70 text-xs">VEYRA</span>
        </div>
        <p className="font-mono text-[10px] tracking-[0.25em] text-white/25 uppercase text-center">
          Intelligence in Motion. © 2026 VEYRA Concept
        </p>
        <Link
          href="/"
          className="font-mono text-[10px] tracking-[0.25em] text-cyan-400/60 hover:text-cyan-300 uppercase transition-colors"
        >
          Re-enter Experience →
        </Link>
      </div>
    </footer>
  );
}

/** Page hero — consistent opening for every content page. */
export function PageHero({
  eyebrow,
  title,
  lede,
  accent = '#00d4ff',
}: {
  eyebrow: string;
  title: string;
  lede: string;
  accent?: string;
}) {
  return (
    <header className="px-6 md:px-10 pt-20 md:pt-28 pb-14 md:pb-20 text-center relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 45% at 50% 0%, ${accent}14, transparent 70%)`,
        }}
      />
      <p
        className="font-mono text-[11px] tracking-[0.35em] uppercase mb-5 section-reveal"
        style={{ color: accent }}
      >
        {eyebrow}
      </p>
      <h1 className="font-sans font-bold tracking-tight leading-none text-[clamp(2.4rem,6vw,4.6rem)] mb-6 section-reveal" style={{ animationDelay: '0.1s' }}>
        {title}
      </h1>
      <p className="max-w-2xl mx-auto text-white/50 text-base md:text-lg leading-relaxed section-reveal" style={{ animationDelay: '0.2s' }}>
        {lede}
      </p>
    </header>
  );
}

/** Section wrapper with eyebrow + title. */
export function Section({
  eyebrow,
  title,
  accent = '#00d4ff',
  children,
  center = false,
}: {
  eyebrow?: string;
  title?: ReactNode;
  accent?: string;
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <section className={`px-6 md:px-10 py-14 md:py-20 ${center ? 'text-center' : ''}`}>
      <div className="max-w-6xl mx-auto">
        {eyebrow && (
          <div className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}>
            <div className="h-px w-8" style={{ background: accent }} />
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: accent }}>
              {eyebrow}
            </span>
          </div>
        )}
        {title && (
          <h2 className="font-sans font-bold tracking-tight text-[clamp(1.7rem,3.5vw,2.6rem)] mb-10">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}

/** Technical card used across content pages. */
export function TechCard({
  label,
  title,
  body,
  accent = '#00d4ff',
  stat,
}: {
  label?: string;
  title: string;
  body: string;
  accent?: string;
  stat?: string;
}) {
  return (
    <div
      className="group relative border border-white/8 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
      style={{ borderRadius: 2 }}
    >
      <div
        className="absolute top-0 left-0 h-px w-8 transition-all duration-300 group-hover:w-16"
        style={{ background: accent }}
      />
      {label && (
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: accent }}>
          {label}
        </p>
      )}
      <h3 className="font-sans font-semibold text-lg mb-2 text-white/90">{title}</h3>
      <p className="text-sm text-white/45 leading-relaxed">{body}</p>
      {stat && (
        <p className="mt-4 font-mono text-xs tracking-widest text-white/60">{stat}</p>
      )}
    </div>
  );
}
