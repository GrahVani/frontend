/**
 * RevealSection — IntersectionObserver-driven fade-up wrapper per Phase C C4.
 *
 * Wraps any section in a layered reveal: starts at opacity 0, translateY(24px);
 * crosses to opacity 1, translateY(0) when any part of the element is in view.
 * Once revealed, stays revealed (no re-trigger on scroll-back).
 *
 * Respects `prefers-reduced-motion: reduce` — collapses to instant visibility.
 *
 * Server-renders visible by default so SSR/JS-disabled clients see content;
 * the dim-and-rise is a progressive enhancement on the client.
 */

"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface RevealSectionProps {
  children: ReactNode;
  /** ms to delay the reveal after intersection — staggers cascading sections. */
  delayMs?: number;
  /** Optional element id for scroll targets (e.g., section-1) */
  id?: string;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function RevealSection({ children, delayMs = 0, id }: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Server-render visible; client determines whether to hide before first paint.
  const [revealed, setRevealed] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(rm);
    if (rm) {
      setRevealed(true);
      return;
    }

    // Measure synchronously before paint so out-of-view sections are hidden
    // without a flash of visible content. Any overlap with the viewport counts
    // as in-view (threshold 0 on the observer handles the actual reveal).
    const rect = node.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) {
      setRevealed(false);
    }
    const elementHeight = node.offsetHeight || node.getBoundingClientRect().height;
    const threshold = elementHeight > window.innerHeight * 0.8 ? 0.01 : 0.12;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.setTimeout(() => setRevealed(true), delayMs);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div
      ref={ref}
      id={id}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(24px)",
        transition: reducedMotion
          ? "none"
          : "opacity 400ms cubic-bezier(0.32, 0.72, 0.24, 1), transform 400ms cubic-bezier(0.32, 0.72, 0.24, 1)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
