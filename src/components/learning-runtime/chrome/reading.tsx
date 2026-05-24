/**
 * Grahvani Learning — Reading-surface primitives.
 * Mirrors §11.4 of frontend/docs/learning-module/00-design-constitution.md (v0.2).
 *
 * - <Citation>           one citation in academic register
 * - <Bibliography>       a list of citations in scholarly hanging-indent
 * - <ReflectionPrompt>   "what do you notice?" component per §9.3
 */

"use client";

import { useState, type ReactNode } from "react";
import { Eye } from "lucide-react";
import { renderInline } from "./lib/inline-markdown";

interface CitationProps {
  /** The citation reference — title, source, etc. */
  reference: string;
  /** Optional supplementary note. */
  note?: string;
  /** Whether the citation is a classical primary source (renders slightly different). */
  isPrimary?: boolean;
}

const PRIMARY_ACCENT = "#9C7A2F"; // classical gold
const MODERN_ACCENT = "#3A4B7C";  // scholarly indigo

export function Citation({ reference, note, isPrimary = false }: CitationProps) {
  // Standalone citation (used inside MCQ ExplanationCard). Bibliography uses its own row layout below.
  const accent = isPrimary ? PRIMARY_ACCENT : MODERN_ACCENT;
  return (
    <li
      style={{
        display: "grid",
        gridTemplateColumns: "8px 1fr",
        gap: "12px",
        alignItems: "baseline",
        padding: "8px 0",
        borderBottom: "1px dashed rgba(156, 122, 47, 0.18)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: accent,
          opacity: 0.7,
          marginTop: "8px",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "16px",
          lineHeight: 1.6,
          color: "var(--gl-ink-primary)",
        }}
      >
        <em
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            color: accent,
            fontWeight: 500,
            fontSize: "17px",
          }}
        >
          {reference}
        </em>
        {note && (
          <span style={{ color: "var(--gl-ink-secondary)" }}> — {note}</span>
        )}
      </span>
    </li>
  );
}

interface BibliographyProps {
  primary?: Array<{ ref: string; note?: string }>;
  modern?: Array<{ ref: string; note?: string }>;
  further?: Array<{ ref: string; note?: string }>;
  /** Optional heading override. */
  heading?: string;
}

export function Bibliography({ primary = [], modern = [], further = [], heading }: BibliographyProps) {
  return (
    <section style={{ marginTop: "20px" }} aria-label="Sources and further reading">
      {heading && (
        <h3
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 500,
            fontSize: "22px",
            color: "var(--gl-ink-primary)",
            marginBottom: "16px",
          }}
        >
          {heading}
        </h3>
      )}

      {primary.length > 0 && (
        <BibliographyGroup
          label="Primary classical sources"
          accent={PRIMARY_ACCENT}
          surface="manuscript"
          items={primary}
        />
      )}

      {modern.length > 0 && (
        <BibliographyGroup
          label="Modern translations & commentaries"
          accent={MODERN_ACCENT}
          surface="twilight"
          items={modern}
        />
      )}

      {further.length > 0 && (
        <BibliographyGroup
          label="Going deeper (optional)"
          accent={MODERN_ACCENT}
          surface="twilight"
          items={further}
        />
      )}
    </section>
  );
}

/**
 * A bibliography group — distinctive header + a panel of source rows. Primary
 * sources use the manuscript-cream surface (echoing the Pāṇinīya Śikṣā card);
 * modern sources use twilight-glass (matches the rest of the chrome).
 */
