import { CHAPTERS } from '../data/chapters';
import { VeyraMark } from './VeyraLogo';

interface ChapterPanelProps {
  chapterIndex: number;
  scrollProgress: number;
}

export function ChapterPanel({ chapterIndex, scrollProgress: _scrollProgress }: ChapterPanelProps) {
  const chapter = CHAPTERS[chapterIndex];
  if (!chapter) return null;

  const isHero = chapterIndex === 0;
  const isFinale = chapterIndex === CHAPTERS.length - 1;
  const isLeft = isHero || chapterIndex % 2 !== 0;
  const isRadar = chapterIndex === 2;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center">
      {/* ── HERO ── */}
      {isHero && (
        <div
          className="w-full flex flex-col items-center justify-end pb-28 md:pb-0 md:justify-center text-center px-6"
          data-testid="hero-content"
        >
          <div className="hero-line-reveal mb-6" style={{ animationDelay: '0.1s' }}>
            <VeyraMark size={44} />
          </div>
          <h1 className="font-sans font-semibold tracking-[0.18em] text-white leading-none mb-6 text-[clamp(2.6rem,7vw,6rem)]">
            {chapter.title.split('\n').map((line, i) => (
              <span
                key={i}
                className="block hero-line-reveal"
                style={{ animationDelay: `${i * 0.15 + 0.25}s` }}
              >
                {line}
              </span>
            ))}
          </h1>
          <p
            className="font-mono text-sm md:text-base tracking-[0.3em] uppercase hero-line-reveal opacity-70 mb-5"
            style={{ animationDelay: '0.7s', color: chapter.accentColor }}
          >
            {chapter.subtitle}
          </p>
          <p
            className="max-w-md font-sans text-sm md:text-base text-white/45 leading-relaxed hero-line-reveal"
            style={{ animationDelay: '0.95s' }}
          >
            A premium autonomous vehicle concept designed to see, understand,
            and move with the world around it.
          </p>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-hint">
            <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">SCROLL</span>
            <div
              className="w-px h-10 bg-gradient-to-b from-current to-transparent"
              style={{ color: chapter.accentColor }}
            />
          </div>
        </div>
      )}

      {/* ── FINALE ── */}
      {isFinale && (
        <div
          className="w-full h-full flex flex-col items-center justify-center text-center px-6"
          data-testid="finale-content"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,20,50,0.5) 0%, transparent 70%)' }}
        >
          <div className="finale-reveal w-full max-w-4xl mx-auto px-2">
            <p
              className="font-mono tracking-[0.35em] mb-6 md:mb-8 uppercase"
              style={{ color: chapter.accentColor, fontSize: 'clamp(0.65rem,1.4vw,0.75rem)' }}
            >
              ALL SYSTEMS ACTIVE
            </p>
            <h2
              className="font-sans font-bold tracking-tight text-white leading-[1.02] mb-6 md:mb-8"
              style={{ fontSize: 'clamp(2.1rem,6.5vw,5.5rem)' }}
            >
              {chapter.title.split('\n').map((line, i) => (
                <span
                  key={i}
                  className="block finale-line-reveal"
                  style={{ animationDelay: `${i * 0.2 + 0.1}s` }}
                >
                  {line}
                </span>
              ))}
            </h2>
            <p
              className="font-mono tracking-[0.2em] uppercase mb-8 md:mb-12 opacity-50 text-white"
              style={{ fontSize: 'clamp(0.65rem,1.6vw,0.875rem)' }}
            >
              {chapter.subtitle}
            </p>
            {/* System summary grid — 2 cols → 1 col on small screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto w-full">
              {chapter.stats.map((stat, i) => {
                // Split on em/en/hyphen dash with surrounding spaces; fall back to whole string
                const parts = stat.split(/\s+[—–-]\s+/);
                const sys = parts[0];
                const desc = parts.length > 1 ? parts.slice(1).join(' — ') : null;
                return (
                  <div
                    key={i}
                    className="finale-stat-reveal border bg-black/30 backdrop-blur-sm px-4 py-3 text-left"
                    style={{
                      animationDelay: `${i * 0.1 + 0.8}s`,
                      borderColor: `${chapter.accentColor}33`,
                    }}
                  >
                    <p
                      className="font-mono text-[10px] tracking-[0.25em] uppercase mb-1"
                      style={{ color: chapter.accentColor }}
                    >
                      {sys}
                    </p>
                    <p className="font-sans text-xs text-white/60 leading-snug">{desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Brand footer / credits */}
            <div
              className="mt-10 md:mt-14 flex flex-col items-center gap-3 finale-stat-reveal"
              style={{ animationDelay: '1.3s' }}
              data-testid="finale-footer"
            >
              <VeyraMark size={22} />
              <p className="font-sans font-semibold tracking-[0.42em] text-white/70 text-sm">
                VEYRA
              </p>
              <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase">
                Intelligence in Motion. © 2026 VEYRA Concept
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER PANELS ── */}
      {!isHero && !isFinale && (
        <div
          key={`panel-${chapterIndex}`}
          className={`
            w-full flex
            ${isLeft ? 'justify-start pl-6 md:pl-14' : 'justify-end pr-6 md:pr-14'}
            ${isRadar ? 'radar-panel-frame' : ''}
          `}
        >
          <div
            className={`
              max-w-xs md:max-w-sm w-full
              chapter-panel-reveal
              ${isLeft ? '' : 'text-right'}
              ${isRadar ? 'radar-panel-content' : ''}
            `}
            data-testid={`chapter-panel-${chapterIndex}`}
          >
            {/* Chapter eyebrow */}
            <div
              className={`flex items-center gap-3 mb-4 ${isLeft ? '' : 'flex-row-reverse'} ${isRadar ? 'radar-panel-eyebrow' : ''}`}
            >
              <div
                className="h-px w-8 flex-shrink-0"
                style={{ background: chapter.accentColor }}
              />
              <span
                className="font-mono text-xs tracking-[0.2em] uppercase"
                style={{ color: chapter.accentColor }}
              >
                {chapter.subtitle}
              </span>
            </div>

            {/* Chapter title */}
            <h2 className={`font-sans font-bold text-white leading-none mb-6 text-[clamp(1.8rem,4vw,3rem)] tracking-tight ${isRadar ? 'radar-panel-title' : ''}`}>
              {chapter.title.split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>

            {/* Stats list */}
            <div
              className={`border-l-2 pl-4 flex flex-col gap-2 ${isRadar ? 'radar-panel-stats' : ''}`}
              style={{
                borderColor: `${chapter.accentColor}55`,
                ...(isLeft ? {} : { borderLeft: 'none', borderRight: `2px solid ${chapter.accentColor}55`, paddingLeft: 0, paddingRight: 16 }),
              }}
            >
              {chapter.stats.map((stat, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 stat-line-reveal ${isLeft ? '' : 'flex-row-reverse'} ${isRadar ? 'radar-panel-stat' : ''}`}
                  style={{ animationDelay: `${i * 0.07 + 0.3}s` }}
                >
                  <span
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: `${chapter.accentColor}88` }}
                  />
                  <span className="font-mono text-xs text-white/60 tracking-wide">{stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
