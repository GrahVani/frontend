/**
 * LessonTimeTracker — invisible client-side mounter that drives the time
 * accumulator while a lesson page is open.
 *
 * Mounts once per lesson route, identifies the lesson by its canonical slug,
 * and tells the progress store how many ms were spent reading.
 */

"use client";

import { useTimeTracker } from "@/lib/learning-runtime/time-tracker";

export function LessonTimeTracker({ slug }: { slug: string }) {
  useTimeTracker(slug);
  return null;
}
