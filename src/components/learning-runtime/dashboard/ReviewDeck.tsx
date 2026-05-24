/**
 * ReviewDeck — surfaces lessons due for spaced-repetition review.
 *
 * A lesson enters the deck when:
 *   - masteryStatus === "Mastered", AND
 *   - the most recent attempt was ≥ 7 days ago
 *
 * The list is sorted stalest-first so the lesson the learner is most likely
 * to have forgotten appears at the top. Each card links back into the lesson
 * route so the learner can re-attempt the MCQ block.
 */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Sparkles, Calendar, ChevronRight, Clock } from "lucide-react";
import { useProgressStore } from "@/lib/learning-runtime/progress-store";

interface ReviewLesson {
  slug: string;
  canonicalSlug: string;
  title: string;
  href: string;
  chapterTitle: string;
  chapterSequence: number;
  moduleTitle: string;
  moduleSequence: number;
  targetMinutes: number;
  bloomLevels: string[];
}

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const INK_PRIMARY = "#2B1F12";
const INK_SECONDARY = "#5C4A2E";
const INK_MUTED = "#7A6747";

export function ReviewDeck({ lessons }: { lessons: ReviewLesson[] }) {
  const progressByLesson = useProgressStore((s) => s.lessons);

  const due = useMemo(() => {
    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const items: Array<ReviewLesson & { lastAttemptedAt: number; stalenessMs: number }> = [];
    for (const lesson of lessons) {
      const progress = progressByLesson[lesson.canonicalSlug];
      if (!progress || progress.masteryStatus !== "Mastered" || progress.attempts.length === 0) continue;
      const lastAt = progress.attempts[progress.attempts.length - 1].attemptedAt;
      const staleness = now - lastAt;
      if (staleness >= SEVEN_DAYS) {
        items.push({ ...lesson, lastAttemptedAt: lastAt, stalenessMs: staleness });
      }
    }
    items.sort((a, b) => b.stalenessMs - a.stalenessMs);
    return items;
  }, [lessons, progressByLesson]);

  return (
    <main className="gl-surface-night" style={{ minHeight: "100vh", padding: "64px 32px 96px" }}>
      <div style={{ maxWidth: "880px", margin: "0 auto" }}>
        <header style={{ marginBottom: "32px" }}>
          <Link href="/learn" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.2em", color: GOLD_DEEP, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "20px" }}>
            ← Back to Learn
          </Link>
          <p style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.24em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", padding: "6px 18px", borderRadius: "999px", background: "rgba(252, 230, 184, 0.55)", border: `1px solid ${GOLD}55`, marginBottom: "12px" }}>
            <Sparkles size={13} /> Today's Review
          </p>
          <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "44px", fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.1, marginBottom: "8px" }}>
            {due.length === 0 ? "No lessons due for review" : due.length === 1 ? "One lesson is calling you back" : `${due.length} lessons are calling you back`}
          </h1>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "17px", color: INK_SECONDARY, lineHeight: 1.5, maxWidth: "600px" }}>
            Reinforcement is the path to retention. A lesson enters this deck a week after you master it — re-attempt the MCQ block to stamp it deeper.
          </p>
        </header>

        {due.length === 0 ? (
          <div
            style={{
              padding: "48px 32px",
              borderRadius: "16px",
              background: "linear-gradient(180deg, rgba(255, 252, 240, 0.94), rgba(255, 244, 220, 0.78))",
              border: `1px solid ${GOLD}55`,
              boxShadow: "0 14px 36px rgba(62, 42, 31, 0.10), 0 1px 0 rgba(255, 255, 255, 0.85) inset",
              textAlign: "center",
            }}
          >
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", color: INK_PRIMARY, fontStyle: "italic", marginBottom: "8px" }}>
              All caught up.
            </p>
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "15px", color: INK_MUTED }}>
              Master a few more lessons, then return next week.
            </p>
          </div>
        ) : (
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
            {due.map((l) => (
              <li key={l.canonicalSlug}>
                <Link
                  href={l.href}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    padding: "18px 22px",
                    borderRadius: "12px",
                    background: "linear-gradient(180deg, rgba(255, 252, 240, 0.94), rgba(255, 244, 220, 0.82))",
                    border: `1px solid ${GOLD}44`,
                    boxShadow: "0 8px 22px rgba(62, 42, 31, 0.08), 0 1px 0 rgba(255, 255, 255, 0.85) inset",
                    transition: "transform 220ms cubic-bezier(0.32, 0.72, 0.24, 1), box-shadow 220ms",
                  }}
                  className="gl-review-card"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.18em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "4px" }}>
                        Module {l.moduleSequence} · Chapter {l.chapterSequence}
                      </p>
                      <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "21px", fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.25, marginBottom: "6px" }}>
                        {l.title}
                      </h2>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13.5px", color: INK_MUTED }}>
                          <Calendar size={12} />
                          Last reviewed {formatRelative(l.lastAttemptedAt)}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13.5px", color: INK_MUTED }}>
                          <Clock size={12} />
                          {l.targetMinutes} min
                        </span>
                        {l.bloomLevels.length > 0 && (
                          <span style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13.5px", color: INK_MUTED }}>
                            {l.bloomLevels.join(" · ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "12.5px", fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em" }}>Review</span>
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
      <style>{`
        .gl-review-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(62, 42, 31, 0.14), 0 1px 0 rgba(255, 255, 255, 0.92) inset !important;
        }
      `}</style>
    </main>
  );
}

function formatRelative(timestamp: number): string {
  const ms = Date.now() - timestamp;
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "a week ago";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return "a month ago";
  return `${Math.floor(days / 30)} months ago`;
}
