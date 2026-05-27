"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { IAST } from "../../chrome/typography";

/* ─── Tithi data ─── */
const TITHI_DB: Record<number, { name: string; deity: string; quality: string }> = {
  1: { name: "Pratipadā", deity: "Agni", quality: "Nandā (joyful)" },
  2: { name: "Dvitīyā", deity: "Aśvinī", quality: "Bhadra (auspicious)" },
  3: { name: "Tritīyā", deity: "Gaurī", quality: "Jayā (victorious)" },
  4: { name: "Caturthī", deity: "Gaṇapati", quality: "Riktā (empty)" },
  5: { name: "Pañcamī", deity: "Nāga", quality: "Pūrṇā (full)" },
  6: { name: "Ṣaṣṭhī", deity: "Kārtikeya", quality: "Nandā" },
  7: { name: "Saptamī", deity: "Sūrya", quality: "Bhadra" },
  8: { name: "Aṣṭamī", deity: "Rudra", quality: "Jayā" },
  9: { name: "Navamī", deity: "Durgā", quality: "Riktā" },
  10: { name: "Daśamī", deity: "Dharma", quality: "Pūrṇā" },
  11: { name: "Ekādaśī", deity: "Viṣṇu", quality: "Nandā" },
  12: { name: "Dvādaśī", deity: "Viṣṇu", quality: "Bhadra" },
  13: { name: "Trayodaśī", deity: "Kāma", quality: "Jayā" },
  14: { name: "Caturdaśī", deity: "Rudra", quality: "Riktā" },
  15: { name: "Pūrṇimā / Amāvāsyā", deity: "Candra / Pitṛ", quality: "Pūrṇā" },
};

function computeTithi(angleDeg: number) {
  const elongation = ((angleDeg % 360) + 360) % 360;
  const tithiIndex = Math.floor(elongation / 12);
  const tithiNumber = tithiIndex + 1;
  const elapsedFraction = elongation / 12 - tithiIndex;
  const paksha = elongation < 180 ? "śukla" : "kṛṣṇa";
  const displayNumber = elongation < 180 ? tithiNumber : tithiNumber - 15;
  const nameKey = Math.min(displayNumber, 15);
  const db = TITHI_DB[nameKey];
  const tithiName = db?.name ?? "—";
  const deity = db?.deity ?? "—";
  const quality = db?.quality ?? "—";
  const remainingDeg = 12 - (elongation % 12);
  const remainingPct = Math.round((1 - elapsedFraction) * 100);

  return {
    elongation: Math.round(elongation * 10) / 10,
    tithiIndex,
    tithiNumber,
    displayNumber,
    tithiName,
    deity,
    quality,
    paksha,
    elapsedFraction: Math.round(elapsedFraction * 1000) / 1000,
    remainingDeg: Math.round(remainingDeg * 10) / 10,
    remainingPct,
  };
}

function tithiForSegment(segIndex: number) {
  const paksha = segIndex < 15 ? "śukla" : "kṛṣṇa";
  const displayNum = segIndex < 15 ? segIndex + 1 : segIndex - 14;
  const db = TITHI_DB[Math.min(displayNum, 15)];
  return { paksha, displayNum, name: db?.name ?? "—", deity: db?.deity ?? "—" };
}

/* ─── Design token helpers ─── */
const GOLD = "#C28220";
const RUST = "#A23A1E";
const GOLD_LIGHT = "rgba(232,158,42,0.12)";
const RUST_LIGHT = "rgba(212,80,46,0.12)";
const GOLD_BORDER = "rgba(194,130,32,0.45)";

