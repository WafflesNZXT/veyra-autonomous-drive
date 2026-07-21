import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { VeyraMark, VeyraWordmark } from './VeyraLogo';

const NAV_ITEMS = [
  { label: 'Experience', path: '/' },
  { label: 'Vehicle', path: '/vehicle' },
  { label: 'Intelligence', path: '/intelligence' },
  { label: 'Safety', path: '/safety' },
  { label: 'Network', path: '/network' },
  { label: 'Vision', path: '/vision' },
];

export function SiteNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-[100] pointer-events-auto"
        style={{
          background: 'linear-gradient(to bottom, rgba(4,6,14,0.85), rgba(4,6,14,0.35) 70%, transparent)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
        data-testid="site-nav"
      >
        <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-white/5">
          {/* Brand lockup */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-4"
            onClick={() => setOpen(false)}
            data-testid="nav-brand"
          >
            <VeyraMark size={22} />
            <VeyraWordmark className="text-sm group-hover:opacity-80 transition-opacity" />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const active = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative font-mono text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-4"
                  style={{ color: active ? '#00d4ff' : 'rgba(255,255,255,0.55)' }}
                  data-testid={`nav-link-${item.label.toLowerCase()}`}
                >
                  <span className="hover:text-white transition-colors">{item.label}</span>
                  <span
                    className="absolute -bottom-[9px] left-0 h-px w-full transition-all duration-300"
                    style={{
                      background: '#00d4ff',
                      opacity: active ? 1 : 0,
                      boxShadow: active ? '0 0 6px rgba(0,212,255,0.8)' : 'none',
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col justify-center items-end gap-1.5 w-8 h-8 pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            data-testid="nav-hamburger"
          >
            <span
              className="h-px bg-white transition-all duration-300"
              style={{ width: 22, transform: open ? 'rotate(45deg) translateY(4.5px)' : 'none' }}
            />
            <span
              className="h-px bg-white/70 transition-all duration-300"
              style={{ width: open ? 22 : 14, transform: open ? 'rotate(-45deg) translateY(-4.5px)' : 'none' }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className="fixed inset-0 z-[99] lg:hidden flex flex-col items-center justify-center gap-7 transition-all duration-400 pointer-events-auto"
        style={{
          background: 'rgba(4,6,14,0.97)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
        }}
        id="mobile-menu"
        data-testid="mobile-menu"
      >
        {NAV_ITEMS.map((item, i) => {
          const active = location === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpen(false)}
              className="font-sans text-2xl font-semibold tracking-[0.2em] uppercase transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-4"
              style={{
                color: active ? '#00d4ff' : 'rgba(255,255,255,0.75)',
                transitionDelay: open ? `${i * 40}ms` : '0ms',
                transform: open ? 'translateY(0)' : 'translateY(12px)',
                opacity: open ? 1 : 0,
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
