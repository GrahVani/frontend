/**
 * Module Illustrations — 24 bespoke SVG illustrations, one per Tier 1 module.
 *
 * Each illustration is a multi-element custom SVG keyed to the module's
 * thematic content. Not abstract patterns; not cycling shapes. Each is its
 * own iconographic statement, drawn with multiple layered SVG elements,
 * gradients, and ornament details.
 *
 * Designed to render at 36-40px inside the bicameral module card. All
 * illustrations share a 36×36 viewbox so they composite consistently.
 */

import type { ReactNode } from "react";

interface IllustrationProps {
  accent: string;
  size?: number;
}

/* ── 1 · Introduction to Jyotiṣa — Lotus with layered petals ──────── */
function IconLotus({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <defs>
        <radialGradient id="lot-grad" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#FFFCF0" stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} />
        </radialGradient>
      </defs>
      {/* outer 8 petals (back layer) */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <ellipse key={a} cx="18" cy="6" rx="2.5" ry="7" fill={accent} opacity="0.55" transform={`rotate(${a} 18 18)`} />
      ))}
      {/* inner 5 petals */}
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="18" cy="9" rx="3" ry="6" fill={accent} transform={`rotate(${a} 18 18)`} />
      ))}
      {/* core */}
      <circle cx="18" cy="18" r="4.5" fill="url(#lot-grad)" />
      <circle cx="18" cy="18" r="1.8" fill="#FFFCF0" opacity="0.8" />
    </svg>
  );
}

/* ── 2 · Foundations of Time — Sundial ───────────────────────────── */
function IconSundial({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" fill="none" stroke={accent} strokeWidth="1.8" />
      <circle cx="18" cy="18" r="11" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.5" strokeDasharray="1 2" />
      {/* hour ticks */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => {
        const rad = (a * Math.PI) / 180;
        const x1 = 18 + Math.cos(rad) * 13;
        const y1 = 18 + Math.sin(rad) * 13;
        const x2 = 18 + Math.cos(rad) * 14.5;
        const y2 = 18 + Math.sin(rad) * 14.5;
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="1.2" />;
      })}
      {/* gnomon shadow */}
      <line x1="18" y1="18" x2="18" y2="7" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="18" x2="24" y2="22" stroke={accent} strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
      <circle cx="18" cy="18" r="2" fill={accent} />
    </svg>
  );
}

/* ── 3 · Pañcāṅga — Five-Petal Mandala ───────────────────────────── */
function IconPanchanga({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14.5" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.45" strokeDasharray="1 2" />
      {[0, 72, 144, 216, 288].map((a) => (
        <g key={a} transform={`rotate(${a} 18 18)`}>
          <path d="M 18 18 Q 14 8 18 4 Q 22 8 18 18 Z" fill={accent} opacity="0.85" />
          <circle cx="18" cy="6.5" r="1.6" fill="#FFFCF0" opacity="0.85" />
        </g>
      ))}
      <circle cx="18" cy="18" r="3.8" fill={accent} />
      <circle cx="18" cy="18" r="1.4" fill="#FFFCF0" opacity="0.85" />
    </svg>
  );
}

/* ── 4 · Rāśis — Zodiac Wheel ─────────────────────────────────────── */
function IconZodiac({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" fill="none" stroke={accent} strokeWidth="1.8" />
      <circle cx="18" cy="18" r="7" fill="none" stroke={accent} strokeWidth="0.9" opacity="0.55" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x1 = 18 + Math.cos(a) * 7;
        const y1 = 18 + Math.sin(a) * 7;
        const x2 = 18 + Math.cos(a) * 14;
        const y2 = 18 + Math.sin(a) * 14;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="1" />;
      })}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * 2 * Math.PI - Math.PI / 2 + Math.PI / 12;
        const x = 18 + Math.cos(a) * 10.5;
        const y = 18 + Math.sin(a) * 10.5;
        return <circle key={i} cx={x} cy={y} r="0.9" fill={accent} />;
      })}
      <circle cx="18" cy="18" r="2.2" fill={accent} />
    </svg>
  );
}

