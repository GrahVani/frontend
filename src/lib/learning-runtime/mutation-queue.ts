/**
 * Shared mutation queue — single localStorage-backed pipe between any
 * client that needs to write to learning-service and the sync orchestrator
 * (`useLearningSync`) that drains the pipe on online/focus events.
 *
 * Why a shared queue instead of a callback? Because MCQFlow can't reach the
 * sync hook (it's not in the same React subtree at submit time on every
 * navigation path), and a localStorage hand-off keeps the contract small.
 */

"use client";

export interface QueuedMutation {
  kind: "submit-lesson" | "section-view" | "daily-login";
  slug?: string;
  payload: Record<string, unknown>;
  enqueuedAt: number;
  attempts: number;
}

export const QUEUE_STORAGE_KEY = "grahvani-learning-mutation-queue";

export function readQueue(): QueuedMutation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QueuedMutation[]) : [];
  } catch {
    return [];
  }
}

export function writeQueue(queue: QueuedMutation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch {
    /* localStorage full — fail silently */
  }
}

export function enqueueMutation(item: QueuedMutation): void {
  const queue = readQueue();
  queue.push(item);
  writeQueue(queue);
}