/* ─── Orbital visualiser ─── */
function OrbitDiagram({ angle, onAngleChange }: { angle: number; onAngleChange: (a: number) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSeg, setHoveredSeg] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const R = 190;
  const R_OUTER = R + 32;
  const R_INNER = 56;
  const SUN_R = 20;
  const MOON_R = 11;
  const LABEL_R = (R_INNER + R) / 2 + 8;

  const currentSegment = Math.floor(((angle % 360) + 360) % 360 / 12);
  const segmentMidAngle = currentSegment * 12 + 6;
  const moonX = R * Math.cos((segmentMidAngle - 90) * (Math.PI / 180));
  const moonY = R * Math.sin((segmentMidAngle - 90) * (Math.PI / 180));

  const previewSeg = hoveredSeg ?? currentSegment;
  const previewAngle = previewSeg * 12 + 6;
  const previewX = R * Math.cos((previewAngle - 90) * (Math.PI / 180));
  const previewY = R * Math.sin((previewAngle - 90) * (Math.PI / 180));

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = 520 / rect.width;
    const x = (e.clientX - rect.left) * scale - 260;
    const y = (e.clientY - rect.top) * scale - 260;
    const dist = Math.sqrt(x * x + y * y);
    if (dist < R_INNER || dist > R_OUTER + 10) return;
    let a = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (a < 0) a += 360;
    const seg = Math.floor(a / 12);
    onAngleChange(seg * 12 + 6);
  }, [onAngleChange]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = 520 / rect.width;
    const x = (e.clientX - rect.left) * scale - 260;
    const y = (e.clientY - rect.top) * scale - 260;
    const dist = Math.sqrt(x * x + y * y);

    if (dist < R_INNER || dist > R_OUTER + 10) {
      setHoveredSeg(null);
      setTooltipPos(null);
      return;
    }
    let a = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (a < 0) a += 360;
    const seg = Math.floor(a / 12);
    setHoveredSeg(seg);
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredSeg(null);
    setTooltipPos(null);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        viewBox="0 0 520 520"
        className="w-full h-auto cursor-pointer"
        style={{ maxWidth: 520, display: "block", margin: "0 auto" }}
        onClick={handleSvgClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5C842" />
            <stop offset="40%" stopColor="#E89E2A" />
            <stop offset="100%" stopColor="#C47A1A" />
          </radialGradient>
          <filter id="sunHalo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#6B4423" floodOpacity="0.22" />
          </filter>
          <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="moonGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFCF0" />
            <stop offset="100%" stopColor="#E8E0D0" />
          </radialGradient>
          <clipPath id="sunClip">
            <circle cx={260} cy={260} r={SUN_R} />
          </clipPath>
        </defs>

        {/* Background ambient glow */}
        <circle cx={260} cy={260} r={R + 55} fill="url(#sunGlow)" opacity={0.08} />

        {/* Outer decorative rings */}
        <circle cx={260} cy={260} r={R_OUTER} fill="none" stroke="#C9A24D" strokeWidth={1.4} opacity={0.50} />
        <circle cx={260} cy={260} r={R_OUTER - 6} fill="none" stroke="#C9A24D" strokeWidth={0.6} opacity={0.35} strokeDasharray="4 4" />

        {/* 30 segment wedges */}
        {Array.from({ length: 30 }, (_, i) => {
          const start = i * 12;
          const end = (i + 1) * 12;
          const x1 = 260 + R * Math.cos((start - 90) * (Math.PI / 180));
          const y1 = 260 + R * Math.sin((start - 90) * (Math.PI / 180));
          const x2 = 260 + R * Math.cos((end - 90) * (Math.PI / 180));
          const y2 = 260 + R * Math.sin((end - 90) * (Math.PI / 180));
          const isActive = i === currentSegment;
          const isHovered = i === hoveredSeg;
          const isShukla = i < 15;
          return (
            <path
              key={i}
              d={`M 260 260 L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`}
              fill={isActive
                ? (isShukla ? "rgba(232,158,42,0.30)" : "rgba(212,80,46,0.24)")
                : isHovered
                  ? (isShukla ? "rgba(232,158,42,0.14)" : "rgba(212,80,46,0.10)")
                  : "transparent"}
              stroke={isActive ? GOLD : isHovered ? (isShukla ? "rgba(194,130,32,0.65)" : "rgba(162,58,30,0.55)") : isShukla ? "rgba(156,122,47,0.30)" : "rgba(162,58,30,0.24)"}
              strokeWidth={isActive ? 2.5 : isHovered ? 1.8 : 0.7}
              style={{ transition: "all 0.2s ease", cursor: "pointer" }}
              onMouseEnter={() => setHoveredSeg(i)}
            />
          );
        })}

        {/* Segment number labels */}
        {Array.from({ length: 30 }, (_, i) => {
          const midAngle = i * 12 + 6;
          const lx = 260 + LABEL_R * Math.cos((midAngle - 90) * (Math.PI / 180));
          const ly = 260 + LABEL_R * Math.sin((midAngle - 90) * (Math.PI / 180));
          const isActive = i === currentSegment;
          const isShukla = i < 15;
          return (
            <text
              key={`label-${i}`}
              x={lx} y={ly + 3}
              textAnchor="middle"
              fill={isActive ? (isShukla ? "#7A4E10" : "#8A2E1E") : isShukla ? "rgba(107,68,35,0.45)" : "rgba(122,44,30,0.40)"}
              fontSize={isActive ? 11 : 9}
              fontWeight={isActive ? 900 : 700}
              style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none", transition: "all 0.15s ease" }}
            >
              {i + 1}
            </text>
          );
        })}

        {/* Radial lines */}
        {Array.from({ length: 30 }, (_, i) => {
          const a = i * 12;
          const isMajor = i % 5 === 0;
          const innerR = R_INNER + 4;
          const outerR = isMajor ? R_OUTER - 4 : R + 10;
          const x1 = 260 + innerR * Math.cos((a - 90) * (Math.PI / 180));
          const y1 = 260 + innerR * Math.sin((a - 90) * (Math.PI / 180));
          const x2 = 260 + outerR * Math.cos((a - 90) * (Math.PI / 180));
          const y2 = 260 + outerR * Math.sin((a - 90) * (Math.PI / 180));
          return (
            <line
              key={`line-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isMajor ? "rgba(156,122,47,0.55)" : "rgba(156,122,47,0.28)"}
              strokeWidth={isMajor ? 1.4 : 0.8}
            />
          );
        })}

        {/* Tick marks on orbit ring */}
        {Array.from({ length: 30 }, (_, i) => {
          const a = i * 12;
          const isMajor = i % 5 === 0;
          const tIn = R - (isMajor ? 10 : 5);
          const tOut = R + (isMajor ? 10 : 5);
          const x1 = 260 + tIn * Math.cos((a - 90) * (Math.PI / 180));
          const y1 = 260 + tIn * Math.sin((a - 90) * (Math.PI / 180));
          const x2 = 260 + tOut * Math.cos((a - 90) * (Math.PI / 180));
          const y2 = 260 + tOut * Math.sin((a - 90) * (Math.PI / 180));
          return (
            <line
              key={`tick-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isMajor ? "#7A5E20" : "rgba(107,68,35,0.45)"}
              strokeWidth={isMajor ? 2 : 1}
            />
          );
        })}

        {/* Orbit path */}
        <circle cx={260} cy={260} r={R} fill="none" stroke="rgba(107,68,35,0.45)" strokeWidth={1.4} strokeDasharray="4 4" />

        {/* Inner mandala rings */}
        <circle cx={260} cy={260} r={R_INNER} fill="none" stroke="#B08A3A" strokeWidth={1.2} strokeOpacity={0.60} />
        <circle cx={260} cy={260} r={R_INNER - 14} fill="none" stroke="#B08A3A" strokeWidth={0.7} strokeOpacity={0.40} />

        {/* Pakṣa labels */}
        <text x={260} y={16} textAnchor="middle" fill="#7A5E20" fontSize={13} fontWeight={800} letterSpacing={0.16} style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase" }}>
          Śukla Pakṣa · 1–15
        </text>
        <text x={260} y={510} textAnchor="middle" fill="#8A2E1E" fontSize={13} fontWeight={800} letterSpacing={0.16} style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase" }}>
          Kṛṣṇa Pakṣa · 16–30
        </text>

        {/* Cardinal degree labels */}
        <text x={260} y={260 - R_OUTER + 14} textAnchor="middle" fill="#9C7A2F" fontSize={10} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>0°</text>
        <text x={260 + R_OUTER - 14} y={264} textAnchor="middle" fill="#9C7A2F" fontSize={10} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>90°</text>
        <text x={260} y={260 + R_OUTER - 6} textAnchor="middle" fill="#A23A1E" fontSize={10} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>180°</text>
        <text x={260 - R_OUTER + 14} y={264} textAnchor="middle" fill="#A23A1E" fontSize={10} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>270°</text>

        {/* ── SUN ── */}
        <circle cx={260} cy={260} r={SUN_R + 14} fill="url(#sunGlow)" opacity={0.30} filter="url(#sunHalo)" />
        <image
          href="/assets/learning/tithi-sun-mandala.png"
          x={260 - SUN_R}
          y={260 - SUN_R}
          width={SUN_R * 2}
          height={SUN_R * 2}
          clipPath="url(#sunClip)"
          preserveAspectRatio="xMidYMid slice"
          style={{ pointerEvents: "none" }}
        />
        <circle cx={260} cy={260} r={SUN_R} fill="none" stroke="#C28220" strokeWidth={1.4} opacity={0.70} />
        <circle cx={260} cy={260} r={SUN_R + 3} fill="none" stroke="#C28220" strokeWidth={0.7} opacity={0.40} />

        {/* ── Elongation arc (between Sun and inner ring, visible) ── */}
        {angle > 0 && (
          <>
            <path
              d={`M 260 ${260 - (R_INNER + 10)} A ${R_INNER + 10} ${R_INNER + 10} 0 ${angle > 180 ? 1 : 0} 1 ${260 + (R_INNER + 10) * Math.sin(angle * Math.PI / 180)} ${260 - (R_INNER + 10) * Math.cos(angle * Math.PI / 180)}`}
              fill="none"
              stroke="#E89E2A"
              strokeWidth={2}
              strokeDasharray="4 2"
              opacity={0.85}
            />
            <text
              x={260 + (R_INNER + 26) * Math.sin(angle * Math.PI / 180)}
              y={260 - (R_INNER + 26) * Math.cos(angle * Math.PI / 180)}
              fill="#E89E2A"
              fontSize={12}
              fontWeight={700}
              style={{ fontFamily: "var(--font-sans), sans-serif" }}
            >
              {Math.round(angle)}°
            </text>
          </>
        )}

        {/* ── PREVIEW DOT ── */}
        {hoveredSeg !== null && hoveredSeg !== currentSegment && (
          <circle
            cx={260 + previewX}
            cy={260 + previewY}
            r={5}
            fill="rgba(232,158,42,0.50)"
            stroke="#C28220"
            strokeWidth={1}
            strokeDasharray="2 2"
            style={{ transition: "all 0.15s ease", pointerEvents: "none" }}
          />
        )}

        {/* ── MOON (animated with CSS transform on group) ── */}
        <g
          style={{
            transform: `translate(${moonX}px, ${moonY}px)`,
            transition: "transform 0.4s cubic-bezier(0.32, 0.72, 0.24, 1)",
            transformOrigin: "260px 260px",
          }}
        >
          {/* Moon glow */}
          <circle cx={260} cy={260} r={MOON_R + 10} fill={currentSegment < 15 ? "rgba(232,158,42,0.28)" : "rgba(212,80,46,0.22)"} filter="url(#sunHalo)" style={{ transition: "fill 0.3s ease" }} />
          {/* Moon body */}
          <image
            href="/assets/learning/tithi-moon-glyph.png"
            x={260 - MOON_R}
            y={260 - MOON_R}
            width={MOON_R * 2}
            height={MOON_R * 2}
            clipPath={`circle(${MOON_R}px at ${260}px ${260}px)`}
            preserveAspectRatio="xMidYMid slice"
            style={{ pointerEvents: "none" }}
            onError={(e) => { (e.target as SVGImageElement).style.display = "none"; }}
          />
          <circle cx={260} cy={260} r={MOON_R} fill="url(#moonGrad)" stroke={currentSegment < 15 ? GOLD : RUST} strokeWidth={2.2} filter="url(#softShadow)" style={{ transition: "stroke 0.3s ease" }} />
          {/* Moon glyph text fallback */}
          <text x={260} y={260 + 4} textAnchor="middle" fill="#3E2A1F" fontSize={12} fontWeight={800} style={{ fontFamily: "serif", pointerEvents: "none" }}>☽</text>
          {/* Active midpoint dot */}
          <circle cx={260} cy={260} r={3.5} fill={GOLD} />
        </g>

        {/* Elongation line (static from center, but Moon moves) */}
        <line x1={260} y1={260} x2={260 + moonX} y2={260 + moonY} stroke="rgba(194,130,32,0.50)" strokeWidth={1.4} strokeDasharray="4 3" style={{ transition: "all 0.4s cubic-bezier(0.32, 0.72, 0.24, 1)" }} />
      </svg>

      {/* Hover tooltip */}
      {hoveredSeg !== null && tooltipPos && (
        <div
          className="hidden sm:block"
          style={{
            position: "absolute",
            left: Math.min(tooltipPos.x + 16, (svgRef.current?.clientWidth ?? 520) - 170),
            top: tooltipPos.y - 10,
            pointerEvents: "none",
            zIndex: 10,
            background: "var(--gl-card-surface-solid, #FFF9F0)",
            border: "1px solid var(--gl-gold-hairline)",
            borderRadius: 10,
            padding: "10px 14px",
            boxShadow: "0 4px 16px rgba(62,42,31,0.14)",
            minWidth: 150,
          }}
        >
          <SegmentTooltip segIndex={hoveredSeg} />
        </div>
      )}
    </div>
  );
}