/* ── 5 · Grahas — Nine-Planet Diagram ─────────────────────────────── */
function IconGrahas({ accent, size = 36 }: IllustrationProps) {
  // North Indian 3x3 navagraha grid
  const positions = [
    [12, 12], [18, 12], [24, 12],
    [12, 18], [18, 18], [24, 18],
    [12, 24], [18, 24], [24, 24],
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <rect x="6" y="6" width="24" height="24" rx="3" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.55" />
      {positions.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 4 ? "2.5" : "1.8"} fill={accent} opacity={i === 4 ? 1 : 0.85} />
      ))}
      <circle cx="18" cy="18" r="1.1" fill="#FFFCF0" opacity="0.85" />
    </svg>
  );
}

/* ── 6 · Bhāvas — North Indian Chart Diamond ──────────────────────── */
function IconBhavas({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <rect x="4" y="4" width="28" height="28" fill="none" stroke={accent} strokeWidth="1.8" />
      <line x1="4" y1="4" x2="32" y2="32" stroke={accent} strokeWidth="1.4" />
      <line x1="32" y1="4" x2="4" y2="32" stroke={accent} strokeWidth="1.4" />
      <line x1="4" y1="18" x2="18" y2="4" stroke={accent} strokeWidth="0.9" opacity="0.65" />
      <line x1="18" y1="4" x2="32" y2="18" stroke={accent} strokeWidth="0.9" opacity="0.65" />
      <line x1="32" y1="18" x2="18" y2="32" stroke={accent} strokeWidth="0.9" opacity="0.65" />
      <line x1="18" y1="32" x2="4" y2="18" stroke={accent} strokeWidth="0.9" opacity="0.65" />
    </svg>
  );
}

/* ── 7 · Nakṣatras — Lunar Mansions ───────────────────────────────── */
function IconNakshatras({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      {/* crescent moon */}
      <path d="M 22 8 a 12 12 0 1 0 0 20 a 9 9 0 1 1 0 -20 Z" fill={accent} opacity="0.55" />
      {/* nakṣatra points around the moon */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * 2 * Math.PI - Math.PI / 2;
        const x = 18 + Math.cos(a) * 14;
        const y = 18 + Math.sin(a) * 14;
        return <circle key={i} cx={x} cy={y} r={i === 0 ? "1.6" : "1"} fill={accent} />;
      })}
      <path d="M 11 11 L 18 18 L 25 11 M 18 18 L 18 28 M 18 18 L 28 18 M 18 18 L 8 18" stroke={accent} strokeWidth="0.6" opacity="0.4" fill="none" />
    </svg>
  );
}

/* ── 8 · Aspects — Crossing Aspect Lines ──────────────────────────── */
function IconAspects({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="13.5" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.7" />
      {/* aspect anchor points */}
      <circle cx="6" cy="18" r="2.5" fill={accent} />
      <circle cx="30" cy="18" r="2.5" fill={accent} />
      <circle cx="18" cy="6" r="2.5" fill={accent} />
      <circle cx="18" cy="30" r="2.5" fill={accent} opacity="0.55" />
      {/* aspect lines */}
      <line x1="6" y1="18" x2="30" y2="18" stroke={accent} strokeWidth="1.4" strokeDasharray="2 2" />
      <line x1="18" y1="6" x2="18" y2="30" stroke={accent} strokeWidth="1.2" strokeDasharray="2 2" opacity="0.6" />
      <line x1="9" y1="9" x2="27" y2="27" stroke={accent} strokeWidth="0.9" strokeDasharray="1 3" opacity="0.5" />
    </svg>
  );
}

