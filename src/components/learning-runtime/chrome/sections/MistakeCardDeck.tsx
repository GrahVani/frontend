/**
 * §8 Mistake Card Deck — flippable callout cards.
 * Per design constitution §11.1: each mistake has three faces:
 *  - front: the mistake stated
 *  - flip 1: why it happens (the cognitive trap)
 *  - flip 2: how to avoid
 *
 * The lesson markdown encodes mistakes as `> ⚠️ **Common mistake #N:**` blockquotes
 * with sub-fields `**What happens:**`, `**Why it happens:**`, `**How to avoid:**`.
 * This parser is lenient about heading wording.
 */

"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { SectionHeader } from "../SectionHeader";
import { presentationFor } from "../../lib/section-meta";
import { renderInline } from "../lib/inline-markdown";
import type { LessonSection } from "@/lib/learning-runtime/types";

interface ParsedMistake {
  title: string;
  what?: string;
  why?: string;
  fix?: string;
  raw: string;
}

/** Parse one or more mistake entries from §8's markdown body. */
function parseMistakes(markdown: string): ParsedMistake[] {
  const entries: ParsedMistake[] = [];
  // Split on horizontal rules or on each `> ⚠️ **Common mistake #N:**` heading start
  const blocks = markdown.split(/(?=>\s*⚠️\s*\*\*Common mistake)/g).filter((b) => b.trim().length > 0);
  for (const block of blocks) {
    const titleMatch = block.match(/⚠️\s*\*\*Common mistake[^*]*:\s*([^*\n]+)\*\*/i);
    const whatMatch = block.match(/\*\*What happens:\*\*\s*([\s\S]+?)(?=\n>\s*\*\*Why|\n>\s*\*\*How|\n\n|$)/i);
    const whyMatch = block.match(/\*\*Why it happens:\*\*\s*([\s\S]+?)(?=\n>\s*\*\*How|\n\n|$)/i);
    const fixMatch = block.match(/\*\*How to avoid:\*\*\s*([\s\S]+?)(?=\n\n|$)/i);

    if (titleMatch || whatMatch) {
      entries.push({
        title: titleMatch ? titleMatch[1].trim() : "Common mistake",
        what: whatMatch ? whatMatch[1].replace(/^>\s?/gm, "").trim() : undefined,
        why: whyMatch ? whyMatch[1].replace(/^>\s?/gm, "").trim() : undefined,
        fix: fixMatch ? fixMatch[1].replace(/^>\s?/gm, "").trim() : undefined,
        raw: block.trim(),
      });
    }
  }
  return entries;
}

interface MistakeCardDeckProps {
  section: LessonSection;
}

const FACES = ["what", "why", "fix"] as const;
type Face = typeof FACES[number];

const FACE_LABELS: Record<Face, string> = {
  what: "What happens",
  why: "Why it happens",
  fix: "How to avoid",
};

const VERMILION = "#C8412E";

