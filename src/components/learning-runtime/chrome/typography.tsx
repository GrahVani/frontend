/**
 * Grahvani Learning — Typography primitives.
 * Mirrors §3 + §11.3 of frontend/docs/learning-module/00-design-constitution.md (v0.2).
 *
 * - <Devanagari>     Tiro Devanagari Hindi
 * - <IAST>           Cormorant Garamond italic
 * - <Sloka>          composes Devanāgarī + IAST + English trilingual block
 * - <DropCap>        first-letter ornament for §1 hooks
 * - <TermTooltip>    Sanskrit terms; reveals gloss on tap/hover
 */

import { type ReactNode, type CSSProperties } from "react";

interface DevanagariProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  surface?: "dark" | "cream";
  className?: string;
  style?: CSSProperties;
  asElement?: "p" | "span" | "div" | "h1" | "h2" | "h3";
}

const DEVANAGARI_SIZES = {
  sm: "20px",
  md: "28px",
  lg: "40px",
  xl: "56px",
} as const;

export function Devanagari({
  children,
  size = "md",
  surface = "dark",
  className = "",
  style,
  asElement: As = "span",
}: DevanagariProps) {
  return (
    <As
      lang="sa"
      className={className}
      style={{
        fontFamily: "var(--font-devanagari), serif",
        fontSize: DEVANAGARI_SIZES[size],
        lineHeight: 1.5,
        color: surface === "cream" ? "var(--gl-ink-on-cream-primary)" : "var(--gl-ink-primary)",
        ...style,
      }}
    >
      {children}
    </As>
  );
}

interface IASTProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  surface?: "dark" | "cream";
  className?: string;
  style?: CSSProperties;
  asElement?: "p" | "span" | "em" | "h2" | "h3";
}

const IAST_SIZES = {
  sm: "16px",
  md: "20px",
  lg: "24px",
} as const;

export function IAST({
  children,
  size = "md",
  surface = "dark",
  className = "",
  style,
  asElement: As = "em",
}: IASTProps) {
  return (
    <As
      lang="sa-Latn"
      className={className}
      style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: IAST_SIZES[size],
        lineHeight: 1.5,
        color: surface === "cream" ? "var(--gl-ink-on-cream-secondary)" : "var(--gl-ink-primary)",
        ...style,
      }}
    >
      {children}
    </As>
  );
}

interface SlokaProps {
  /** The śloka in Devanāgarī. Line breaks should be encoded as `\n` or rendered with <br/>. */
  devanagari: string;
  /** Romanised IAST transliteration. Lines correspond 1:1 with devanagari. */
  iast: string;
  /** English translation. */
  english: string;
  /** Attribution — e.g., "Pāṇinīya Śikṣā 41-42". */
  source?: string;
  /** Translator credit — e.g., "Translation: Santhanam (1996), p. 1024". */
  translator?: string;
  /** Optional author commentary (≤ 80 words per curriculum standard). */
  commentary?: string;
}

/** §5 trilingual śloka block — renders on Manuscript Cream surface. */
export function Sloka({
  devanagari,
  iast,
  english,
  source,
  translator,
  commentary,
}: SlokaProps) {
  return (
    <figure className="gl-surface-manuscript my-6">
      {source && (
        <figcaption
          className="text-xs uppercase tracking-wider mb-3"
          style={{
            color: "var(--gl-ink-on-cream-muted)",
            letterSpacing: "0.08em",
          }}
        >
          {source}
        </figcaption>
      )}
      <Devanagari size="md" surface="cream" asElement="p" style={{ marginBottom: "12px", whiteSpace: "pre-line" }}>
        {devanagari}
      </Devanagari>
      <IAST size="md" surface="cream" asElement="p" style={{ marginBottom: "12px", whiteSpace: "pre-line", color: "var(--gl-ink-on-cream-secondary)" }}>
        {iast}
      </IAST>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "17px",
          lineHeight: 1.5,
          color: "var(--gl-ink-on-cream-primary)",
        }}
      >
        {english}
      </p>
      {translator && (
        <p
          className="mt-3 text-sm italic"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-on-cream-muted)",
          }}
        >
          {translator}
        </p>
      )}
      {commentary && (
        <p
          className="mt-4 pt-4 border-t text-base italic"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-on-cream-secondary)",
            borderColor: "rgba(168, 130, 30, 0.18)",
            lineHeight: 1.5,
          }}
        >
          {commentary}
        </p>
      )}
    </figure>
  );
}

interface DropCapProps {
  letter: string;
  className?: string;
}

/** Cormorant 72px gold drop-cap, hangs into the first line of paragraph. */
export function DropCap({ letter, className = "" }: DropCapProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-cormorant), serif",
        fontWeight: 600,
        fontSize: "72px",
        lineHeight: 0.85,
        color: "var(--gl-gold-accent)",
        float: "left",
        marginRight: "12px",
        marginTop: "6px",
        marginBottom: "-8px",
      }}
    >
      {letter}
    </span>
  );
}

interface TermTooltipProps {
  /** The Sanskrit term in IAST (or Devanāgarī). Displayed in italic Cormorant. */
  term: string;
  /** Short gloss, ≤ 12 words. Shown in the tooltip. */
  gloss: string;
  /** Optional fuller definition, surfaces on long-hover. */
  definition?: string;
}

/** Minimal TermTooltip — full hover/tap dance with audio comes in a later wave. */
export function TermTooltip({ term, gloss, definition }: TermTooltipProps) {
  const title = definition ? `${gloss} — ${definition}` : gloss;
  return (
    <em
      lang="sa-Latn"
      title={title}
      tabIndex={0}
      style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 500,
        borderBottom: "1px dotted var(--gl-gold-accent)",
        cursor: "help",
      }}
    >
      {term}
    </em>
  );
}
