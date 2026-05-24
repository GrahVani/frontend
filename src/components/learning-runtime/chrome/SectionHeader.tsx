/**
 * Shared section-header chrome — eyebrow + embodied title.
 * Per design constitution v0.3 Reform-2 + Reform-7.
 *
 * Each section's eyebrow uses its graha accent hue.
 * Optional ornament glyph in the eyebrow row.
 */

import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  /** Accent hue (graha-derived) per Reform-2 — colors the eyebrow + ornament. */
  accentHex: string;
  /** Optional small ornament glyph rendered before the eyebrow. */
  ornament?: ReactNode;
  /** Alignment — defaults to left; some sections (śloka, simulator, practice) center. */
  align?: "left" | "center";
  /** Sanskrit title in Devanāgarī for sections that surface their classical source as the header. */
  titleDevanagari?: string;
  /** Smaller title size variant. */
  size?: "default" | "compact";
  /** Collapse the bottom margin — caller controls spacing instead. */
  tight?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  accentHex,
  ornament,
  align = "left",
  titleDevanagari,
  size = "default",
  tight = false,
}: SectionHeaderProps) {
  const titleSize = size === "compact" ? "26px" : "32px";

  return (
    <header
      className={tight ? "" : "mb-6"}
      style={{
        textAlign: align,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        {ornament && (
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "20px",
              height: "20px",
              color: accentHex,
            }}
          >
            {ornament}
          </span>
        )}
        <span
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: accentHex,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          {eyebrow}
        </span>
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "32px",
            height: "1px",
            background: `linear-gradient(to right, ${accentHex}, transparent)`,
            marginLeft: "4px",
          }}
        />
      </div>
      {titleDevanagari && (
        <p
          lang="sa"
          style={{
            fontFamily: "var(--font-devanagari), serif",
            fontSize: "22px",
            color: accentHex,
            marginBottom: "4px",
            lineHeight: 1.4,
          }}
        >
          {titleDevanagari}
        </p>
      )}
      <h2
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: titleSize,
          fontWeight: 500,
          color: "var(--gl-ink-primary)",
          lineHeight: 1.2,
          letterSpacing: "0.005em",
        }}
      >
        {title}
      </h2>
    </header>
  );
}