function SegmentTooltip({ segIndex }: { segIndex: number }) {
  const t = tithiForSegment(segIndex);
  return (
    <div>
      <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.14, color: t.paksha === "śukla" ? "#9C7A2F" : "#A23A1E", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: 4 }}>
        {t.paksha === "śukla" ? "Śukla" : "Kṛṣṇa"} {t.displayNum}/15 · Tithi {segIndex + 1}/30
      </p>
      <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 16, fontWeight: 600, color: "var(--gl-ink-primary)", lineHeight: 1.2 }}>
        <IAST>{t.name}</IAST>
      </p>
      <p style={{ fontSize: 11, color: "var(--gl-ink-muted)", marginTop: 3 }}>
        Deity: <IAST>{t.deity}</IAST>
      </p>
    </div>
  );
}

/* ─── Reusable card component ─── */
function DataCard({
  children,
  accent,
  borderLeft,
  padding = "18px 20px",
}: {
  children: React.ReactNode;
  accent?: string;
  borderLeft?: string;
  padding?: string;
}) {
  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding,
        borderLeft: borderLeft ? borderLeft : undefined,
        borderTop: accent ? `3px solid ${accent}` : undefined,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <p style={{
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.18em",
      color: accent ?? "var(--gl-ink-muted)",
      fontWeight: 700,
      fontFamily: "var(--font-sans), system-ui, sans-serif",
      marginBottom: 12,
    }}>
      {children}
    </p>
  );
}