/* ── 9 · Divisional Charts — Subdivided Hexagon ───────────────────── */
function IconDivisional({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <polygon points="18,4 30,11 30,25 18,32 6,25 6,11" fill="none" stroke={accent} strokeWidth="1.6" />
      <polygon points="18,11 24,14.5 24,21.5 18,25 12,21.5 12,14.5" fill="none" stroke={accent} strokeWidth="1.1" opacity="0.6" />
      <line x1="18" y1="4" x2="18" y2="32" stroke={accent} strokeWidth="0.8" opacity="0.45" />
      <line x1="6" y1="11" x2="30" y2="25" stroke={accent} strokeWidth="0.8" opacity="0.45" />
      <line x1="30" y1="11" x2="6" y2="25" stroke={accent} strokeWidth="0.8" opacity="0.45" />
      <circle cx="18" cy="18" r="2" fill={accent} />
    </svg>
  );
}

/* ── 10 · Daśā Systems — Cycle Wheel ───────────────────────────── */
function IconDasha({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="12.5" fill="none" stroke={accent} strokeWidth="1.4" strokeDasharray="3 2" />
      <circle cx="18" cy="18" r="7" fill="none" stroke={accent} strokeWidth="1.1" opacity="0.65" />
      <path d="M 26 10 L 30 14 L 26 18" stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10 26 L 6 22 L 10 18" stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx="18" cy="18" r="2.5" fill={accent} />
    </svg>
  );
}

/* ── 11 · Transits — Planet in Motion ─────────────────────────────── */
function IconTransits({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <ellipse cx="18" cy="18" rx="13" ry="6" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="2 3" opacity="0.55" transform="rotate(-15 18 18)" />
      <ellipse cx="18" cy="18" rx="13" ry="6" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="2 3" opacity="0.55" transform="rotate(45 18 18)" />
      {/* moving planet trail */}
      <circle cx="9" cy="14" r="1.2" fill={accent} opacity="0.3" />
      <circle cx="13" cy="13" r="1.6" fill={accent} opacity="0.55" />
      <circle cx="17" cy="13" r="2" fill={accent} opacity="0.8" />
      <circle cx="22" cy="14" r="2.8" fill={accent} />
      <circle cx="22" cy="14" r="1.2" fill="#FFFCF0" opacity="0.85" />
      <circle cx="18" cy="18" r="2" fill={accent} opacity="0.45" />
    </svg>
  );
}

/* ── 12 · Aṣṭakavarga — 8x8 Matrix ────────────────────────────────── */
function IconAshtaka({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <rect x="5" y="5" width="26" height="26" fill="none" stroke={accent} strokeWidth="1.4" />
      {[10, 15, 20, 25].map((p) => (
        <g key={p}>
          <line x1={p} y1="5" x2={p} y2="31" stroke={accent} strokeWidth="0.6" opacity="0.5" />
          <line x1="5" y1={p} x2="31" y2={p} stroke={accent} strokeWidth="0.6" opacity="0.5" />
        </g>
      ))}
      {/* highlight cells */}
      {[[12.5, 12.5], [17.5, 17.5], [22.5, 12.5], [12.5, 22.5], [22.5, 22.5]].map(([x, y], i) => (
        <rect key={i} x={x - 2} y={y - 2} width="4" height="4" fill={accent} opacity="0.85" rx="0.5" />
      ))}
    </svg>
  );
}

/* ── 13 · Strengths — Six-Rayed Compass ───────────────────────────── */
function IconStrengths({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a} transform={`rotate(${a} 18 18)`}>
          <path d="M 18 18 L 16.5 6 L 18 4 L 19.5 6 Z" fill={accent} />
          <path d="M 18 18 L 16.5 6 L 19.5 6 Z" fill={accent} opacity="0.6" />
        </g>
      ))}
      <circle cx="18" cy="18" r="3.5" fill={accent} />
      <circle cx="18" cy="18" r="1.4" fill="#FFFCF0" opacity="0.85" />
    </svg>
  );
}

