/**
 * Gold-leaf filigree divider — placed between sections.
 * Per design constitution v0.3 Reform-6 (section ornaments + transitions).
 *
 * Renders a centered three-part ornament:
 *   left gold-leaf rule · central diamond glyph · right gold-leaf rule
 *
 * Optional accent color lets each divider tint to the incoming section's hue.
 */

interface SectionDividerProps {
  /** Accent hue of the incoming section. Defaults to copper-gold. */
  accentHex?: string;
  /** Optional small text caption between the rules (rarely used). */
  caption?: string;
}

export function SectionDivider({ accentHex = "#9C7A2F", caption }: SectionDividerProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        margin: "18px auto 10px",
        maxWidth: "720px",
        opacity: 0.85,
      }}
    >
      {/* Left filigree rule */}
      <span
        style={{
          flex: 1,
          height: "1px",
          background: `linear-gradient(to right, transparent 0%, ${accentHex}55 30%, ${accentHex}AA 80%, ${accentHex} 100%)`,
        }}
      />
      {/* Central ornament — diamond + dot */}
      <svg width="36" height="14" viewBox="0 0 36 14" role="presentation">
        <g fill={accentHex}>
          {/* Left diamond */}
          <path d="M 2 7 L 6 4 L 10 7 L 6 10 Z" opacity="0.55" />
          {/* Center seal */}
          <circle cx="18" cy="7" r="3" />
          <circle cx="18" cy="7" r="1.5" fill="#FFF9F0" />
          {/* Right diamond */}
          <path d="M 26 7 L 30 4 L 34 7 L 30 10 Z" opacity="0.55" />
        </g>
      </svg>
      {/* Right filigree rule */}
      <span
        style={{
          flex: 1,
          height: "1px",
          background: `linear-gradient(to left, transparent 0%, ${accentHex}55 30%, ${accentHex}AA 80%, ${accentHex} 100%)`,
        }}
      />
      {caption && (
        <span
          style={{
            position: "absolute",
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "12px",
            color: accentHex,
            opacity: 0.7,
            background: "var(--gl-night-deep)",
            padding: "0 12px",
          }}
        >
          {caption}
        </span>
      )}
    </div>
  );
}
