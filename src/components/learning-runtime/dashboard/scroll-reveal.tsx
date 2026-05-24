/**
 * ScrollReveal — IntersectionObserver-driven entrance animations.
 *
 * Wraps any element; when it enters viewport ≥12%, fades in + slides up.
 * Respects prefers-reduced-motion.
 */

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delayMs?: number;
  /** Vertical translate offset before reveal — defaults to 24px. */
  offsetPx?: number;
  /** Optional inline style merge. */
  style?: React.CSSProperties;
}

export function ScrollReveal({ children, delayMs = 0, offsetPx = 24, style }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
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
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > window.innerHeight * 0.05) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.setTimeout(() => setRevealed(true), delayMs);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [delayMs]);

  const animate = hydrated && !reducedMotion;
  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity: animate ? (revealed ? 1 : 0) : 1,
        transform: animate ? (revealed ? "translateY(0)" : `translateY(${offsetPx}px)`) : "none",
        transition: animate ? "opacity 720ms cubic-bezier(0.32, 0.72, 0.24, 1), transform 720ms cubic-bezier(0.32, 0.72, 0.24, 1)" : "none",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
