/**
 * §2 + §3 Orientation — "Scholar's Contract" panel.
 *
 * §2 prerequisites is absorbed as a quiet preamble ribbon when stance-only
 * ("first lesson of the entire curriculum"). §3 outcomes is the centerpiece:
 * a single elevated panel with corner gold-leaf ornaments, a top filigree
 * frame, Roman-numeralled outcomes, and a foot seal.
 */

import { MarkdownContent } from "../MarkdownContent";
import { BookOpen, Target } from "lucide-react";
import { presentationFor } from "../../lib/section-meta";
import { renderInline } from "../lib/inline-markdown";
import type { LessonSection, LessonFrontMatter } from "@/lib/learning-runtime/types";

interface OrientationCardsProps {
  frontMatter: LessonFrontMatter;
  prerequisites: LessonSection | undefined;
  outcomes: LessonSection | undefined;
}

/** §2 body is stance-only (i.e. first-lesson preamble) vs real prereq content. */
function isStanceOnlyPreamble(body: string): boolean {
  const t = body.toLowerCase();
  return (
    t.includes("first lesson of the entire curriculum") ||
    /no prior\b/.test(t) ||
    /no prerequisite/.test(t)
  );
}

export function OrientationCards({
  frontMatter: fm,
  prerequisites,
  outcomes,
}: OrientationCardsProps) {
  const outcomesAccent = outcomes ? presentationFor(outcomes).accentHex : "#3A8C5A";
  const hasRealPrereqs = fm.prerequisites.length > 0;
  const stanceOnly = prerequisites ? isStanceOnlyPreamble(prerequisites.body) : false;

  return (
    <section
      id={`sec-${outcomes?.number ?? prerequisites?.number ?? "2"}`}
      className="mx-auto py-6"
      style={{ maxWidth: "880px", scrollMarginTop: "120px" }}
    >
      {/* Preamble ribbon — quiet pill, never a heavy card */}
      {prerequisites && (
        <div
          style={{
            margin: "0 auto 20px",
            padding: "12px 22px",
            maxWidth: "680px",
            background:
              "linear-gradient(180deg, rgba(255, 252, 240, 0.85) 0%, rgba(250, 239, 216, 0.78) 100%)",
            border: "1px dashed rgba(58, 140, 90, 0.40)",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <BookOpen
            size={15}
            style={{ color: "#3A8C5A", flexShrink: 0 }}
            aria-hidden="true"
          />
          {stanceOnly ? (
            <p
              className="text-center italic"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                color: "var(--gl-ink-secondary)",
                lineHeight: 1.5,
                flex: "0 1 auto",
                fontSize: "16px",
              }}
            >
              The first lesson of the entire curriculum · no prior astrology
              required, only English literacy and a willingness to engage
              respectfully.
            </p>
          ) : hasRealPrereqs ? (
            <>
              <span
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "#3A8C5A",
                  fontWeight: 700,
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                }}
              >
                Before this lesson
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {fm.prerequisites.map((p) => (
                  <span
                    key={p}
                    style={{
                      fontSize: "14px",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      background: "rgba(58, 140, 90, 0.10)",
                      border: "1px solid rgba(58, 140, 90, 0.35)",
                      color: "var(--gl-ink-primary)",
                      fontFamily: "var(--font-cormorant), serif",
                      fontStyle: "italic",
                    }}
                  >
                    {humaniseSlug(p)}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                color: "var(--gl-ink-secondary)",
                lineHeight: 1.6,
                maxWidth: "560px",
              }}
            >
              <MarkdownContent>{prerequisites.body}</MarkdownContent>
            </div>
          )}
        </div>
      )}

      {/* The contract — single panel, outcomes as a vow */}
      {outcomes && fm.learningOutcomes.length > 0 && (
        <article
          aria-labelledby={`sec-${outcomes.number}-h`}
          className="gl-surface-twilight-glass"
          style={{
            padding: "32px 36px 26px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Gold-leaf filigree top frame */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "12px",
              left: "32px",
              right: "32px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                flex: 1,
                height: "1px",
                background: `linear-gradient(to right, transparent, ${outcomesAccent}55 30%, ${outcomesAccent}88 50%, ${outcomesAccent}55 70%, transparent)`,
              }}
            />
            <svg width="28" height="10" viewBox="0 0 28 10" role="presentation">
              <g fill={outcomesAccent}>
                <path d="M 2 5 L 5 2 L 8 5 L 5 8 Z" opacity="0.5" />
                <circle cx="14" cy="5" r="2" />
                <circle cx="14" cy="5" r="0.8" fill="#FFF9F0" />
                <path d="M 20 5 L 23 2 L 26 5 L 23 8 Z" opacity="0.5" />
              </g>
            </svg>
            <span
              style={{
                flex: 1,
                height: "1px",
                background: `linear-gradient(to left, transparent, ${outcomesAccent}55 30%, ${outcomesAccent}88 50%, ${outcomesAccent}55 70%, transparent)`,
              }}
            />
          </div>

          <CornerOrnament accent={outcomesAccent} corner="tl" />
          <CornerOrnament accent={outcomesAccent} corner="tr" />
          <CornerOrnament accent={outcomesAccent} corner="bl" />
          <CornerOrnament accent={outcomesAccent} corner="br" />

          <header className="text-center" style={{ marginBottom: "22px", marginTop: "12px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <Target size={15} style={{ color: outcomesAccent }} aria-hidden="true" />
              <span
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  color: outcomesAccent,
                  fontWeight: 700,
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                }}
              >
                The scholar's contract
              </span>
              <Target size={15} style={{ color: outcomesAccent, transform: "scaleX(-1)" }} aria-hidden="true" />
            </div>
            <h2
              id={`sec-${outcomes.number}-h`}
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "20px",
                fontWeight: 500,
                color: "var(--gl-ink-secondary)",
                lineHeight: 1.3,
              }}
            >
              By the end of this lesson, you will be able to:
            </h2>
          </header>

          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {fm.learningOutcomes.map((outcome, i) => (
              <li
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "52px 1fr",
                  gap: "18px",
                  alignItems: "baseline",
                  padding: "14px 0",
                  borderBottom:
                    i < fm.learningOutcomes.length - 1
                      ? "1px solid rgba(156, 122, 47, 0.14)"
                      : "none",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "24px",
                    fontWeight: 500,
                    fontStyle: "italic",
                    color: outcomesAccent,
                    lineHeight: 1.2,
                    textAlign: "right",
                    opacity: 0.72,
                    letterSpacing: "0.02em",
                  }}
                >
                  {toRoman(i + 1)}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "16px",
                    lineHeight: 1.7,
                    color: "var(--gl-ink-primary)",
                  }}
                >
                  {renderInline(outcome)}
                </p>
              </li>
            ))}
          </ol>

          {/* Foot seal — quiet single line */}
          <div
            aria-hidden="true"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(156, 122, 47, 0.15)",
            }}
          >
            <span
              style={{
                flex: 1,
                height: "1px",
                background: `linear-gradient(to right, transparent, ${outcomesAccent}44 50%, transparent)`,
                maxWidth: "140px",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "14px",
                color: "var(--gl-ink-secondary)",
                letterSpacing: "0.06em",
              }}
            >
              {fm.targetMinutesTotal ?? 25} min · {fm.bloomLevels.join(" + ")}
            </span>
            <span
              style={{
                flex: 1,
                height: "1px",
                background: `linear-gradient(to left, transparent, ${outcomesAccent}44 50%, transparent)`,
                maxWidth: "140px",
              }}
            />
          </div>
        </article>
      )}
    </section>
  );
}

