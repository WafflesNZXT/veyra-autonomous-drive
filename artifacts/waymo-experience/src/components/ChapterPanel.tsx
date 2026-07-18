import { CHAPTERS } from '../data/chapters';

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

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center">
      {/* ── HERO ── */}
      {isHero && (
        <div
          className="w-full flex flex-col items-center justify-end pb-28 md:pb-0 md:justify-center text-center px-6"
          data-testid="hero-content"
        >
          <h1 className="font-sans font-bold tracking-tighter text-white leading-none mb-6 text-[clamp(2.8rem,8vw,7rem)]">
            {chapter.title.split('\n').map((line, i) => (
              <span
                key={i}
                className="block hero-line-reveal"
                style={{ animationDelay: `${i * 0.15 + 0.2}s` }}
              >
                {line}
              </span>
            ))}
          </h1>
          <p
            className="font-mono text-sm md:text-base tracking-[0.25em] uppercase hero-line-reveal opacity-60"
            style={{ animationDelay: '0.7s', color: chapter.accentColor }}
          >
            {chapter.subtitle}
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
          <div className="finale-reveal">
            <p
              className="font-mono text-xs tracking-[0.35em] mb-8 uppercase"
              style={{ color: chapter.accentColor }}
            >
              ALL SYSTEMS ACTIVE
            </p>
            <h2
              className="font-sans font-bold tracking-tighter text-white leading-none mb-10"
              style={{ fontSize: 'clamp(2.5rem,7vw,6rem)' }}
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
            <p className="font-mono text-sm tracking-[0.2em] uppercase mb-12 opacity-50 text-white">
              {chapter.subtitle}
            </p>
            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
              {chapter.stats.map((stat, i) => (
                <div
                  key={i}
                  className="stat-chip finale-stat-reveal"
                  style={{
                    animationDelay: `${i * 0.1 + 0.8}s`,
                    borderColor: `${chapter.accentColor}44`,
                  }}
                >
                  <span
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: chapter.accentColor }}
                  />
                  <span className="font-mono text-xs text-white/60 tracking-wide">{stat}</span>
                </div>
              ))}
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
          `}
        >
          <div
            className={`
              max-w-xs md:max-w-sm w-full
              chapter-panel-reveal
              ${isLeft ? '' : 'text-right'}
            `}
            data-testid={`chapter-panel-${chapterIndex}`}
          >
            {/* Chapter eyebrow */}
            <div
              className={`flex items-center gap-3 mb-4 ${isLeft ? '' : 'flex-row-reverse'}`}
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
            <h2 className="font-sans font-bold text-white leading-none mb-6 text-[clamp(1.8rem,4vw,3rem)] tracking-tight">
              {chapter.title.split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>

            {/* Stats list */}
            <div
              className="border-l-2 pl-4 flex flex-col gap-2"
              style={{
                borderColor: `${chapter.accentColor}55`,
                ...(isLeft ? {} : { borderLeft: 'none', borderRight: `2px solid ${chapter.accentColor}55`, paddingLeft: 0, paddingRight: 16 }),
              }}
            >
              {chapter.stats.map((stat, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 stat-line-reveal ${isLeft ? '' : 'flex-row-reverse'}`}
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
