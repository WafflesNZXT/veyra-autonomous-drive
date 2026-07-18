import { CHAPTERS } from '../data/chapters';

interface ProgressIndicatorProps {
  progress: number;
  currentChapter: number;
}

const CHAPTER_LABELS = ['INTRO', 'LIDAR', 'RADAR', 'VISION', 'PROX', 'COMPUTE', 'FINALE'];

export function ProgressIndicator({ progress, currentChapter }: ProgressIndicatorProps) {
  return (
    <>
      {/* Chapter counter — top right */}
      <div
        className="fixed top-20 right-6 z-50 flex items-center gap-2"
        data-testid="chapter-counter"
      >
        <span
          className="font-mono text-xs tracking-widest"
          style={{ color: CHAPTERS[currentChapter - 1]?.accentColor ?? '#00d4ff' }}
        >
          {currentChapter.toString().padStart(2, '0')}
        </span>
        <span className="font-mono text-xs text-white/25 tracking-widest">/ 06</span>
      </div>

      {/* Chapter dot nav — right side vertical */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 hidden md:flex">
        {CHAPTER_LABELS.map((label, i) => {
          const active = currentChapter - 1 === i;
          const chapterColor = CHAPTERS[i]?.accentColor ?? '#00d4ff';
          return (
            <div
              key={i}
              className="flex items-center gap-2 group"
              data-testid={`chapter-dot-${i}`}
            >
              {/* Label (shown on hover/active) */}
              <span
                className="font-mono text-[9px] tracking-widest transition-all duration-300 text-right"
                style={{
                  color: active ? chapterColor : 'rgba(255,255,255,0.3)',
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateX(0)' : 'translateX(8px)',
                }}
              >
                {label}
              </span>
              {/* Dot */}
              <div
                className="rounded-full transition-all duration-400"
                style={{
                  width: active ? 8 : 4,
                  height: active ? 8 : 4,
                  background: active ? chapterColor : 'rgba(255,255,255,0.2)',
                  boxShadow: active ? `0 0 8px ${chapterColor}88` : 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom progress bar */}
      <div
        className="fixed bottom-0 left-0 w-full z-50"
        data-testid="progress-bar-bg"
      >
        <div className="h-px w-full bg-white/10" />
        <div
          className="h-px absolute top-0 left-0 transition-none"
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${CHAPTERS[currentChapter - 1]?.accentColor ?? '#00d4ff'}cc, ${CHAPTERS[currentChapter - 1]?.accentColor ?? '#00d4ff'})`,
            boxShadow: `0 0 8px ${CHAPTERS[currentChapter - 1]?.accentColor ?? '#00d4ff'}88`,
          }}
          data-testid="progress-bar-fill"
        />
      </div>
    </>
  );
}