/** Roman numeral 1-10. */
function toRoman(n: number): string {
  const map = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return map[n] ?? String(n);
}

/** Gold-leaf arc ornament at a corner of the contract panel. */
function CornerOrnament({
  accent,
  corner,
}: {
  accent: string;
  corner: "tl" | "tr" | "bl" | "br";
}) {
  const pos: React.CSSProperties = {
    position: "absolute",
    width: "32px",
    height: "32px",
    pointerEvents: "none",
  };
  if (corner === "tl") {
    pos.top = "6px";
    pos.left = "6px";
  } else if (corner === "tr") {
    pos.top = "6px";
    pos.right = "6px";
    pos.transform = "scaleX(-1)";
  } else if (corner === "bl") {
    pos.bottom = "6px";
    pos.left = "6px";
    pos.transform = "scaleY(-1)";
  } else {
    pos.bottom = "6px";
    pos.right = "6px";
    pos.transform = "scale(-1, -1)";
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      style={pos}
    >
      <g fill="none" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.55">
        <path d="M 2 14 Q 2 2 14 2" />
        <path d="M 5 14 Q 5 5 14 5" opacity="0.55" />
        <circle cx="2" cy="2" r="1" fill={accent} stroke="none" opacity="0.8" />
      </g>
    </svg>
  );
}

/** "tier-1/module-1/chapter-1/lesson-02-the-six-vedangas" → "Lesson 2: The Six Vedāṅgas" */
function humaniseSlug(slug: string): string {
  const parts = slug.split("/");
  const last = parts[parts.length - 1] ?? slug;
  const lessonMatch = last.match(/^lesson-(\d+)-(.+)$/);
  if (lessonMatch) {
    const n = parseInt(lessonMatch[1], 10);
    const name = lessonMatch[2].replace(/-/g, " ");
    return `Lesson ${n}: ${name.replace(/\b\w/g, (c) => c.toUpperCase())}`;
  }
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
