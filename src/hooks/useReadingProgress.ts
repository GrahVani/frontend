"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseReadingProgressOptions {
  /** Ref to the container element to track scroll progress within */
  containerRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Custom hook tracking scroll percentage through content.
 * Returns a value from 0-100 representing reading progress.
 */
export function useReadingProgress(options?: UseReadingProgressOptions) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const container = options?.containerRef?.current;

      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const maxScroll = scrollHeight - clientHeight;
        const pct = maxScroll > 0 ? Math.min(100, (scrollTop / maxScroll) * 100) : 0;
        setProgress(Math.round(pct));
      } else {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
        setProgress(Math.round(pct));
      }
    });
  }, [options?.containerRef]);

  useEffect(() => {
    const target = options?.containerRef?.current || window;
    target.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    return () => {
      target.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll, options?.containerRef]);

  return progress;
}
