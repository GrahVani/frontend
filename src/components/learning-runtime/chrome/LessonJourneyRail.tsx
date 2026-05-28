/**
 * Lesson Journey Rail — the rich left-rail per Phase C-Reformed Reform-5.
 *
 * What this rail is:
 *  - lesson title + chapter context at the top
 *  - embodied section names (not §-numbers) with per-section graha accents
 *  - reading time estimate per section
 *  - gold-thread connector that fills as the learner scrolls through sections
 *  - mastered-section gold-seal marks
 *  - "From the source" mini-table of ślokas (primary classical citations)
 *  - estimated time remaining at the foot
 *
 * It is the learner's *map*, not a stepper.
 */

"use client";

import { useMemo } from "react";
import { CheckCircle2, BookOpen, Clock, Sparkles } from "lucide-react";
import type { LessonSection, LessonFrontMatter } from "@/lib/learning-runtime/types";
import { useProgressStore } from "@/lib/learning-runtime/progress-store";
import { presentationFor, estimateReadingMinutes } from "../lib/section-meta";

interface LessonJourneyRailProps {
  sections: LessonSection[];
  frontMatter: LessonFrontMatter;
  activeSectionNumber: string | null;
}

/** Convert a kebab-case slug into a Title Case phrase for display.
 * `"what-jyotisha-is"` → `"What Jyotiṣa Is"`. Specific Sanskrit terms get a
 * pass-through map so diacritics are preserved. */