function MistakeCard({ mistake, index }: { mistake: ParsedMistake; index: number }) {
  const [face, setFace] = useState<Face>("what");
  const currentText = mistake[face];

  const cycleFace = () => {
    const curIdx = FACES.indexOf(face);
    setFace(FACES[(curIdx + 1) % FACES.length]);
  };

  const trapLabel = toRoman(index + 1);
  const footerHint =
    face === "what"
      ? "see why this happens"
      : face === "why"
        ? "see how to avoid it"
        : "return to the trap";

  return (
    <article
      className="gl-surface-twilight-glass cursor-pointer transition-all"
      style={{
        padding: "24px 26px 20px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(156, 122, 47, 0.22)",
        background:
          "linear-gradient(180deg, rgba(255, 252, 240, 0.97) 0%, rgba(200, 65, 46, 0.045) 100%), url(/assets/learning/manuscript-grain.svg)",
        backgroundBlendMode: "multiply",
        transition: "transform 250ms cubic-bezier(0.32, 0.72, 0.24, 1), box-shadow 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
      }}
      onClick={cycleFace}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cycleFace();
        }
      }}
      aria-label={`Trap ${index + 1}: ${mistake.title}. Click to cycle through what happens, why, and how to avoid.`}
    >
      {/* Top vermilion hairline ribbon — quieter than a 4px left bar */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "8%",
          right: "8%",
          height: "2px",
          background: `linear-gradient(to right, transparent, ${VERMILION}, transparent)`,
          borderRadius: "999px",
        }}
      />

      {/* Trap label row — Roman numeral + ornament + label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        <AlertTriangle size={15} style={{ color: VERMILION, flexShrink: 0 }} aria-hidden="true" />
        <span
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.20em",
            color: VERMILION,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          Trap {trapLabel}
        </span>
        <span
          aria-hidden="true"
          style={{
            flex: 1,
            height: "1px",
            background: `linear-gradient(to right, ${VERMILION}33, transparent)`,
          }}
        />
      </div>

      <h3
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "22px",
          fontWeight: 500,
          color: "var(--gl-ink-primary)",
          lineHeight: 1.3,
          margin: 0,
          marginBottom: "16px",
        }}
      >
        {renderInline(mistake.title)}
      </h3>

      {/* Face tabs — refined segmented control */}
      <div
        role="tablist"
        aria-label="Trap perspective"
        style={{
          display: "inline-flex",
          gap: "0",
          marginBottom: "14px",
          background: "rgba(255, 249, 234, 0.55)",
          border: "1px solid rgba(156, 122, 47, 0.22)",
          borderRadius: "999px",
          padding: "3px",
          alignSelf: "flex-start",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {FACES.map((f) => (
          <button
            key={f}
            role="tab"
            type="button"
            aria-selected={f === face}
            onClick={(e) => {
              e.stopPropagation();
              setFace(f);
            }}
            className="gl-clickable"
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              padding: "6px 13px",
              borderRadius: "999px",
              background: f === face ? "var(--gl-gold-accent)" : "transparent",
              color: f === face ? "#1A1408" : "var(--gl-ink-secondary)",
              border: "none",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontWeight: f === face ? 700 : 500,
              cursor: "pointer",
              transition: "all 150ms cubic-bezier(0.32, 0.72, 0.24, 1)",
              boxShadow: f === face ? "0 1px 3px rgba(168, 130, 30, 0.25)" : "none",
            }}
          >
            {FACE_LABELS[f]}
          </button>
        ))}
      </div>

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
        {currentText ? renderInline(currentText) : <em style={{ color: "var(--gl-ink-muted)" }}>(not provided in lesson)</em>}
      </p>

      {/* Footer hint — chevron + italic */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "14px",
          paddingTop: "10px",
          borderTop: "1px dashed rgba(156, 122, 47, 0.22)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            color: VERMILION,
            fontSize: "14px",
            lineHeight: 1,
          }}
        >
          →
        </span>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "14px",
            color: "var(--gl-ink-secondary)",
            margin: 0,
          }}
        >
          {footerHint}
        </p>
      </div>
    </article>
  );
}

/** Roman numeral 1-12. */
function toRoman(n: number): string {
  const map = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  return map[n] ?? String(n);
}

export function MistakeCardDeck({ section }: MistakeCardDeckProps) {
  const mistakes = parseMistakes(section.body);

  return (
    <section
      id={`sec-${section.number}`}
      aria-labelledby={`sec-${section.number}-h`}
      className="mx-auto py-5"
      style={{ maxWidth: "960px", scrollMarginTop: "120px" }}
    >
      <div className="text-center mb-6">
        {(() => {
          const pres = presentationFor(section);
          return (
            <SectionHeader
              eyebrow={pres.eyebrow}
              title={pres.embodiedTitle}
              accentHex={pres.accentHex}
              ornament={<AlertTriangle size={16} />}
              align="center"
              size="compact"
            />
          );
        })()}
        <p
          className="mt-3 text-sm italic"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-muted)",
            maxWidth: "560px",
            margin: "12px auto 0",
            lineHeight: 1.5,
          }}
        >
          Click each card to cycle through: what happens · why it happens · how to avoid.
        </p>
      </div>

      {mistakes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mistakes.map((m, i) => (
            <MistakeCard key={i} mistake={m} index={i} />
          ))}
        </div>
      ) : (
        <div className="gl-surface-twilight-glass p-6">
          <p style={{ color: "var(--gl-ink-muted)", fontStyle: "italic" }}>
            No structured mistake entries detected; rendering raw §8 markdown.
          </p>
          <pre style={{ marginTop: "12px", fontSize: "14px", color: "var(--gl-ink-secondary)", whiteSpace: "pre-wrap" }}>
            {section.body}
          </pre>
        </div>
      )}
    </section>
  );
}
