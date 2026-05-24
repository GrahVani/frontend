/**
 * RevealSection — IntersectionObserver-driven fade-up wrapper per Phase C C4.
 *
 * Wraps any section in a layered reveal: starts at opacity 0, translateY(24px);
 * crosses to opacity 1, translateY(0) when ≥ 12% of the element is in view.
 * Once revealed, stays revealed (no re-trigger on scroll-back).
 *
 * Respects `prefers-reduced-motion: reduce` — collapses to instant visibility.
 *
 * Server-renders visible by default so SSR/JS-disabled clients see content;
 * the dim-and-rise is a progressive enhancement on the client.
 */

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealSectionProps {
  children: ReactNode;
  /** ms to delay the reveal after intersection — staggers cascading sections. */
  delayMs?: number;
}

export function RevealSection({ children, delayMs = 0 }: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  // SSR-visible by default. Hydration flips to false (hidden) then IO restores to true.
  const [revealed, setRevealed] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHydrated(true);
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(rm);
    if (rm) {
      setRevealed(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    // If the element is already in viewport at hydration time, skip the hide step entirely.
    const rect = node.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
    if (inView) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
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
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs]);

  const animate = hydrated && !reducedMotion;
  return (
    <div
      ref={ref}
      style={{
        opacity: animate ? (revealed ? 1 : 0) : 1,
        transform: animate ? (revealed ? "translateY(0)" : "translateY(24px)") : "none",
        transition: animate ? "opacity 400ms cubic-bezier(0.32, 0.72, 0.24, 1), transform 400ms cubic-bezier(0.32, 0.72, 0.24, 1)" : "none",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
