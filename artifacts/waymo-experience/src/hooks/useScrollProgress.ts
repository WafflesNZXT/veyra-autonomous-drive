import { useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const scrollState = {
  progress: 0,
  chapterIndex: 0,
};

export function useScrollProgress() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        scrollState.progress = self.progress;
        setProgress(self.progress);
        const newChapter = Math.min(6, Math.floor(self.progress * 6.99));
        if (newChapter !== scrollState.chapterIndex) {
          scrollState.chapterIndex = newChapter;
          setCurrentChapter(newChapter);
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return { currentChapter, progress };
}
