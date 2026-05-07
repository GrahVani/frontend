"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseScrollSpyOptions {
  /** CSS selector or array of element IDs to observe */
  sectionIds: string[];
  /** Offset from top of viewport (px) to trigger active state */
  offset?: number;
  /** Root margin for IntersectionObserver */
  rootMargin?: string;
}

/**
 * Custom hook that tracks which section is currently visible in the viewport.
 * Uses IntersectionObserver for performant scroll tracking.
 */
export function useScrollSpy({
  sectionIds,
  offset = 120,
  rootMargin = "-20% 0px -60% 0px",
}: UseScrollSpyOptions) {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setupObserver = useCallback(() => {
    // Cleanup existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const entries = new Map<string, IntersectionObserverEntry>();

    observerRef.current = new IntersectionObserver(
      (observedEntries) => {
        observedEntries.forEach((entry) => {
          entries.set(entry.target.id, entry);
        });

        // Find the topmost visible section
        const visibleSections = sectionIds.filter((id) => {
          const entry = entries.get(id);
          return entry?.isIntersecting;
        });

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0]);
        }
      },
      { rootMargin, threshold: [0, 0.1, 0.25, 0.5] }
    );

    // Observe each section
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observerRef.current!.observe(el);
      }
    });
  }, [sectionIds, rootMargin]);

  useEffect(() => {
    // Small delay to ensure DOM elements are rendered
    const timer = setTimeout(setupObserver, 100);
    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [setupObserver]);

  return activeSection;
}
