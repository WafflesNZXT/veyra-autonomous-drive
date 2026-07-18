import { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { CarScene } from '@/components/CarScene';
import { ChapterPanel } from '@/components/ChapterPanel';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { VeyraMark, VeyraWordmark } from '@/components/VeyraLogo';

export default function Home() {
  const { currentChapter, progress } = useScrollProgress();
  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Simulate a short loading sequence — real 3D assets load fast;
  // this ensures the splash screen plays as intended.
  useEffect(() => {
    let frame = 0;
    const steps = [
      { delay: 80, value: 18 },
      { delay: 240, value: 38 },
      { delay: 480, value: 62 },
      { delay: 700, value: 80 },
      { delay: 950, value: 94 },
      { delay: 1200, value: 100 },
    ];
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach(({ delay, value }) => {
      timers.push(setTimeout(() => setLoadProgress(value), delay));
    });
    frame = requestAnimationFrame(() => {}); // suppress unused warning
    void frame;
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative w-full bg-[#04060e] overflow-hidden select-none">
      {/* Loading screen */}
      {!loaded && (
        <LoadingScreen progress={loadProgress} onComplete={handleComplete} />
      )}

      {/* Fixed 3D canvas */}
      <div className="fixed inset-0 w-full h-[100dvh] z-10" style={{ pointerEvents: 'none' }}>
        <Canvas
          gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
          dpr={[1, 1.5]}
          camera={{ fov: 52, near: 0.1, far: 200 }}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <CarScene activeChapter={currentChapter} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI overlay */}
      <div
        className="fixed inset-0 z-30 pointer-events-none"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.7s ease 0.2s',
        }}
      >
        {/* Brand lockup + status */}
        <div className="absolute top-6 left-6 flex items-center gap-3" data-testid="status-badge">
          <VeyraMark size={22} />
          <VeyraWordmark className="text-sm" />
          <div className="hidden md:flex items-center gap-2 ml-3 pl-3 border-l border-white/10">
            <div
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
              style={{ boxShadow: '0 0 6px rgba(0,212,255,0.9)' }}
            />
            <span className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
              SYSTEMS ONLINE
            </span>
          </div>
        </div>

        <ProgressIndicator progress={progress} currentChapter={currentChapter + 1} />
        <ChapterPanel chapterIndex={currentChapter} scrollProgress={progress} />
      </div>

      {/* Scroll driver — 7 chapters × 100vh */}
      <div
        id="scroll-container"
        className="relative z-20 w-full"
        style={{ height: '700vh', pointerEvents: 'none' }}
        data-testid="scroll-container"
      />
    </div>
  );
}