/* ── 14 · Yogas & Doṣas — Conjoined Orbs ──────────────────────────── */
function IconYogas({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <circle cx="13" cy="18" r="9" fill="none" stroke={accent} strokeWidth="1.6" />
      <circle cx="23" cy="18" r="9" fill="none" stroke={accent} strokeWidth="1.6" />
      <path d="M 13 9 a 9 9 0 0 1 0 18 a 9 9 0 0 1 0 -18 a 9 9 0 0 1 10 0 a 9 9 0 0 1 0 18 a 9 9 0 0 1 -10 0 Z" fill={accent} opacity="0.18" fillRule="evenodd" />
      <ellipse cx="18" cy="18" rx="4.5" ry="9" fill={accent} opacity="0.35" />
      <circle cx="13" cy="18" r="2" fill={accent} />
      <circle cx="23" cy="18" r="2" fill={accent} />
    </svg>
  );
}

/* ── 15 · Remedies — Diya Lamp ────────────────────────────────────── */
function IconDiya({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      {/* flame */}
      <path d="M 18 4 Q 22 9 21 13 Q 20 17 18 17 Q 16 17 15 13 Q 14 9 18 4 Z" fill={accent} />
      <path d="M 18 8 Q 19.5 11 19 13 Q 18.5 15 18 15 Q 17.5 15 17 13 Q 16.5 11 18 8 Z" fill="#FFFCF0" opacity="0.55" />
      {/* lamp bowl */}
      <path d="M 6 22 Q 18 28 30 22 Q 28 30 18 30 Q 8 30 6 22 Z" fill={accent} opacity="0.85" />
      <path d="M 6 22 Q 18 26 30 22 L 28 22 L 8 22 Z" fill={accent} />
      <ellipse cx="18" cy="21.5" rx="11" ry="1.6" fill="#FFFCF0" opacity="0.45" />
    </svg>
  );
}

/* ── 16 · KP — Sub-Lord Triplet ───────────────────────────────────── */
function IconKP({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <polygon points="18,5 30,28 6,28" fill="none" stroke={accent} strokeWidth="1.8" />
      <polygon points="18,5 24,16.5 12,16.5" fill={accent} opacity="0.55" />
      <polygon points="12,16.5 18,28 6,28" fill={accent} opacity="0.35" />
      <polygon points="24,16.5 30,28 18,28" fill={accent} opacity="0.65" />
      <line x1="18" y1="5" x2="18" y2="28" stroke={accent} strokeWidth="1" opacity="0.7" />
      <line x1="12" y1="16.5" x2="24" y2="16.5" stroke={accent} strokeWidth="1" opacity="0.7" />
      <circle cx="18" cy="20" r="2.5" fill={accent} />
    </svg>
  );
}

