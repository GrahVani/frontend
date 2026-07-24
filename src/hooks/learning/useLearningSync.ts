/**
 * useLearningSync — bridges the local Zustand progress store with the
 * learning-service backend, using contracts verified against the live service
 * (smoke-tested 2026-05-22).
 *
 * Architecture:
 *   • Server is source of truth.
 *   • localStorage is the offline buffer.
 *   • On mount: GET /dashboard → store.hydrateFromServer(...)
 *   • On store mutations (recordAttempt, markSectionViewed): write-through.
 *     Failures get queued + replayed on `online` / `focus`.
 *   • Returns rich live status + the raw DashboardPayload so the dashboard
 *     can read tier/badges/XP from the server when available.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useProgressStore, type LessonProgress, type AttemptRecord } from "@/lib/learning-runtime/progress-store";
import { getUserIdFromCurrentToken } from "@/lib/api/jwt";
import {
  fetchDashboard,
  submitLessonQuiz,
  postSectionView,
  postDailyLogin,
  type DashboardPayload,
  type LessonProgressRow,
} from "@/lib/api/learning";
import { readQueue, writeQueue, type QueuedMutation } from "@/lib/learning-runtime/mutation-queue";

const MAX_QUEUE_ATTEMPTS = 6;

/** Convert a server LessonProgressRow into the client-side LessonProgress shape. */
function adaptServerRow(row: LessonProgressRow): LessonProgress {
  const lessonSlug = row.lessonSlug ?? row.lessonId;
  const attempts: AttemptRecord[] = [];
  
  if (row.lastAttemptedAt) {
    attempts.push({
      attemptedAt: new Date(row.lastAttemptedAt).getTime(),
      scorePct: row.score ?? 0,
      passed: (row.score ?? 0) >= 80,
      wrongQuestionIds: [],
    });
  }

  let cooldownUntil: number | null = null;
  if (row.cooldownUntil) {
    cooldownUntil = new Date(row.cooldownUntil).getTime();
  }

  let masteryStatus: "Untouched" | "InProgress" | "Mastered" | "OnCooldown" = "Untouched";
  if (row.status === "MASTERED") {
    masteryStatus = "Mastered";
  } else if (cooldownUntil && cooldownUntil > Date.now()) {
    masteryStatus = "OnCooldown";
  } else if (row.status === "COMPLETED" || row.status === "IN_PROGRESS" || attempts.length > 0) {
    masteryStatus = "InProgress";
  }

  return {
    lessonSlug,
    attempts,
    cooldownUntil,
    masteryStatus,
    sectionsViewed: (row.sectionsViewedJson ?? []).map((n) => String(n)),
    lessonCompletedAt: row.completedAt ? new Date(row.completedAt).getTime() : null,
  };
}

function adaptDashboard(payload: DashboardPayload): {
  lessons: Record<string, LessonProgress>;
  streakDays: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  totalTimeMs: number;
  perLessonTimeMs: Record<string, number>;
} {
  const lessons: Record<string, LessonProgress> = {};
  for (const row of payload.progress ?? []) {
    const adapted = adaptServerRow(row);
    if (adapted.lessonSlug) lessons[adapted.lessonSlug] = adapted;
  }
  return {
    lessons,
    streakDays: payload.currentStreak ?? 0,
    longestStreak: payload.longestStreak ?? 0,
    lastCompletedDate: null, // server tracks date internally; we don't need it locally
    totalTimeMs: 0, // server doesn't expose total dwell time yet
    perLessonTimeMs: {},
  };
}

export interface LearningSyncStatus {
  hasIdentity: boolean;
  isHydrated: boolean;
  isReachable: boolean;
  queuedMutationCount: number;
  dashboard: DashboardPayload | null;
}

/**
 * Mount once per dashboard. Returns live status + the server's last-known
 * DashboardPayload so the UI can render badges, XP, tier names from
 * authoritative data when available.
 */
