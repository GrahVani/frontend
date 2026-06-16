/**
 * §11 Summary in 90 seconds — three-stanza closing.
 *
 * Redesigned 2026-05-22: was three identical columns of equal weight. Now a
 * three-stanza composition where each stanza speaks in a different voice:
 *   - I  · The Central Claim     — full-width dawn-warm epigraph (headline)
 *   - II · The Classical Anchor  — half-width manuscript-cream citation card
 *   - III· The Takeaway          — half-width twilight-glass operational card
 *   - The Coda                   — full-width italic wisdom line
 *   - Closing source attribution — scholarly bottom-line
 *
 * A small Devanāgarī "९०" seal in the header reinforces the 90-seconds promise.
 * Inline markdown (`*italic*`, `` `code` ``, `'quoted'`) is rendered throughout.
 */

import { SectionHeader } from "../SectionHeader";
import { presentationFor } from "../../lib/section-meta";
import { Minimize2, BookOpen, ArrowRight } from "lucide-react";
import type { LessonSection, LessonFrontMatter } from "@/lib/learning-runtime/types";
import { renderInline } from "../lib/inline-markdown";
import type { ReactNode } from "react";

interface SummaryProps {
  section: LessonSection;
  frontMatter: LessonFrontMatter;
}

const ACCENT_CLAIM = "#9C7A2F";
const ACCENT_ANCHOR = "#A23A1E";
const ACCENT_TAKEAWAY = "#3A8C5A";

export function Summary({ section, frontMatter: fm }: SummaryProps) {
  // Split the markdown body into paragraphs (separated by blank lines).
  const paragraphs = section.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const [claimText, anchorText, takeawayText, ...codaArr] = paragraphs;
  const coda = codaArr.join("\n\n");
  const primaryAnchor = fm.primarySources[0]?.ref;
  const primaryNote = fm.primarySources[0]?.note;
  const hasAnchor = Boolean(anchorText);
  const hasTakeaway = Boolean(takeawayText);

  return (
    <section
      id={`sec-${section.number}`}
      aria-labelledby={`sec-${section.number}-h`}
      className="mx-auto py-5"
      style={{ maxWidth: "960px", scrollMarginTop: "120px" }}
    >
      {/* Header with Devanāgarī "९०" seal — reinforces the 90-seconds promise */}
      <div className="mb-7 text-center" style={{ position: "relative" }}>
        {/* Devanāgarī seal */}
        <div
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255, 252, 240, 0.95) 0%, rgba(255, 249, 234, 0.85) 100%)`,
            border: `1.5px solid ${ACCENT_CLAIM}`,
            margin: "0 auto 10px",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.65), 0 2px 6px rgba(62, 42, 31, 0.10)`,
          }}
        >
          <span
            lang="sa"
            style={{
              fontFamily: "var(--font-devanagari), serif",
              fontSize: "18px",
              lineHeight: 1,
              color: ACCENT_CLAIM,
              fontWeight: 500,
            }}
          >
            ९०
          </span>
        </div>
        {(() => {
          const pres = presentationFor(section);
          return (
            <SectionHeader
              eyebrow={pres.eyebrow}
              title={pres.embodiedTitle}
              accentHex={pres.accentHex}
              ornament={<Minimize2 size={16} />}
              align="center"
              size="compact"
              tight
            />
          );
        })()}
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "16px",
            color: "var(--gl-ink-secondary)",
            marginTop: "8px",
            opacity: 0.9,
          }}
        >
          Three thoughts, sealed.
        </p>
      </div>

      {/* Stanza I — The Central Claim (full width, dawn-warm, epigraph) */}
      {claimText && (
        <ClaimCard text={claimText} />
      )}

      {/* Stanzas II + III — Anchor + Takeaway (half-width each, side-by-side) */}
      {(hasAnchor || hasTakeaway) && (
        <div
          className={`grid grid-cols-1 gap-5 ${hasAnchor && hasTakeaway ? "md:grid-cols-2" : "max-w-2xl mx-auto"}`}
          style={{ marginBottom: "24px" }}
        >
          {anchorText && <AnchorCard text={anchorText} />}
          {takeawayText && <TakeawayCard text={takeawayText} />}
        </div>
      )}

      {/* The Coda — wisdom line */}
      {coda && <CodaBlock text={coda} />}

      {/* Closing source attribution */}
      {primaryAnchor && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(156, 122, 47, 0.20)",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              flex: 1,
              height: "1px",
              background: `linear-gradient(to right, transparent, ${ACCENT_CLAIM}44 50%, transparent)`,
              maxWidth: "120px",
            }}
          />
          <p
            className="text-center"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "17px",
              color: "var(--gl-ink-primary)",
              lineHeight: 1.5,
              maxWidth: "620px",
              margin: 0,
            }}
          >
            <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--gl-ink-secondary)", fontStyle: "normal", marginRight: "8px", fontFamily: "var(--font-sans), system-ui, sans-serif", fontWeight: 700 }}>
              Anchored in
            </span>
            {primaryAnchor}
            {primaryNote && (
              <span style={{ opacity: 0.85, marginLeft: "6px" }}>
                — {primaryNote}
              </span>
            )}
          </p>
          <span
            aria-hidden="true"
            style={{
              flex: 1,
              height: "1px",
              background: `linear-gradient(to left, transparent, ${ACCENT_CLAIM}44 50%, transparent)`,
              maxWidth: "120px",
            }}
          />
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Stanza I — The Central Claim
 * Full-width dawn-warm epigraph. The keystone truth, set at display size.
 * ───────────────────────────────────────────────────────────────── */
