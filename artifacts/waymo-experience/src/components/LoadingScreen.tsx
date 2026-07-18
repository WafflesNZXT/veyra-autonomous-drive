import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  progress: number;
  onComplete: () => void;
}

const BOOT_LINES = [
  'INITIALIZING SENSOR ARRAY...',
  'CALIBRATING LIDAR SYSTEMS...',
  'LOADING VISION MODELS...',
  'ESTABLISHING COMPUTE LINK...',
  'RUNNING SAFETY DIAGNOSTICS...',
  'ALL SYSTEMS NOMINAL',
];

export function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (progress >= 100 && !exiting) {
      const t = setTimeout(() => {
        setExiting(true);
        setTimeout(onComplete, 700);
      }, 400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [progress, exiting, onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((i) => Math.min(i + 1, BOOT_LINES.length - 1));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#04060e]"
      style={{
        opacity: exiting ? 0 : 1,
        transition: 'opacity 0.6s ease',
        pointerEvents: exiting ? 'none' : 'all',
      }}
      data-testid="loading-screen"
    >
      {/* Brand mark */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div
            className="w-8 h-8 border-2 border-cyan-400 rotate-45 flex items-center justify-center"
            style={{ boxShadow: '0 0 16px rgba(0,212,255,0.5)' }}
          >
            <div className="w-2 h-2 bg-cyan-400 rotate-45" style={{ boxShadow: '0 0 8px rgba(0,212,255,0.9)' }} />
          </div>
        </div>
        <p className="font-mono text-xs tracking-[0.4em] text-cyan-400/70 uppercase">
          AUTONOMY SYSTEMS
        </p>
      </div>

      {/* Boot log */}
      <div className="mb-10 w-72 space-y-1.5">
        {BOOT_LINES.slice(0, lineIndex + 1).map((line, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="font-mono text-[10px] tracking-widest"
              style={{
                color: i === lineIndex ? '#00d4ff' : 'rgba(255,255,255,0.25)',
              }}
            >
              {i < lineIndex ? '✓' : '›'}
            </span>
            <span
              className="font-mono text-[10px] tracking-wide"
              style={{
                color: i === lineIndex ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
              }}
            >
              {line}
              {i === lineIndex && <span className="loading-cursor" />}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-72">
        <div className="flex justify-between mb-2">
          <span className="font-mono text-[9px] tracking-widest text-white/30">LOADING</span>
          <span className="font-mono text-[9px] tracking-widest text-cyan-400/70">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-px w-full bg-white/10 relative overflow-hidden">
          <div
            className="h-full absolute left-0 top-0 transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #003366, #00d4ff)',
              boxShadow: '0 0 8px rgba(0,212,255,0.7)',
            }}
            data-testid="loading-progress"
          />
        </div>
      </div>
    </div>
  );
}
