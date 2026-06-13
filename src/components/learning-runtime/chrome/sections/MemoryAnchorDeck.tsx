/**
 * §9 Memory Anchor Deck — flippable principle cards.
 * Per design constitution §11.1: front shows the principle; flip reveals proof.
 *
 * The lesson markdown encodes anchors as `> 💡 **Remember:** …` blockquotes
 * OR as a single table with a "Remember-anchor" column. Parser handles both.
 */

"use client";

import { useState, type ReactNode, type Key } from "react";
import { Lightbulb } from "lucide-react";
import { SectionHeader } from "../SectionHeader";
import { presentationFor } from "../../lib/section-meta";
import type { LessonSection } from "@/lib/learning-runtime/types";
import { renderInline } from "../lib/inline-markdown";

interface ParsedAnchor {
  text: string;
}

function parseAnchors(markdown: string): ParsedAnchor[] {
  const entries: ParsedAnchor[] = [];

  // Pattern 1: > 💡 **Remember:** text OR > **Remember:** text (blockquote-style, with or without emoji)
  const bqMatches = Array.from(
    markdown.matchAll(/>\s*(?:💡\s*)?\*\*[^*]+:\*\*\s*([^\n]+(?:\n>\s*[^*\n][^\n]*)*)/g),
  );
  if (bqMatches.length > 0) {
    for (const m of bqMatches) {
      entries.push({ text: m[1].replace(/^>\s?/gm, "").trim() });
    }
    return entries;
  }

  // Pattern 2: table with Remember-anchor column.
  const tableMatch = markdown.match(/\|[^\n]*Remember[^\n]*\|\s*\n\|[-:\s|]+\|\s*\n([\s\S]+?)(?=\n\n|$)/i);
  if (tableMatch) {
    const rows = tableMatch[1].split("\n").filter((r) => r.trim().startsWith("|"));
    for (const row of rows) {
      const cells = row.split("|").map((c) => c.trim()).filter((c) => c.length > 0);
      if (cells.length > 0) {
        entries.push({ text: cells[cells.length - 1] });
      }
    }
    return entries;
  }

  return entries;
}

// Inline-markdown renderer moved to ../lib/inline-markdown (shared).

const SAFFRON = "#C28220"; // deeper saffron, better contrast on parchment
const ORDINAL_WORDS = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];

function AnchorCard({ anchor, index }: { anchor: ParsedAnchor; index: number }) {
  const ordinal = ORDINAL_WORDS[index + 1] ?? `${index + 1}`;

  return (
    <article
      style={{
        padding: "28px 32px 22px",
        position: "relative",
        background: "rgba(255, 252, 240, 0.85)",
        border: "1px solid rgba(156, 122, 47, 0.18)",
        borderRadius: "12px",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.65) inset, 0 6px 18px rgba(62, 42, 31, 0.05)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      aria-label={`Memory anchor ${index + 1}`}
    >
      {/* Ordinal — italic Cormorant in saffron, centered above body */}
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "18px",
          color: SAFFRON,
          letterSpacing: "0.06em",
          marginBottom: "12px",
          lineHeight: 1,
        }}
      >
        <span style={{ marginRight: "8px", opacity: 0.6 }}>·</span>
        {ordinal}
        <span style={{ marginLeft: "8px", opacity: 0.6 }}>·</span>
      </p>

      {/* Body — the anchor text. Inter for readability, with inline italic
          Cormorant spans only for emphasised terms. Larger size + generous
          line-height. Wider card means each line holds 50-70 chars — comfortable. */}
      <p
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "16px",
          lineHeight: 1.75,
          color: "var(--gl-ink-primary)",
          flex: 1,
          margin: 0,
          letterSpacing: "0.005em",
        }}
      >
        {renderInline(anchor.text)}
      </p>

      {/* Bottom ornament — quiet lotus-dot flourish, centered */}
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginTop: "18px",
          opacity: 0.5,
        }}
      >
        <span
          style={{
            flex: "0 0 40px",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${SAFFRON}88)`,
          }}
        />
        <svg width="8" height="8" viewBox="0 0 8 8" role="presentation">
          <circle cx="4" cy="4" r="2" fill={SAFFRON} />
          <circle cx="4" cy="4" r="0.7" fill="#FFF9F0" />
        </svg>
        <span
          style={{
            flex: "0 0 40px",
            height: "1px",
            background: `linear-gradient(to left, transparent, ${SAFFRON}88)`,
          }}
        />
      </div>
    </article>
  );
}

interface MemoryAnchorDeckProps {
  section: LessonSection;
}

export function MemoryAnchorDeck({ section }: MemoryAnchorDeckProps) {
  const anchors = parseAnchors(section.body);

  return (
    <section
      id={`sec-${section.number}`}
      aria-labelledby={`sec-${section.number}-h`}
      className="mx-auto py-5"
      style={{ maxWidth: "1080px", scrollMarginTop: "120px" }}
    >
      <div className="mb-6 text-center">
        {(() => {
          const pres = presentationFor(section);
          return (
            <SectionHeader
              eyebrow={pres.eyebrow}
              title={pres.embodiedTitle}
              accentHex={pres.accentHex}
              ornament={<Lightbulb size={16} />}
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
          These anchors enter your spaced-repetition deck after lesson mastery.
        </p>
      </div>

      {anchors.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {anchors.map((a, i) => (
            <div
              key={i}
              style={{
                flex: "1 1 380px",
                minWidth: "300px",
                maxWidth: "440px",
                display: "flex",
              }}
            >
              <AnchorCard anchor={a} index={i} />
            </div>
          ))}
        </div>
      ) : (
        <div className="gl-surface-twilight-glass p-6">
          <p style={{ color: "var(--gl-ink-muted)", fontStyle: "italic" }}>
            No structured anchor entries detected; rendering raw §9 markdown.
          </p>
          <pre style={{ marginTop: "12px", fontSize: "14px", color: "var(--gl-ink-secondary)", whiteSpace: "pre-wrap" }}>
            {section.body}
          </pre>
        </div>
      )}
    </section>
  );
}