function BibliographyGroup({
  label,
  accent,
  surface,
  items,
}: {
  label: string;
  accent: string;
  surface: "manuscript" | "twilight";
  items: Array<{ ref: string; note?: string }>;
}) {
  const surfaceClass = surface === "manuscript" ? "gl-surface-manuscript" : "gl-surface-twilight-glass";
  const inkPrimary = surface === "manuscript" ? "var(--gl-ink-on-cream-primary)" : "var(--gl-ink-primary)";
  const inkSecondary = surface === "manuscript" ? "var(--gl-ink-on-cream-secondary)" : "var(--gl-ink-secondary)";

  return (
    <article
      className={surfaceClass}
      style={{
        padding: "20px 24px 18px",
        borderTop: `2px solid ${accent}55`,
        borderRadius: "12px",
        marginBottom: "20px",
        position: "relative",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "14px",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: `${accent}14`,
            border: `1px solid ${accent}55`,
            flexShrink: 0,
          }}
        >
          {surface === "manuscript" ? (
            <ScrollIcon color={accent} />
          ) : (
            <BookIcon color={accent} />
          )}
        </span>
        <span
          style={{
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: accent,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          style={{
            flex: 1,
            height: "1px",
            background: `linear-gradient(to right, ${accent}44, transparent)`,
          }}
        />
        <span
          style={{
            fontSize: "14px",
            color: inkSecondary,
            opacity: 0.7,
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
          }}
        >
          {items.length} {items.length === 1 ? "source" : "sources"}
        </span>
      </header>

      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((c, i) => (
          <li
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr",
              gap: "14px",
              alignItems: "baseline",
              padding: "12px 0",
              borderBottom:
                i < items.length - 1
                  ? `1px dashed ${accent}22`
                  : "none",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "16px",
                color: accent,
                opacity: 0.65,
                textAlign: "right",
                lineHeight: 1.4,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  fontSize: "18px",
                  fontWeight: 500,
                  color: accent,
                  lineHeight: 1.4,
                  margin: 0,
                  marginBottom: c.note ? "4px" : 0,
                }}
              >
                {c.ref}
              </p>
              {c.note && (
                <p
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "16px",
                    lineHeight: 1.6,
                    color: inkPrimary,
                    margin: 0,
                  }}
                >
                  {c.note}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

function ScrollIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M 2.5 2 H 9.5 V 10 H 2.5 Z M 4 4 H 8 M 4 6 H 8 M 4 8 H 7"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BookIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M 2 2.5 Q 2 1.5 3 1.5 H 9 Q 10 1.5 10 2.5 V 9.5 Q 10 10.5 9 10.5 H 3 Q 2 10.5 2 9.5 Z M 6 1.5 V 10.5"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ReflectionPromptProps {
  /** Specific observation prompts (2-3) — never generic "what do you see?". */
  prompts: string[];
  /** Storage key for persisting the learner's reflection. */
  storageKey: string;
  /** Optional heading override. */
  heading?: string;
  /** Callback fired when learner submits or skips. */
  onContinue?: (text: string | null) => void;
}

/** §9.3 — "Things I see" reflection prompt.
 *
 * Redesigned 2026-05-22 as a centered scholar's-notebook composition:
 * eyebrow + ornament + heading, numbered checklist of observation questions,
 * a manuscript-paper textarea, and a quiet continue button. The whole panel
 * now reads as marginalia-meets-journal, not a form. */
export function ReflectionPrompt({
  prompts,
  storageKey: _storageKey,
  heading = "What do you notice?",
  onContinue,
}: ReflectionPromptProps) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleContinue = () => {
    setSubmitted(true);
    onContinue?.(text.trim() || null);
  };

  return (
    <div
      className="my-4 gl-surface-twilight-glass"
      style={{
        maxWidth: "720px",
        margin: "16px auto",
        padding: "26px 32px 22px",
        borderLeft: "3px solid var(--gl-gold-accent)",
        position: "relative",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "18px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "6px",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              flex: "0 0 24px",
              height: "1px",
              background: "linear-gradient(to right, transparent, var(--gl-gold-accent))",
            }}
          />
          <Eye size={13} style={{ color: "var(--gl-gold-accent)" }} aria-hidden="true" />
          <span
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.20em",
              color: "var(--gl-gold-accent)",
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
            }}
          >
            Reflect
          </span>
          <Eye size={13} style={{ color: "var(--gl-gold-accent)", transform: "scaleX(-1)" }} aria-hidden="true" />
          <span
            aria-hidden="true"
            style={{
              flex: "0 0 24px",
              height: "1px",
              background: "linear-gradient(to left, transparent, var(--gl-gold-accent))",
            }}
          />
        </div>
        <h4
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "24px",
            color: "var(--gl-ink-primary)",
            lineHeight: 1.2,
          }}
        >
          {heading}
        </h4>
      </header>

      <ol style={{ listStyle: "none", padding: 0, margin: "0 0 18px 0" }}>
        {prompts.map((prompt, i) => (
          <li
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr",
              gap: "12px",
              alignItems: "baseline",
              padding: "8px 0",
              borderBottom:
                i < prompts.length - 1
                  ? "1px solid rgba(156, 122, 47, 0.14)"
                  : "none",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "20px",
                color: "var(--gl-gold-accent)",
                lineHeight: 1,
                textAlign: "right",
                opacity: 0.82,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.65,
                color: "var(--gl-ink-primary)",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
              }}
            >
              {renderInline(prompt)}
            </p>
          </li>
        ))}
      </ol>

      {/* Scholar's notebook — textarea styled as manuscript paper */}
      <div
        style={{
          position: "relative",
          marginBottom: "14px",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-7px",
            left: "12px",
            background: "var(--gl-night-top, #FAF1DD)",
            padding: "0 8px",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--gl-ink-muted)",
            fontWeight: 600,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          Your notes
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitted}
          placeholder="In your own words — what stayed with you?"
          rows={3}
          className="gl-focus-ring"
          style={{
            width: "100%",
            background:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 27px, rgba(156, 122, 47, 0.10) 28px, transparent 29px), rgba(255, 252, 240, 0.55)",
            border: "1px solid rgba(156, 122, 47, 0.30)",
            borderRadius: "8px",
            padding: "12px 14px",
            color: "var(--gl-ink-primary)",
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "16px",
            lineHeight: 1.5, // P2-7: relative line-height scales with font-size
            resize: "vertical",
            boxShadow: "inset 0 1px 3px rgba(62, 42, 31, 0.06)",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", alignItems: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "14px",
            color: "var(--gl-ink-muted)",
          }}
        >
          {submitted ? "Reflection saved." : "Notes are private to you."}
        </p>
        <button
          onClick={handleContinue}
          disabled={submitted}
          className="gl-clickable"
          style={{
            background: submitted ? "var(--gl-gold-accent)" : "transparent",
            color: submitted ? "#1A1408" : "var(--gl-gold-accent)",
            border: "1px solid var(--gl-gold-accent)",
            borderRadius: "999px",
            padding: "8px 22px",
            fontSize: "14px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontWeight: 600,
            letterSpacing: "0.06em",
            cursor: submitted ? "default" : "pointer",
            transition: "all 150ms cubic-bezier(0.32, 0.72, 0.24, 1)",
          }}
        >
          {submitted ? "Continued" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
