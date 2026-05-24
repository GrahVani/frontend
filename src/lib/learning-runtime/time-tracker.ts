/**
 * useTimeTracker — accumulates wall-clock dwell time for a lesson into the
 * progress store while the user is actively viewing it.
 *
 * Semantics:
 *   - Time only counts when document.visibilityState === "visible".
 *   - Hidden tabs pause accumulation.
 *   - Flushes every 30s to survive hard tab closes / OS sleeps.
 *   - Flushes on unmount (component leaves view) so route changes don't lose
 *     a sub-30s reading session.
 *   - Pauses also if the user has been idle for > 5 minutes (no mouse / key /
 *     scroll / touch). This is a heuristic to avoid counting AFK time as study.
 */

"use client";

import { useEffect } from "react";
import { useProgressStore } from "./progress-store";

const FLUSH_INTERVAL_MS = 30_000;
const IDLE_THRESHOLD_MS = 5 * 60 * 1000;
const ACTIVITY_EVENTS: Array<keyof DocumentEventMap> = ["mousemove", "keydown", "scroll", "touchstart", "click"];

export function useTimeTracker(lessonSlug: string | null | undefined): void {
  const accumulate = useProgressStore((s) => s.accumulateTime);

  useEffect(() => {
    if (!lessonSlug) return;
    if (typeof window === "undefined") return;

    let startedAt: number | null = document.visibilityState === "visible" ? Date.now() : null;
    let pendingMs = 0;
    let lastActivityAt = Date.now();

    const flushTimingBucket = () => {
      if (startedAt != null) {
        pendingMs += Date.now() - startedAt;
        startedAt = null;
      }
    };

    const beginTimingBucket = () => {
      if (startedAt == null && document.visibilityState === "visible") {
        startedAt = Date.now();
      }
    };

    const commitToStore = () => {
      if (pendingMs > 0) {
        accumulate(lessonSlug, pendingMs);
        pendingMs = 0;
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        flushTimingBucket();
      } else {
        lastActivityAt = Date.now();
        beginTimingBucket();
      }
    };

    const handleActivity = () => {
      lastActivityAt = Date.now();
      // If user is back from idle, resume timing.
      if (startedAt == null && document.visibilityState === "visible") {
        beginTimingBucket();
      }
    };

    const idleCheck = () => {
      const idleFor = Date.now() - lastActivityAt;
      if (idleFor > IDLE_THRESHOLD_MS && startedAt != null) {
        // Park accumulation; we'll resume on next activity event.
        flushTimingBucket();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    for (const ev of ACTIVITY_EVENTS) document.addEventListener(ev, handleActivity, { passive: true });

    const flushTimer = window.setInterval(() => {
      flushTimingBucket();
      commitToStore();
      beginTimingBucket();
    }, FLUSH_INTERVAL_MS);

    const idleTimer = window.setInterval(idleCheck, 15_000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      for (const ev of ACTIVITY_EVENTS) document.removeEventListener(ev, handleActivity);
      window.clearInterval(flushTimer);
      window.clearInterval(idleTimer);
      flushTimingBucket();
      commitToStore();
    };
  }, [lessonSlug, accumulate]);
}