function humanizeSlug(slug: string): string {
  const SANSKRIT_MAP: Record<string, string> = {
    jyotisha: "Jyotiṣa",
    vedanga: "Vedāṅga",
    vedangas: "Vedāṅgas",
    saṅga: "Sāṅga",
    samhita: "Saṁhitā",
    parashari: "Parāśarī",
    parashara: "Parāśara",
    panchanga: "Pañcāṅga",
    panchang: "Pañcāṅga",
    karma: "Karma",
    moksha: "Mokṣa",
    dasha: "Daśā",
    nakshatra: "Nakṣatra",
    rashi: "Rāśi",
    bhava: "Bhāva",
    graha: "Graha",
    grahas: "Grahas",
    ayanamsha: "Ayanāṁśa",
  };
  return slug
    .split("-")
    .map((word) => {
      const lower = word.toLowerCase();
      if (SANSKRIT_MAP[lower]) return SANSKRIT_MAP[lower];
      // Short stopwords stay lowercase mid-phrase
      if (["of", "and", "is", "the", "in", "to", "vs", "or", "a"].includes(lower)) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ")
    // Capitalise the first character of the whole phrase even if it was a stopword
    .replace(/^./, (c) => c.toUpperCase());
}

export function LessonJourneyRail({
  sections,
  frontMatter,
  activeSectionNumber,
}: LessonJourneyRailProps) {
  const lessonSlug = frontMatter.slug;
  const lesson = useProgressStore((s) => s.lessons[lessonSlug]);
  const viewed = useMemo(
    () => new Set(lesson?.sectionsViewed ?? []),
    [lesson?.sectionsViewed],
  );
  const mastered = lesson?.masteryStatus === "Mastered";

  const sectionsWithMeta = useMemo(
    () =>
      sections.map((s) => ({
        section: s,
        presentation: presentationFor(s),
        minutes: estimateReadingMinutes(s),
      })),
    [sections],
  );

  const totalMinutes = useMemo(
    () => sectionsWithMeta.reduce((acc, x) => acc + x.minutes, 0),
    [sectionsWithMeta],
  );

  const completedMinutes = useMemo(() => {
    if (mastered) return totalMinutes;
    let m = 0;
    for (const x of sectionsWithMeta) {
      if (viewed.has(x.section.number)) m += x.minutes;
    }
    return m;
  }, [sectionsWithMeta, viewed, mastered, totalMinutes]);

  const progressPct = totalMinutes === 0 ? 0 : Math.min(100, (completedMinutes / totalMinutes) * 100);

  // Primary sources, displayed as the "From the source" mini-table.
  const primarySources = frontMatter.primarySources.slice(0, 4);

  return (
    <nav
      aria-label="Lesson journey"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
      }}
    >
      {/* Chapter + lesson context */}
      <div
        style={{
          padding: "16px 18px",
          background: "linear-gradient(180deg, rgba(255, 249, 234, 0.92) 0%, rgba(250, 239, 216, 0.85) 100%)",
          border: "1px solid rgba(156, 122, 47, 0.30)",
          borderRadius: "12px",
          boxShadow:
            "0 1px 0 rgba(255, 255, 255, 0.65) inset, 0 -1px 0 rgba(139, 90, 43, 0.14) inset, 0 4px 12px rgba(62, 42, 31, 0.07)",
          position: "relative",
        }}
      >
        {/* gold-leaf top edge */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "10%",
            right: "10%",
            top: "-1px",
            height: "2px",
            background: "linear-gradient(to right, transparent, #E6C97A 30%, #C9A24D 50%, #E6C97A 70%, transparent)",
            borderRadius: "999px",
          }}
        />
        <p
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--gl-gold-accent)",
            fontWeight: 600,
            marginBottom: "6px",
          }}
        >
          Tier {frontMatter.tier} · Module {frontMatter.module} · Chapter {frontMatter.chapter} · Lesson {frontMatter.sequence}
        </p>
        {/* Humanised chapter context — derived from chapterSlug so the card
            shows WHICH chapter, not just "Chapter 1". */}
        {frontMatter.chapterSlug && (
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "13px",
              color: "var(--gl-ink-muted)",
              marginBottom: "8px",
              lineHeight: 1.3,
            }}
          >
            {humanizeSlug(frontMatter.chapterSlug)}
          </p>
        )}
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "17px",
            fontWeight: 500,
            color: "var(--gl-ink-primary)",
            lineHeight: 1.3,
          }}
        >
          {frontMatter.title.split(":")[0]}
        </p>
        {/* Colon-suffix subtitle — restored so the lesson's distinguishing
            sub-content (e.g. "Saṁcita, Prārabdha, Āgāmī, Kriyamāṇa") is
            visible, not lost to truncation. */}
        {frontMatter.title.includes(":") && (
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "13.5px",
              color: "var(--gl-ink-secondary)",
              marginTop: "3px",
              lineHeight: 1.4,
            }}
          >
            {frontMatter.title.split(":").slice(1).join(":").trim()}
          </p>
        )}
        {frontMatter.titleDevanagari && (
          <p
            lang="sa"
            style={{
              fontFamily: "var(--font-devanagari), serif",
              fontSize: "14px",
              color: "var(--gl-gold-accent)",
              marginTop: "6px",
              lineHeight: 1.4,
            }}
          >
            {frontMatter.titleDevanagari.split(":")[0]}
          </p>
        )}

        {/* Lesson-level progress bar (gold thread) */}
        <div
          style={{
            marginTop: "12px",
            height: "3px",
            borderRadius: "999px",
            background: "rgba(156, 122, 47, 0.18)",
            overflow: "hidden",
            position: "relative",
          }}
          role="progressbar"
          aria-valuenow={Math.round(progressPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Lesson progress: ${Math.round(progressPct)}%`}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progressPct}%`,
              background:
                "linear-gradient(to right, #E6C97A 0%, #C9A24D 50%, #9C7A2F 100%)",
              transition: "width 400ms cubic-bezier(0.65, 0, 0.35, 1)",
              boxShadow: "0 0 6px rgba(201, 162, 77, 0.50)",
            }}
          />
        </div>
        <p
          style={{
            marginTop: "8px",
            fontSize: "14px",
            color: "var(--gl-ink-muted)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Clock size={10} />
          {Math.round(completedMinutes)} of {Math.round(totalMinutes)} min · {Math.round(progressPct)}%
        </p>
      </div>

      {/* Section nodes — vertical timeline */}
      <ol style={{ listStyle: "none", padding: 0, margin: 0, position: "relative" }}>
        {/* Background connector thread */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "11px",
            top: "12px",
            bottom: "12px",
            width: "2px",
            background: "rgba(156, 122, 47, 0.18)",
            borderRadius: "999px",
          }}
        />
        {sectionsWithMeta.map(({ section, presentation, minutes }) => {
          const isActive = activeSectionNumber === section.number;
          const isViewed = mastered || viewed.has(section.number);
          return (
            <li
              key={section.number}
              style={{ position: "relative", paddingLeft: "32px", paddingBottom: "12px" }}
            >
              <a
                href={`#sec-${section.number.replace(".", "-")}`}
                aria-label={`Jump to ${presentation.railLabel} · approximately ${minutes} minute${minutes === 1 ? "" : "s"}${isViewed ? " · viewed" : ""}${isActive ? " · current section" : ""}`}
                title={`${presentation.railLabel} · ${minutes} min`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1px",
                  textDecoration: "none",
                  borderRadius: "6px",
                  padding: "4px 8px 4px 4px",
                  marginLeft: "-4px",
                  background: isActive ? "rgba(232, 199, 114, 0.10)" : "transparent",
                  transition: "background 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                }}
              >
                {/* Section node — diamond/circle on the rail */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "2px",
                    top: "4px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: isViewed
                      ? `radial-gradient(circle at 30% 30%, #F5DDA0 0%, ${presentation.accentHex} 100%)`
                      : "rgba(255, 249, 234, 0.95)",
                    border: `2px solid ${isActive || isViewed ? presentation.accentHex : "rgba(156, 122, 47, 0.30)"}`,
                    boxShadow: isActive
                      ? `0 0 0 4px ${presentation.accentHex}22, 0 0 12px ${presentation.accentHex}30`
                      : isViewed
                        ? `0 1px 4px ${presentation.accentHex}33`
                        : "0 1px 2px rgba(62, 42, 31, 0.08)",
                    transition: "all 250ms cubic-bezier(0.65, 0, 0.35, 1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isViewed && !isActive && (
                    <CheckCircle2 size={10} style={{ color: "rgba(255, 249, 234, 0.95)" }} />
                  )}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? presentation.accentHex
                      : isViewed
                        ? "var(--gl-ink-primary)"
                        : "var(--gl-ink-secondary)",
                    lineHeight: 1.3,
                    transition: "color 250ms",
                  }}
                >
                  {section.number.includes(".") ? section.title : presentation.railLabel}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--gl-ink-secondary)",
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Clock size={10} aria-hidden="true" />
                  {minutes} min
                  {isViewed && !isActive && (
                    <span style={{ color: presentation.accentHex, marginLeft: "4px" }}>· read</span>
                  )}
                </span>
              </a>
            </li>
          );
        })}
      </ol>

      {/* Table of ślokas — primary classical citations in this lesson */}
      {primarySources.length > 0 && (
        <div
          style={{
            padding: "14px 16px",
            background: "linear-gradient(180deg, rgba(255, 249, 234, 0.85) 0%, rgba(248, 240, 218, 0.78) 100%)",
            border: "1px solid rgba(156, 122, 47, 0.30)",
            borderRadius: "10px",
            boxShadow:
              "0 1px 0 rgba(255, 255, 255, 0.55) inset, 0 4px 12px rgba(62, 42, 31, 0.05)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#A23A1E",
              fontWeight: 600,
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <BookOpen size={11} />
            Classical anchors
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {primarySources.map((src, i) => (
              <li
                key={i}
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  fontSize: "14px",
                  color: "var(--gl-ink-primary)",
                  lineHeight: 1.4,
                  marginBottom: "6px",
                  paddingLeft: "10px",
                  position: "relative",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "6px",
                    width: "4px",
                    height: "4px",
                    background: "#A23A1E",
                    borderRadius: "50%",
                  }}
                />
                {src.ref}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mastery state seal */}
      {mastered && (
        <div
          style={{
            padding: "14px 16px",
            background: "linear-gradient(135deg, #F4C77B 0%, #E8A85C 100%)",
            border: "1px solid rgba(156, 122, 47, 0.50)",
            borderRadius: "10px",
            textAlign: "center",
            position: "relative",
            boxShadow:
              "0 1px 0 rgba(255, 255, 255, 0.55) inset, 0 6px 20px rgba(232, 168, 92, 0.30)",
          }}
        >
          <Sparkles
            size={20}
            style={{ color: "#1A1408", margin: "0 auto 4px", display: "block" }}
          />
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "16px",
              fontWeight: 600,
              color: "#1A1408",
              letterSpacing: "0.02em",
            }}
          >
            Lesson mastered
          </p>
        </div>
      )}
    </nav>
  );
}