export function useLearningSync(): LearningSyncStatus {
  const hydrateFromServer = useProgressStore((s) => s.hydrateFromServer);
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [hasIdentity, setHasIdentity] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isReachable, setIsReachable] = useState(false);
  const [queuedCount, setQueuedCount] = useState(0);
  const queueRef = useRef<QueuedMutation[]>([]);

  const dispatchMutation = useCallback(async (item: QueuedMutation): Promise<void> => {
    switch (item.kind) {
      case "submit-lesson": {
        const { userId, answers } = item.payload as { userId: string; answers: Array<{ questionId: string; answer: string | string[]; timeSpentSeconds: number }> };
        if (!item.slug) return;
        await submitLessonQuiz(item.slug, { userId, answers });
        return;
      }
      case "section-view": {
        const { userId, sectionId } = item.payload as { userId: string; sectionId: number };
        if (!item.slug) return;
        await postSectionView(item.slug, userId, sectionId);
        return;
      }
      case "daily-login": {
        const { userId } = item.payload as { userId: string };
        await postDailyLogin(userId);
        return;
      }
    }
  }, []);

  const drainQueue = useCallback(async (): Promise<void> => {
    // Re-read from localStorage in case MCQFlow (or other code paths) enqueued
    // outside this hook's React-state ref.
    queueRef.current = readQueue();
    if (queueRef.current.length === 0) return;
    if (typeof window !== "undefined" && navigator && navigator.onLine === false) return;
    const remaining: QueuedMutation[] = [];
    for (const item of queueRef.current) {
      try {
        await dispatchMutation(item);
        setIsReachable(true);
      } catch {
        item.attempts += 1;
        if (item.attempts < MAX_QUEUE_ATTEMPTS) remaining.push(item);
        setIsReachable(false);
      }
    }
    queueRef.current = remaining;
    writeQueue(remaining);
    setQueuedCount(remaining.length);
  }, [dispatchMutation]);

  const enqueue = useCallback(
    (item: QueuedMutation): void => {
      queueRef.current = [...queueRef.current, item];
      writeQueue(queueRef.current);
      setQueuedCount(queueRef.current.length);
      void drainQueue();
    },
    [drainQueue],
  );

  // Initial hydration on mount.
  useEffect(() => {
    let cancelled = false;
    const userId = getUserIdFromCurrentToken();
    setHasIdentity(userId != null);
    if (!userId) return;

    queueRef.current = readQueue();
    setQueuedCount(queueRef.current.length);

    (async () => {
      try {
        const payload = await fetchDashboard(userId);
        if (cancelled) return;
        setDashboard(payload);
        hydrateFromServer(adaptDashboard(payload));
        setIsHydrated(true);
        setIsReachable(true);
        // Fire-and-forget daily-login point. Backend dedupes per day.
        try {
          await postDailyLogin(userId);
        } catch (e) {
          console.warn("[useLearningSync] daily-login failed, queued for retry:", e);
          enqueue({ kind: "daily-login", payload: { userId }, enqueuedAt: Date.now(), attempts: 0 });
        }
      } catch (e) {
        console.error("[useLearningSync] fetchDashboard failed:", e);
        setIsReachable(false);
      }
      void drainQueue();
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrateFromServer, drainQueue, enqueue]);

  // Write-through subscription on store mutations.
  useEffect(() => {
    const userId = getUserIdFromCurrentToken();
    if (!userId) return;

    let prevLessons = useProgressStore.getState().lessons;
    const unsub = useProgressStore.subscribe((state) => {
      const next = state.lessons;
      if (next === prevLessons) return;
      for (const slug in next) {
        const prevSections = prevLessons[slug]?.sectionsViewed ?? [];
        const nextSections = next[slug]?.sectionsViewed ?? [];
        if (nextSections.length > prevSections.length) {
          const newSection = nextSections[nextSections.length - 1];
          const sectionId = Number(newSection);
          if (Number.isFinite(sectionId)) {
            enqueue({
              kind: "section-view",
              slug,
              payload: { userId, sectionId },
              enqueuedAt: Date.now(),
              attempts: 0,
            });
          }
        }
        // Note: lesson submissions now flow through MCQFlow directly via
        // submitLessonQuiz, NOT through recordAttempt → write-through.
        // That's intentional: the server is the grader, so the client can't
        // know `passed` without the round-trip.
      }
      prevLessons = next;
    });
    return unsub;
  }, [enqueue]);

  // Drain on focus / online.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => void drainQueue();
    window.addEventListener("online", handler);
    window.addEventListener("focus", handler);
    return () => {
      window.removeEventListener("online", handler);
      window.removeEventListener("focus", handler);
    };
  }, [drainQueue]);

  return {
    hasIdentity,
    isHydrated,
    isReachable,
    queuedMutationCount: queuedCount,
    dashboard,
  };
}