/* ── 17 · Jaimini — Karaka Chain ──────────────────────────────────── */
function IconJaimini({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <circle cx="8" cy="10" r="3.5" fill={accent} />
      <circle cx="18" cy="6" r="3.5" fill={accent} opacity="0.85" />
      <circle cx="28" cy="10" r="3.5" fill={accent} opacity="0.7" />
      <circle cx="28" cy="22" r="3.5" fill={accent} opacity="0.55" />
      <circle cx="18" cy="30" r="3.5" fill={accent} opacity="0.4" />
      <circle cx="8" cy="22" r="3.5" fill={accent} opacity="0.25" />
      <path d="M 11.5 10 L 14.5 6 M 21.5 6 L 24.5 10 M 28 13.5 L 28 18.5 M 24.5 22 L 21.5 30 M 14.5 30 L 11.5 22 M 8 13.5 L 8 18.5" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/* ── 18 · Lal Kitab — Open Manuscript ─────────────────────────────── */
function IconLalKitab({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <path d="M 4 8 L 18 11 L 32 8 L 32 28 L 18 30 L 4 28 Z" fill={accent} opacity="0.55" />
      <path d="M 18 11 L 18 30" stroke={accent} strokeWidth="1.4" opacity="0.9" />
      <path d="M 4 8 L 18 11 L 32 8" fill="none" stroke={accent} strokeWidth="1.6" />
      <path d="M 4 28 L 18 30 L 32 28" fill="none" stroke={accent} strokeWidth="1.6" />
      <line x1="8" y1="15" x2="15" y2="16.5" stroke={accent} strokeWidth="0.8" opacity="0.6" />
      <line x1="8" y1="19" x2="15" y2="20.5" stroke={accent} strokeWidth="0.8" opacity="0.6" />
      <line x1="8" y1="23" x2="13" y2="24" stroke={accent} strokeWidth="0.8" opacity="0.6" />
      <line x1="21" y1="16.5" x2="28" y2="15" stroke={accent} strokeWidth="0.8" opacity="0.6" />
      <line x1="21" y1="20.5" x2="28" y2="19" stroke={accent} strokeWidth="0.8" opacity="0.6" />
      <line x1="23" y1="24" x2="28" y2="23" stroke={accent} strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}

/* ── 19 · Tājika — Persian Arch ────────────────────────────────────── */
function IconTajika({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <path d="M 6 30 L 6 18 Q 6 6 18 6 Q 30 6 30 18 L 30 30" fill="none" stroke={accent} strokeWidth="2" />
      <path d="M 10 30 L 10 19 Q 10 11 18 11 Q 26 11 26 19 L 26 30" fill={accent} opacity="0.35" />
      <circle cx="18" cy="16" r="2.2" fill={accent} />
      <line x1="6" y1="30" x2="30" y2="30" stroke={accent} strokeWidth="2" />
      <line x1="8" y1="32" x2="28" y2="32" stroke={accent} strokeWidth="0.8" opacity="0.55" />
    </svg>
  );
}

/* ── 20 · Nāḍī — Palm Leaf Manuscript ─────────────────────────────── */
function IconNadi({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <ellipse cx="18" cy="18" rx="14" ry="5" fill={accent} opacity="0.55" transform="rotate(-12 18 18)" />
      <ellipse cx="18" cy="18" rx="14" ry="5" fill="none" stroke={accent} strokeWidth="1.4" transform="rotate(-12 18 18)" />
      <line x1="7" y1="20.5" x2="29" y2="15.5" stroke={accent} strokeWidth="0.8" opacity="0.55" />
      <line x1="8" y1="17.5" x2="28" y2="13" stroke={accent} strokeWidth="0.8" opacity="0.55" />
      <line x1="8" y1="22.5" x2="28" y2="18.5" stroke={accent} strokeWidth="0.8" opacity="0.55" />
      <circle cx="11" cy="20" r="0.7" fill="#FFFCF0" />
      <circle cx="25" cy="14" r="0.7" fill="#FFFCF0" />
    </svg>
  );
}

/* ── 21 · Numerology — 1-9 Number Mandala ─────────────────────────── */
function IconNumerology({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="13" fill="none" stroke={accent} strokeWidth="1.4" />
      <circle cx="18" cy="18" r="6.5" fill="none" stroke={accent} strokeWidth="0.9" opacity="0.55" />
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * 2 * Math.PI - Math.PI / 2;
        const x = 18 + Math.cos(a) * 9.5;
        const y = 18 + Math.sin(a) * 9.5;
        return <circle key={i} cx={x} cy={y} r="1.6" fill={accent} opacity={0.5 + (i * 0.05)} />;
      })}
      <text x="18" y="22" textAnchor="middle" fontSize="11" fontFamily="var(--font-cormorant), serif" fill={accent} fontWeight="600" fontStyle="italic">9</text>
    </svg>
  );
}