function ClaimCard({ text }: { text: string }) {
  return (
    <article
      style={{
        position: "relative",
        background:
          "linear-gradient(180deg, rgba(252, 230, 184, 0.55) 0%, rgba(244, 199, 123, 0.32) 100%), url(/assets/learning/manuscript-grain.svg)",
        backgroundBlendMode: "multiply",
        border: `1px solid ${ACCENT_CLAIM}44`,
        borderRadius: "14px",
        padding: "36px 44px 30px",
        marginBottom: "20px",
        overflow: "hidden",
        boxShadow: `0 1px 0 rgba(255,255,255,0.65) inset, 0 -1px 0 ${ACCENT_CLAIM}22 inset, 0 8px 24px rgba(62, 42, 31, 0.07)`,
      }}
    >
      {/* Top filigree */}
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
        <span style={{ flex: 1, height: "1px", background: `linear-gradient(to right, transparent, ${ACCENT_CLAIM}66 50%, transparent)` }} />
        <svg width="26" height="10" viewBox="0 0 26 10" role="presentation">
          <g fill={ACCENT_CLAIM}>
            <path d="M 2 5 L 5 2 L 8 5 L 5 8 Z" opacity="0.5" />
            <circle cx="13" cy="5" r="2" />
            <circle cx="13" cy="5" r="0.8" fill="#FFF9F0" />
            <path d="M 18 5 L 21 2 L 24 5 L 21 8 Z" opacity="0.5" />
          </g>
        </svg>
        <span style={{ flex: 1, height: "1px", background: `linear-gradient(to left, transparent, ${ACCENT_CLAIM}66 50%, transparent)` }} />
      </div>

      <SummaryCornerOrnament accent={ACCENT_CLAIM} corner="tl" />
      <SummaryCornerOrnament accent={ACCENT_CLAIM} corner="tr" />
      <SummaryCornerOrnament accent={ACCENT_CLAIM} corner="bl" />
      <SummaryCornerOrnament accent={ACCENT_CLAIM} corner="br" />

      <div style={{ marginTop: "12px", textAlign: "center" }}>
        <p
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: ACCENT_CLAIM,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "20px",
              letterSpacing: 0,
              textTransform: "none",
              opacity: 0.78,
            }}
          >
            I
          </span>
          <span>The central claim</span>
        </p>
      </div>

      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "22px",
          fontWeight: 500,
          color: "var(--gl-ink-primary)",
          lineHeight: 1.5,
          textAlign: "center",
          maxWidth: "680px",
          margin: "0 auto",
          letterSpacing: "0.003em",
        }}
      >
        {renderInline(text)}
      </p>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Stanza II — The Classical Anchor
 * Half-width manuscript-cream parchment. Reads as a citation card.
 * ───────────────────────────────────────────────────────────────── */
