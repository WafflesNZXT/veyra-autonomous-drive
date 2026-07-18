import { useEffect, useState } from 'react';
import { VeyraMark, VeyraWordmark } from './VeyraLogo';

interface LoadingScreenProps {
  progress: number;
  onComplete: () => void;
}

const BOOT_LINES = [
  'INITIALIZING VEYRA SENSE...',
  'CALIBRATING LIDAR ARRAY...',
  'LOADING VISION MODELS...',
  'LINKING VEYRA CORE...',
  'VEYRA SHIELD DIAGNOSTICS...',
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
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="mb-4" style={{ filter: 'drop-shadow(0 0 14px rgba(0,212,255,0.35))' }}>
          <VeyraMark size={44} />
        </div>
        <VeyraWordmark className="text-2xl mb-2" />
        <p className="font-mono text-[10px] tracking-[0.4em] text-cyan-400/70 uppercase">
          Intelligence in Motion
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