/* ── 22 · Vastu — 8-Direction Compass Rose ─────────────────────────── */
function IconVastu({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <rect x="5" y="5" width="26" height="26" fill="none" stroke={accent} strokeWidth="1.4" />
      <line x1="18" y1="5" x2="18" y2="31" stroke={accent} strokeWidth="0.9" opacity="0.55" />
      <line x1="5" y1="18" x2="31" y2="18" stroke={accent} strokeWidth="0.9" opacity="0.55" />
      <line x1="5" y1="5" x2="31" y2="31" stroke={accent} strokeWidth="0.9" opacity="0.45" />
      <line x1="31" y1="5" x2="5" y2="31" stroke={accent} strokeWidth="0.9" opacity="0.45" />
      <polygon points="18,8 22,18 18,28 14,18" fill={accent} />
      <circle cx="18" cy="18" r="2.2" fill="#FFFCF0" />
      <circle cx="18" cy="18" r="1" fill={accent} />
    </svg>
  );
}

/* ── 23 · Muhūrta — Clock with Auspicious Markers ─────────────────── */
function IconMuhurta({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" fill="none" stroke={accent} strokeWidth="1.8" />
      {/* hour markers */}
      {[0, 90, 180, 270].map((a) => {
        const rad = (a * Math.PI) / 180;
        const x = 18 + Math.cos(rad) * 11;
        const y = 18 + Math.sin(rad) * 11;
        return <circle key={a} cx={x} cy={y} r="1.4" fill={accent} />;
      })}
      {[30, 60, 120, 150, 210, 240, 300, 330].map((a) => {
        const rad = (a * Math.PI) / 180;
        const x = 18 + Math.cos(rad) * 11;
        const y = 18 + Math.sin(rad) * 11;
        return <circle key={a} cx={x} cy={y} r="0.8" fill={accent} opacity="0.6" />;
      })}
      {/* hands */}
      <line x1="18" y1="18" x2="18" y2="10" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="18" x2="24" y2="22" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
      {/* auspicious star */}
      <polygon points="28,8 29.5,11 32.5,11 30,13 31,16 28,14.5 25,16 26,13 23.5,11 26.5,11" fill={accent} opacity="0.85" />
      <circle cx="18" cy="18" r="1.6" fill={accent} />
    </svg>
  );
}

/* ── 24 · Ethics & History — Quill with Scroll ─────────────────────── */
function IconQuill({ accent, size = 36 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      {/* scroll */}
      <path d="M 6 24 Q 6 14 12 14 L 30 14 Q 30 24 24 24 L 6 24 Z" fill={accent} opacity="0.45" />
      <path d="M 6 24 Q 6 14 12 14" fill="none" stroke={accent} strokeWidth="1.6" />
      <path d="M 24 24 Q 30 24 30 14" fill="none" stroke={accent} strokeWidth="1.6" />
      <line x1="12" y1="18" x2="22" y2="18" stroke={accent} strokeWidth="0.9" opacity="0.65" />
      <line x1="12" y1="21" x2="20" y2="21" stroke={accent} strokeWidth="0.9" opacity="0.65" />
      {/* quill */}
      <path d="M 22 6 L 30 14 L 28 16 L 20 8 Z" fill={accent} />
      <path d="M 30 14 L 26 18" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 22 6 L 28 4 L 30 8 L 26 10 Z" fill={accent} opacity="0.55" />
      <path d="M 23 9 L 27 13 M 24 7 L 28 11" stroke={accent} strokeWidth="0.5" opacity="0.7" />
    </svg>
  );
}

/* ── Lookup table by module sequence ──────────────────────────────── */
const ILLUSTRATIONS: Array<(p: IllustrationProps) => ReactNode> = [
  IconLotus, IconSundial, IconPanchanga, IconZodiac, IconGrahas, IconBhavas,
  IconNakshatras, IconAspects, IconDivisional, IconDasha, IconTransits, IconAshtaka,
  IconStrengths, IconYogas, IconDiya, IconKP, IconJaimini, IconLalKitab,
  IconTajika, IconNadi, IconNumerology, IconVastu, IconMuhurta, IconQuill,
];

export function ModuleIllustration({ index, accent, size }: { index: number; accent: string; size?: number }) {
  const Comp = ILLUSTRATIONS[(index - 1) % ILLUSTRATIONS.length];
  return <>{Comp({ accent, size })}</>;
}