/* ─── Main component ─── */
export function TithiAngleVisualizer() {
  const [angle, setAngle] = useState(45);
  const [degreeInput, setDegreeInput] = useState("45");

  const stepAngle = useCallback((dir: -1 | 1) => {
    setAngle((a) => {
      const seg = Math.floor(((a % 360) + 360) % 360 / 12);
      const nextSeg = (seg + dir + 30) % 30;
      return nextSeg * 12 + 6;
    });
  }, []);

  const goToDegree = useCallback(() => {
    const val = parseFloat(degreeInput);
    if (!Number.isNaN(val) && val >= 0 && val < 360) {
      setAngle(val);
    }
  }, [degreeInput]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepAngle(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepAngle(1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [stepAngle]);

  const tithi = useMemo(() => computeTithi(angle), [angle]);

  const presets = [
    { label: "Pratipadā", angle: 6, paksha: "śukla", desc: "New moon → first waxing tithi" },
    { label: "Caturthī", angle: 42, paksha: "śukla", desc: "Gaṇeśa-vrata tithi" },
    { label: "Aṣṭamī", angle: 90, paksha: "śukla", desc: "Durgā-Aṣṭamī" },
    { label: "Ekādaśī", angle: 126, paksha: "śukla", desc: "Vaiṣṇava fast tithi" },
    { label: "Pūrṇimā", angle: 174, paksha: "śukla", desc: "Full moon" },
    { label: "Janmāṣṭamī", angle: 234, paksha: "kṛṣṇa", desc: "Kṛṣṇa's birth tithi" },
    { label: "Amāvāsyā", angle: 354, paksha: "kṛṣṇa", desc: "New moon — conjunction" },
  ];

  const pakshaColor = tithi.paksha === "śukla" ? GOLD : RUST;
  const pakshaBg = tithi.paksha === "śukla" ? "rgba(232,158,42,0.14)" : "rgba(212,80,46,0.12)";
  const pakshaBorder = tithi.paksha === "śukla" ? "rgba(194,130,32,0.45)" : "rgba(162,58,30,0.40)";

  return (
    <div className="my-6 flex flex-col gap-4">
      {/* Header strip */}
      <header
        className="gl-surface-twilight-glass flex flex-wrap items-center gap-4 p-4"
        style={{ borderLeft: `4px solid ${pakshaColor}`, transition: "border-color 320ms cubic-bezier(0.32, 0.72, 0.24, 1)" }}
      >
        {/* Decorative mandala */}
        <div className="relative flex-shrink-0 w-12 h-12 rounded-full overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(107,68,35,0.15)" }}>
          <img
            src="/assets/learning/tithi-sun-mandala.png"
            alt="Sūrya-Candra mandala"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xl -z-10" style={{ background: "linear-gradient(135deg, #F5C842 0%, #E89E2A 50%, #C47A1A 100%)" }}>☉☽</div>
        </div>

        {/* Pakṣa pill */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full flex-shrink-0"
          style={{ background: pakshaBg, border: `1px solid ${pakshaBorder}`, transition: "all 320ms cubic-bezier(0.32, 0.72, 0.24, 1)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: pakshaColor }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: pakshaColor, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            {tithi.paksha === "śukla" ? "Śukla Pakṣa" : "Kṛṣṇa Pakṣa"}
          </span>
        </div>

        {/* Tithi info */}
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--gl-ink-muted)", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            Current Tithi
          </p>
          <p className="text-xl font-medium" style={{ fontFamily: "var(--font-cormorant), serif", color: pakshaColor, lineHeight: 1.2, transition: "color 320ms cubic-bezier(0.32, 0.72, 0.24, 1)" }}>
            {tithi.tithiName} <span className="text-base" style={{ color: "var(--gl-ink-muted)" }}>({tithi.displayNumber}/15)</span>
          </p>
          <p className="text-sm italic mt-0.5" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-secondary)" }}>
            Deity: <IAST>{tithi.deity}</IAST> · Quality: <IAST>{tithi.quality}</IAST>
          </p>
        </div>

        {/* Formula box */}
        <div
          className="flex-1 min-w-[240px] rounded-lg p-3"
          style={{
            background: tithi.paksha === "śukla" ? "rgba(232,158,42,0.08)" : "rgba(212,80,46,0.06)",
            border: `1px solid ${tithi.paksha === "śukla" ? "rgba(194,130,32,0.30)" : "rgba(162,58,30,0.25)"}`,
            borderLeft: `3px solid ${pakshaColor}`,
            transition: "all 320ms cubic-bezier(0.32, 0.72, 0.24, 1)",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: pakshaColor, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            Live Formula
          </p>
          <p className="text-sm italic leading-relaxed" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
            Tithi = ⌊{tithi.elongation}° ÷ 12°⌋ + 1 ={" "}
            <strong style={{ color: pakshaColor }}>{tithi.tithiNumber}</strong>
            <span className="mx-1.5" style={{ color: "var(--gl-ink-muted)" }}>·</span>
            Elapsed: <strong style={{ color: pakshaColor }}>{Math.round(tithi.elapsedFraction * 100)}%</strong>
          </p>
        </div>
      </header>

      {/* Two-column: Diagram + Data cards — RESPONSIVE */}
      <div className="gl-surface-twilight-glass p-5 lg:p-7 flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-7 items-start">
        {/* LEFT — Orbital diagram */}
        <div className="flex flex-col items-center gap-4 w-full">
          <OrbitDiagram angle={angle} onAngleChange={setAngle} />

          {/* Controls */}
          <div className="w-full max-w-md flex flex-col gap-2.5">
            {/* Slider row */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => stepAngle(-1)}
                title="Previous tithi (← arrow key)"
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-extrabold transition-all"
                style={{ background: GOLD_LIGHT, border: `1.5px solid ${GOLD_BORDER}`, color: "#9C7A2F" }}
              >
                −
              </button>
              <input
                type="range"
                min={0}
                max={359}
                value={angle}
                onChange={(e) => { setAngle(Number(e.target.value)); setDegreeInput(String(Math.round(Number(e.target.value)))); }}
                className="flex-1"
                style={{ accentColor: pakshaColor, cursor: "pointer" }}
              />
              <button
                onClick={() => stepAngle(1)}
                title="Next tithi (→ arrow key)"
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-extrabold transition-all"
                style={{ background: GOLD_LIGHT, border: `1.5px solid ${GOLD_BORDER}`, color: "#9C7A2F" }}
              >
                +
              </button>
            </div>
            {/* Degree labels */}
            <div className="flex justify-between px-11">
              <span className="text-sm italic" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-muted)" }}>0°</span>
              <span className="text-sm italic" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-muted)" }}>180°</span>
              <span className="text-sm italic" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-muted)" }}>360°</span>
            </div>
            {/* Direct entry */}
            <div className="flex items-center justify-center gap-2.5">
              <span className="text-xs font-semibold" style={{ color: "var(--gl-ink-muted)", fontFamily: "var(--font-sans), sans-serif" }}>Go to degree:</span>
              <input
                type="number"
                min={0}
                max={359}
                value={degreeInput}
                onChange={(e) => setDegreeInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") goToDegree(); }}
                className="w-16 px-2.5 py-1.5 rounded-lg text-sm font-bold text-center outline-none"
                style={{ background: "rgba(255,252,240,0.85)", border: "1.5px solid rgba(156,122,47,0.35)", color: "var(--gl-ink-primary)", fontFamily: "var(--font-sans), sans-serif" }}
              />
              <span className="text-sm font-semibold" style={{ color: "var(--gl-ink-secondary)" }}>°</span>
              <button
                onClick={goToDegree}
                className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                style={{ background: "rgba(232,158,42,0.15)", border: `1.5px solid ${GOLD_BORDER}`, color: "#9C7A2F", fontFamily: "var(--font-sans), sans-serif" }}
              >
                Go
              </button>
            </div>
          </div>

          {/* Presets */}
          <div className="w-full max-w-md">
            <SectionLabel>Festival Presets</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => {
                const isActive = Math.abs(angle - p.angle) < 6;
                return (
                  <button
                    key={p.label}
                    onClick={() => { setAngle(p.angle); setDegreeInput(String(p.angle)); }}
                    title={p.desc}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all"
                    style={{
                      background: isActive ? (p.paksha === "śukla" ? "rgba(232,158,42,0.18)" : "rgba(212,80,46,0.14)") : "rgba(232,158,42,0.05)",
                      border: isActive ? `1.5px solid ${p.paksha === "śukla" ? GOLD : RUST}` : "1px solid rgba(156,122,47,0.22)",
                      color: isActive ? (p.paksha === "śukla" ? "#8A5E1A" : RUST) : "#9C7A2F",
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tip */}
          <div
            className="w-full max-w-md rounded-lg p-2.5 flex items-center gap-2.5"
            style={{ background: "rgba(156,122,47,0.08)", border: "1px solid rgba(156,122,47,0.22)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9C7A2F" strokeWidth={2} strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <p className="text-xs leading-relaxed italic" style={{ color: "var(--gl-ink-secondary)", fontFamily: "var(--font-cormorant), serif" }}>
              <strong>Tip:</strong> The Moon smoothly animates between segment midpoints. Drag the slider or click the orbit to explore.
            </p>
          </div>
        </div>

        {/* RIGHT — Data cards */}
        <div className="flex flex-col gap-4 w-full">
          {/* Tithi progress card */}
          <DataCard borderLeft={`4px solid ${pakshaColor}`}>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: pakshaColor, lineHeight: 1, transition: "color 320ms ease" }}>
                {tithi.displayNumber}
              </span>
              <span className="text-lg" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-muted)" }}>/ 15</span>
            </div>
            <p className="text-lg font-medium mb-1" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
              <IAST>{tithi.tithiName}</IAST>
            </p>
            <p className="text-sm mb-3.5" style={{ color: "var(--gl-ink-secondary)" }}>
              Absolute tithi <strong>{tithi.tithiNumber}</strong> / 30
            </p>
            {/* Progress bar */}
            <div className="relative h-2.5 rounded-full overflow-hidden mb-2" style={{ background: "rgba(156,122,47,0.18)" }}>
              <div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{
                  width: `${tithi.elapsedFraction * 100}%`,
                  background: pakshaColor,
                  transition: "width 0.15s linear, background 320ms ease",
                }}
              />
            </div>
            <div className="flex justify-between text-xs" style={{ color: "var(--gl-ink-muted)" }}>
              <span>{Math.round(tithi.elapsedFraction * 100)}% elapsed</span>
              <span>{tithi.remainingPct}% until next (~{tithi.remainingDeg}°)</span>
            </div>
          </DataCard>

          {/* Astronomical data — 2×2 grid */}
          <DataCard>
            <SectionLabel>Astronomical Data</SectionLabel>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Sun-Moon Angle", value: `${tithi.elongation}°`, accent: pakshaColor },
                { label: "12° Segments", value: String(Math.floor(tithi.elongation / 12)), accent: pakshaColor },
                { label: "Quality", value: <IAST>{tithi.quality}</IAST>, accent: pakshaColor, small: true },
                { label: "Ruling Deity", value: <IAST>{tithi.deity}</IAST>, accent: pakshaColor, small: true },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg p-3"
                  style={{
                    background: tithi.paksha === "śukla" ? "rgba(232,158,42,0.10)" : "rgba(212,80,46,0.08)",
                    border: `1px solid ${tithi.paksha === "śukla" ? "rgba(156,122,47,0.25)" : "rgba(162,58,30,0.22)"}`,
                    transition: "all 320ms ease",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--gl-ink-secondary)" }}>{item.label}</p>
                  <p className={`font-semibold ${item.small ? "text-base" : "text-xl"}`} style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </DataCard>

          {/* Pañcāṅga reading */}
          <DataCard>
            <SectionLabel>Pañcāṅga Reading</SectionLabel>
            <div
              className="rounded-lg p-3 mb-2.5"
              style={{
                background: tithi.paksha === "śukla" ? "rgba(232,158,42,0.10)" : "rgba(212,80,46,0.08)",
                border: `1px solid ${tithi.paksha === "śukla" ? "rgba(194,130,32,0.30)" : "rgba(162,58,30,0.25)"}`,
                borderLeft: `3px solid ${pakshaColor}`,
                transition: "all 320ms ease",
              }}
            >
              <p className="text-base font-medium" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
                <IAST>{tithi.paksha === "śukla" ? "Śukla" : "Kṛṣṇa"}</IAST> <IAST>{tithi.tithiName}</IAST>
                <span className="text-sm ml-1" style={{ color: "var(--gl-ink-muted)" }}>({tithi.displayNumber}/15)</span>
              </p>
            </div>
            <p className="text-sm italic leading-relaxed" style={{ color: "var(--gl-ink-muted)", fontFamily: "var(--font-cormorant), serif" }}>
              At sunrise on this day, the pañcāṅga would list this tithi as the primary limb.
              The tithi ends when the Moon advances another {tithi.remainingDeg}° beyond the current {tithi.elongation}° separation.
            </p>
          </DataCard>

          {/* Operational distinction */}
          <DataCard>
            <SectionLabel>Operational Distinction</SectionLabel>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2.5 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold" style={{ background: "rgba(232,158,42,0.15)", color: "#9C7A2F", fontFamily: "var(--font-sans), sans-serif" }}>P</span>
                <div>
                  <p className="text-sm font-bold mb-0.5" style={{ color: "var(--gl-ink-primary)" }}>Pañcāṅga-tithi</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--gl-ink-muted)" }}>
                    Sunrise-anchored. Used for <strong>daily ritual, festival-day determination, vrata observance</strong>.
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold" style={{ background: "rgba(212,80,46,0.12)", color: "#A23A1E", fontFamily: "var(--font-sans), sans-serif" }}>I</span>
                <div>
                  <p className="text-sm font-bold mb-0.5" style={{ color: "var(--gl-ink-primary)" }}>Instantaneous-tithi</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--gl-ink-muted)" }}>
                    At this precise clock-moment. Used for <strong>natal-chart recording, muhūrta-election</strong>.
                  </p>
                </div>
              </div>
            </div>
          </DataCard>
        </div>
      </div>

      {/* Instruction */}
      <p className="text-xs italic text-center" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-muted)" }}>
        Click the orbit ring or drag the slider to set Moon position. Use − / + buttons or ← → arrow keys to step between tithis.
        Type a degree and press Go for direct entry. Hover over any segment to preview its tithi. Tap a festival preset to jump to a canonical tithi.
      </p>
    </div>
  );
}
