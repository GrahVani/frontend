/**
 * Three-Traditions Wheel Diagram — bespoke SVG visual anchor for L3 §4.
 *
 * Replaces what would otherwise be a PNG painting. SVG is the right medium
 * here because the lesson's central pedagogy is a *geometric disambiguation*
 * — the ~24° drift between sidereal and tropical zodiac frames — and a
 * hand-built SVG renders the offset pixel-perfectly with crisp typography.
 * Constitution §32.4 rule 7's "bespoke conceptual image" is satisfied (an
 * SVG diagram IS a bespoke visual anchor); rule 7 doesn't mandate PNG.
 *
 * Composition (viewBox 520×520):
 *   - OUTER RING (Vedic sidereal, gold)   — most prominent, 12 rāśis with
 *                                            Devanāgarī labels, anchored at
 *                                            0° top with a star (Lahiri
 *                                            ayanāṁśa reference point)
 *   - MIDDLE RING (Western tropical,        — visibly smaller, ROTATED 24°
 *                  indigo)                   clockwise, 12 Latin signs,
 *                                            vernal equinox marker (sun-
 *                                            and-horizon glyph) at the
 *                                            rotated 0° position
 *   - INNER CIRCLE (Pop sun-sign, grey)    — smallest, plain dashed circle,
 *                                            12 Unicode zodiac symbols
 *                                            aligned with Western frame
 *                                            (pop inherits tropical frame),
 *                                            intentionally less ceremonial
 *   - CENTRE (radiant sun)                 — the single celestial anchor
 *                                            all three frames try to read
 *
 * Constitutional invariants:
 *   - No bright colours outside the chapter palette
 *   - Devanāgarī rendered in Tiro Devanagari (CSS variable)
 *   - Latin in Cormorant italic (CSS variable)
 *   - role="img" + aria-label for screen readers
 */

"use client";

const VIEWBOX = 520;
const CENTER = VIEWBOX / 2;

const VEDIC_OUTER = 240;
const VEDIC_INNER = 200;
const WESTERN_OUTER = 188;
const WESTERN_INNER = 152;
const POP_RADIUS = 108;

const WESTERN_ROTATION_DEG = 24;

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_HALO = "#C28220";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const VERMILION = "#A23A1E";
const POP_GREY = "#9B9080";
const POP_GREY_DEEP = "#6B6256";