function AnchorCard({ text }: { text: string }) {
  return (
    <article
      className="gl-surface-manuscript"
      style={{
        position: "relative",
        padding: "24px 28px 22px",
        borderTop: `2px solid ${ACCENT_ANCHOR}55`,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: `${ACCENT_ANCHOR}12`,
            border: `1px solid ${ACCENT_ANCHOR}55`,
            flexShrink: 0,
          }}
        >
          <BookOpen size={12} style={{ color: ACCENT_ANCHOR }} />
        </span>
        <span
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "18px",
            color: ACCENT_ANCHOR,
            opacity: 0.78,
            letterSpacing: 0,
          }}
        >
          II
        </span>
        <span
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.20em",
            color: ACCENT_ANCHOR,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          The classical anchor
        </span>
      </header>

      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "18px",
          lineHeight: 1.75,
          color: "var(--gl-ink-on-cream-primary)",
          flex: 1,
          margin: 0,
        }}
      >
        {renderInline(text)}
      </p>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Stanza III — The Takeaway
 * Half-width twilight-glass. Slightly more grounded — operational.
 * ───────────────────────────────────────────────────────────────── */
function TakeawayCard({ text }: { text: string }) {
  return (
    <article
      className="gl-surface-twilight-glass"
      style={{
        position: "relative",
        padding: "24px 28px 22px",
        borderTop: `2px solid ${ACCENT_TAKEAWAY}55`,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: `${ACCENT_TAKEAWAY}12`,
            border: `1px solid ${ACCENT_TAKEAWAY}55`,
            flexShrink: 0,
          }}
        >
          <ArrowRight size={12} style={{ color: ACCENT_TAKEAWAY }} />
        </span>
        <span
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "18px",
            color: ACCENT_TAKEAWAY,
            opacity: 0.78,
            letterSpacing: 0,
          }}
        >
          III
        </span>
        <span
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.20em",
            color: ACCENT_TAKEAWAY,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          The takeaway
        </span>
      </header>

      <p
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "16px",
          lineHeight: 1.7,
          color: "var(--gl-ink-primary)",
          flex: 1,
          margin: 0,
        }}
      >
        {renderInline(text)}
      </p>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * The Coda — wisdom line at the bottom.
 * Quiet italic prose with a small leaf ornament. The "and watch out
 * for…" closing remark that ties it all together.
 * ───────────────────────────────────────────────────────────────── */
function CodaBlock({ text }: { text: string }) {
  return (
    <div
      style={{
        position: "relative",
        padding: "20px 28px 18px 44px",
        background: "rgba(255, 252, 240, 0.55)",
        border: "1px solid rgba(156, 122, 47, 0.18)",
        borderRadius: "10px",
        marginTop: "8px",
      }}
    >
      {/* Leaf ornament at top-left, indented into the padding */}
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        style={{ position: "absolute", top: "22px", left: "20px" }}
      >
        <g fill={ACCENT_CLAIM} opacity="0.6">
          <path d="M 7 2 Q 11 5 7 12 Q 3 5 7 2 Z" />
          <circle cx="7" cy="7" r="1" fill="#FFF9F0" opacity="0.8" />
        </g>
      </svg>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "16px",
          lineHeight: 1.75,
          color: "var(--gl-ink-secondary)",
          margin: 0,
          whiteSpace: "pre-line",
        }}
      >
        {renderInline(text)}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Helpers
 * ───────────────────────────────────────────────────────────────── */

// Inline-markdown renderer moved to ../lib/inline-markdown (shared).

/** Gold-leaf arc ornament — quiet corner flourish. */
function SummaryCornerOrnament({
  accent,
  corner,
}: {
  accent: string;
  corner: "tl" | "tr" | "bl" | "br";
}) {
  const pos: React.CSSProperties = {
    position: "absolute",
    width: "28px",
    height: "28px",
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
    <svg aria-hidden="true" viewBox="0 0 28 28" style={pos}>
      <g fill="none" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.5">
        <path d="M 2 12 Q 2 2 12 2" />
        <circle cx="2" cy="2" r="0.9" fill={accent} stroke="none" opacity="0.7" />
      </g>
    </svg>
  );
}