const VEDIC_LABELS = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन",
];
const WESTERN_LABELS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];
const POP_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  // angleDeg: 0 = top, clockwise positive
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function TraditionsWheelDiagram() {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      style={{ width: "100%", maxWidth: "460px", height: "auto", display: "block", margin: "0 auto" }}
      role="img"
      aria-label="A celestial diagram showing three concentric zodiac wheels representing three astrology traditions. The outer gold ring is the Vedic sidereal zodiac, anchored at 0° by a Lahiri ayanāṁśa star marker. The middle indigo ring is the Western tropical zodiac, rotated 24° clockwise relative to the Vedic ring, with a vernal equinox marker at its rotated 0° position. The innermost circle is sun-sign popular astrology, with 12 zodiac symbols at simplified depth. All three are anchored to a central radiant sun."
    >
      <defs>
        <radialGradient id="gold-halo" cx="50%" cy="50%" r="50%">
          <stop offset="78%" stopColor={GOLD_HALO} stopOpacity="0" />
          <stop offset="88%" stopColor={GOLD_HALO} stopOpacity="0.32" />
          <stop offset="100%" stopColor={GOLD_HALO} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="indigo-halo" cx="50%" cy="50%" r="50%">
          <stop offset="78%" stopColor={INDIGO} stopOpacity="0" />
          <stop offset="88%" stopColor={INDIGO} stopOpacity="0.20" />
          <stop offset="100%" stopColor={INDIGO} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD_HALO} stopOpacity="1" />
          <stop offset="60%" stopColor={GOLD} stopOpacity="1" />
          <stop offset="100%" stopColor={GOLD_DEEP} stopOpacity="1" />
        </radialGradient>
      </defs>

      {/* ─── Gold halo (Vedic) — drawn first, behind everything ─── */}
      <circle cx={CENTER} cy={CENTER} r={VEDIC_OUTER + 22} fill="url(#gold-halo)" />

      {/* ─── VEDIC SIDEREAL — OUTER RING ─── */}
      <circle cx={CENTER} cy={CENTER} r={VEDIC_OUTER} fill="none" stroke={GOLD} strokeWidth="2.5" />
      <circle cx={CENTER} cy={CENTER} r={VEDIC_INNER} fill="none" stroke={GOLD} strokeWidth="1.5" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = i * 30;
        const inner = polar(CENTER, CENTER, VEDIC_INNER, angle);
        const outer = polar(CENTER, CENTER, VEDIC_OUTER, angle);
        return (
          <line
            key={`vedic-div-${i}`}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke={GOLD}
            strokeWidth="1.5"
          />
        );
      })}
      {/* Vedic ornamental flourishes at each divider boundary */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = i * 30;
        const r = (VEDIC_OUTER + VEDIC_INNER) / 2;
        const { x, y } = polar(CENTER, CENTER, VEDIC_OUTER + 2, angle);
        return (
          <circle
            key={`vedic-orn-${i}`}
            cx={x}
            cy={y}
            r="2.5"
            fill={GOLD_DEEP}
          />
        );
      })}
      {/* Devanāgarī rāśi labels at mid-segment */}
      {VEDIC_LABELS.map((label, i) => {
        const angle = i * 30 + 15;
        const labelR = (VEDIC_OUTER + VEDIC_INNER) / 2;
        const { x, y } = polar(CENTER, CENTER, labelR, angle);
        return (
          <text
            key={`vedic-label-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            lang="sa"
            style={{
              fontFamily: "var(--font-devanagari), serif",
              fontSize: "15px",
              fill: GOLD_DEEP,
              fontWeight: 400,
            }}
          >
            {label}
          </text>
        );
      })}
      {/* Lahiri ayanāṁśa marker — star at outer top (0°) */}
      <g transform={`translate(${CENTER}, ${CENTER - VEDIC_OUTER - 14})`}>
        <circle r="9" fill={GOLD} />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          y="1"
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontSize: "13px",
            fill: "#FFF6E6",
            fontWeight: 700,
          }}
        >
          ★
        </text>
      </g>
      <text
        x={CENTER}
        y={CENTER - VEDIC_OUTER - 30}
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "10px",
          fill: GOLD_DEEP,
        }}
      >
        Lahiri ayanāṁśa
      </text>

      {/* ─── Indigo halo (Western), inside the Vedic band ─── */}
      <circle cx={CENTER} cy={CENTER} r={WESTERN_OUTER + 16} fill="url(#indigo-halo)" />

      {/* ─── WESTERN TROPICAL — MIDDLE RING (rotated 24° clockwise) ─── */}
      <g transform={`rotate(${WESTERN_ROTATION_DEG}, ${CENTER}, ${CENTER})`}>
        <circle cx={CENTER} cy={CENTER} r={WESTERN_OUTER} fill="none" stroke={INDIGO} strokeWidth="2" />
        <circle cx={CENTER} cy={CENTER} r={WESTERN_INNER} fill="none" stroke={INDIGO} strokeWidth="1.25" />
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30;
          const inner = polar(CENTER, CENTER, WESTERN_INNER, angle);
          const outer = polar(CENTER, CENTER, WESTERN_OUTER, angle);
          return (
            <line
              key={`western-div-${i}`}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={INDIGO}
              strokeWidth="1.25"
            />
          );
        })}
        {WESTERN_LABELS.map((label, i) => {
          const angle = i * 30 + 15;
          const labelR = (WESTERN_OUTER + WESTERN_INNER) / 2;
          const { x, y } = polar(CENTER, CENTER, labelR, angle);
          // Counter-rotate the text so it stays upright regardless of ring rotation
          return (
            <text
              key={`western-label-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(${-WESTERN_ROTATION_DEG}, ${x}, ${y})`}
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "10.5px",
                fill: INDIGO_DEEP,
                fontWeight: 500,
              }}
            >
              {label}
            </text>
          );
        })}
      </g>
      {/* Vernal equinox marker — at the ROTATED top (24° from vertical) */}
      {(() => {
        const markerR = WESTERN_OUTER + 12;
        const { x, y } = polar(CENTER, CENTER, markerR, WESTERN_ROTATION_DEG);
        const { x: lx, y: ly } = polar(CENTER, CENTER, markerR + 14, WESTERN_ROTATION_DEG);
        return (
          <g>
            {/* Sun-and-horizon glyph */}
            <g transform={`translate(${x}, ${y})`}>
              <line x1="-8" y1="2" x2="8" y2="2" stroke={INDIGO} strokeWidth="1.5" strokeLinecap="round" />
              <path
                d="M -5 2 A 5 5 0 0 1 5 2"
                fill={INDIGO}
                opacity="0.85"
              />
            </g>
            {/* Caption */}
            <text
              x={lx}
              y={ly}
              textAnchor={WESTERN_ROTATION_DEG > 0 && WESTERN_ROTATION_DEG < 180 ? "start" : "middle"}
              dominantBaseline="central"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "10px",
                fill: INDIGO_DEEP,
              }}
            >
              Vernal equinox
            </text>
          </g>
        );
      })()}

      {/* ─── POP INNER CIRCLE — muted grey, flat, dashed boundary ─── */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={POP_RADIUS}
        fill="rgba(255, 251, 240, 0.55)"
        stroke={POP_GREY}
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.75"
      />
      {POP_SYMBOLS.map((sym, i) => {
        // Pop inherits the tropical frame — align with the Western rotation
        const angle = i * 30 + 15 + WESTERN_ROTATION_DEG;
        const { x, y } = polar(CENTER, CENTER, POP_RADIUS - 16, angle);
        return (
          <text
            key={`pop-sym-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "13px",
              fill: POP_GREY_DEEP,
              fontWeight: 400,
            }}
          >
            {sym}
          </text>
        );
      })}

      {/* ─── CENTRE — RADIANT SUN ─── */}
      <g transform={`translate(${CENTER}, ${CENTER})`}>
        {/* 12 vermilion rays */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30;
          const inner = polar(0, 0, 22, angle);
          const outer = polar(0, 0, 38, angle);
          return (
            <line
              key={`ray-${i}`}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={VERMILION}
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
        {/* Sun disc */}
        <circle r="20" fill="url(#sun-glow)" />
        <circle r="20" fill="none" stroke={GOLD_DEEP} strokeWidth="1" />
      </g>
    </svg>
  );
}
