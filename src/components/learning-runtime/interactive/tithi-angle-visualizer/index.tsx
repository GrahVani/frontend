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

  const currentSegment = Math.floor(((angle % 360) + 360) % 360 / 12);
  const segmentMidAngle = currentSegment * 12 + 6;
  const moonX = R * Math.cos((segmentMidAngle - 90) * (Math.PI / 180));
  const moonY = R * Math.sin((segmentMidAngle - 90) * (Math.PI / 180));

  // Hover preview position
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
          <clipPath id="moonClip">
            <circle cx={260 + previewX} cy={260 + previewY} r={MOON_R} />
          </clipPath>
        </defs>

        {/* Background ambient glow */}
        <circle cx={260} cy={260} r={R + 55} fill="url(#sunGlow)" opacity={0.04} />

        {/* Outer decorative rings — perfectly contained */}
        <circle cx={260} cy={260} r={R_OUTER} fill="none" stroke="#E8DCC8" strokeWidth={1.2} opacity={0.45} />
        <circle cx={260} cy={260} r={R_OUTER - 6} fill="none" stroke="#E8DCC8" strokeWidth={0.5} opacity={0.3} strokeDasharray="4 4" />

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
                ? (isShukla ? "rgba(232,158,42,0.18)" : "rgba(212,80,46,0.14)")
                : isHovered
                  ? (isShukla ? "rgba(232,158,42,0.08)" : "rgba(212,80,46,0.06)")
                  : "transparent"}
              stroke={isActive ? "#E89E2A" : isHovered ? (isShukla ? "rgba(232,158,42,0.5)" : "rgba(212,80,46,0.4)") : isShukla ? "rgba(156,122,47,0.16)" : "rgba(162,58,30,0.12)"}
              strokeWidth={isActive ? 2 : isHovered ? 1.4 : 0.5}
              style={{ transition: "all 0.2s ease", cursor: "pointer" }}
              onMouseEnter={() => setHoveredSeg(i)}
            />
          );
        })}

        {/* Radial lines from inner ring to outer ring */}
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
              stroke={isMajor ? "rgba(156,122,47,0.40)" : "rgba(156,122,47,0.18)"}
              strokeWidth={isMajor ? 1.4 : 0.6}
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
              stroke={isMajor ? "#9C7A2F" : "rgba(156,122,47,0.28)"}
              strokeWidth={isMajor ? 2 : 1}
            />
          );
        })}

        {/* Orbit path */}
        <circle cx={260} cy={260} r={R} fill="none" stroke="rgba(156,122,47,0.22)" strokeWidth={1.2} strokeDasharray="4 4" />

        {/* Inner mandala rings */}
        <circle cx={260} cy={260} r={R_INNER} fill="none" stroke="#C9A24D" strokeWidth={1} strokeOpacity={0.40} />
        <circle cx={260} cy={260} r={R_INNER - 14} fill="none" stroke="#C9A24D" strokeWidth={0.6} strokeOpacity={0.25} />

        {/* Pakṣa label arcs */}
        <path id="shuklaArc" d={`M 200 62 A 60 60 0 0 1 320 62`} fill="none" />
        <text fill="#9C7A2F" fontSize={11} fontWeight={700} letterSpacing={0.12} style={{ fontFamily: "var(--font-cormorant), serif", textTransform: "uppercase" }}>
          <textPath href="#shuklaArc" startOffset="50%" textAnchor="middle">Śukla Pakṣa · 1–15</textPath>
        </text>
        <path id="krishnaArc" d={`M 320 458 A 60 60 0 0 1 200 458`} fill="none" />
        <text fill="#A23A1E" fontSize={11} fontWeight={700} letterSpacing={0.12} style={{ fontFamily: "var(--font-cormorant), serif", textTransform: "uppercase" }}>
          <textPath href="#krishnaArc" startOffset="50%" textAnchor="middle">Kṛṣṇa Pakṣa · 16–30</textPath>
        </text>

        {/* Cardinal degree labels */}
        <text x={260} y={260 - R_OUTER + 14} textAnchor="middle" fill="#9C7A2F" fontSize={10} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>0°</text>
        <text x={260 + R_OUTER - 14} y={264} textAnchor="middle" fill="#9C7A2F" fontSize={10} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>90°</text>
        <text x={260} y={260 + R_OUTER - 6} textAnchor="middle" fill="#A23A1E" fontSize={10} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>180°</text>
        <text x={260 - R_OUTER + 14} y={264} textAnchor="middle" fill="#A23A1E" fontSize={10} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>270°</text>

        {/* ── SUN — image with circular clip + fallback glyph underneath ── */}
        {/* Halo behind sun */}
        <circle cx={260} cy={260} r={SUN_R + 14} fill="url(#sunGlow)" opacity={0.18} filter="url(#sunHalo)" />
        {/* Sun image (clipped to circle) */}
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
        {/* Fallback glyph — visible only if image fails to load */}
        <text x={260} y={260 + 5} textAnchor="middle" fill="#3E2A1F" fontSize={14} fontWeight={800} style={{ fontFamily: "serif", pointerEvents: "none", opacity: 0 }}>☉</text>
        {/* Sun border ring */}
        <circle cx={260} cy={260} r={SUN_R} fill="none" stroke="#E89E2A" strokeWidth={1.2} opacity={0.45} />
        <circle cx={260} cy={260} r={SUN_R + 3} fill="none" stroke="#E89E2A" strokeWidth={0.6} opacity={0.25} />

        {/* ── PREVIEW DOT (hovered segment midpoint) ── */}
        {hoveredSeg !== null && hoveredSeg !== currentSegment && (
          <circle
            cx={260 + previewX}
            cy={260 + previewY}
            r={5}
            fill="rgba(232,158,42,0.35)"
            stroke="#E89E2A"
            strokeWidth={1}
            strokeDasharray="2 2"
            style={{ transition: "all 0.15s ease", pointerEvents: "none" }}
          />
        )}

        {/* ── MOON at active segment midpoint ── */}
        {/* Moon glow */}
        <circle cx={260 + moonX} cy={260 + moonY} r={MOON_R + 10} fill={currentSegment < 15 ? "rgba(232,158,42,0.15)" : "rgba(212,80,46,0.12)"} filter="url(#sunHalo)" />
        {/* Moon body */}
        <circle cx={260 + moonX} cy={260 + moonY} r={MOON_R} fill="url(#moonGrad)" stroke={currentSegment < 15 ? "#E89E2A" : "#D4502E"} strokeWidth={2} filter="url(#softShadow)" />
        {/* Moon glyph fallback (since no dedicated moon image yet) */}
        <text x={260 + moonX} y={260 + moonY + 4} textAnchor="middle" fill="#5A4A3A" fontSize={12} fontWeight={700} style={{ fontFamily: "serif", pointerEvents: "none" }}>☽</text>

        {/* ── Elongation arc ── */}
        {angle > 0 && (
          <>
            <path
              d={`M 260 ${260 - 50} A 50 50 0 ${angle > 180 ? 1 : 0} 1 ${260 + 50 * Math.sin(angle * Math.PI / 180)} ${260 - 50 * Math.cos(angle * Math.PI / 180)}`}
              fill="none"
              stroke="#E89E2A"
              strokeWidth={2}
              strokeDasharray="4 2"
              opacity={0.9}
            />
            <text
              x={260 + 64 * Math.sin(angle * Math.PI / 180)}
              y={260 - 64 * Math.cos(angle * Math.PI / 180)}
              fill="#E89E2A"
              fontSize={12}
              fontWeight={700}
              style={{ fontFamily: "var(--font-sans), sans-serif" }}
            >
              {Math.round(angle)}°
            </text>
          </>
        )}

        {/* Elongation line */}
        <line x1={260} y1={260} x2={260 + moonX} y2={260 + moonY} stroke="rgba(232,158,42,0.28)" strokeWidth={1.2} strokeDasharray="4 3" />

        {/* Active segment midpoint dot */}
        <circle cx={260 + moonX} cy={260 + moonY} r={3} fill="#E89E2A" opacity={0.7} />
      </svg>

      {/* ── HOVER TOOLTIP (HTML overlay, absolute positioned) ── */}
      {hoveredSeg !== null && tooltipPos && (
        <div
          style={{
            position: "absolute",
            left: tooltipPos.x + 16,
            top: tooltipPos.y - 10,
            pointerEvents: "none",
            zIndex: 10,
            background: "rgba(255, 252, 240, 0.96)",
            border: "1px solid rgba(156,122,47,0.25)",
            borderRadius: "8px",
            padding: "8px 12px",
            boxShadow: "0 4px 16px rgba(62,42,31,0.15)",
            minWidth: 140,
          }}
        >
          {(() => {
            const t = tithiForSegment(hoveredSeg);
            return (
              <div>
                <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: t.paksha === "śukla" ? "#9C7A2F" : "#A23A1E", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "3px" }}>
                  {t.paksha === "śukla" ? "Śukla" : "Kṛṣṇa"} {t.displayNum}/15
                </p>
                <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "15px", fontWeight: 600, color: "var(--gl-ink-primary)", lineHeight: 1.2 }}>
                  <IAST>{t.name}</IAST>
                </p>
                <p style={{ fontSize: "11px", color: "var(--gl-ink-muted)", marginTop: "2px" }}>
                  Deity: <IAST>{t.deity}</IAST>
                </p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

/* ─── Main component ─── */
export function TithiAngleVisualizer() {
  const [angle, setAngle] = useState(45);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Animation
  useEffect(() => {
    if (!isAnimating) return;
    const id = setInterval(() => {
      setAngle((a) => (a + 0.5) % 360);
    }, 40);
    return () => clearInterval(id);
  }, [isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIsAnimating(false);
        setAngle((a) => {
          const seg = Math.floor(((a % 360) + 360) % 360 / 12);
          const prevSeg = (seg - 1 + 30) % 30;
          return prevSeg * 12 + 6;
        });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setIsAnimating(false);
        setAngle((a) => {
          const seg = Math.floor(((a % 360) + 360) % 360 / 12);
          const nextSeg = (seg + 1) % 30;
          return nextSeg * 12 + 6;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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

  return (
    <div className="my-6" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* ───── TOP — Header strip with decorative mandala image ───── */}
      <header
        className="gl-surface-twilight-glass"
        style={{
          padding: "16px 22px",
          display: "grid",
          gridTemplateColumns: "auto auto 1fr 1.4fr",
          gap: "20px",
          alignItems: "center",
          borderLeft: `4px solid ${tithi.paksha === "śukla" ? "#C28220" : "#A23A1E"}`,
          transition: "border-color 320ms cubic-bezier(0.32, 0.72, 0.24, 1)",
        }}
      >
        {/* Decorative combined Sun-Moon mandala */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src="/assets/learning/tithi-moon-glyph.png"
            alt="Sūrya-Candra mandala"
            width={48}
            height={48}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center",
              border: "2px solid rgba(201,162,77,0.35)",
              boxShadow: "0 2px 8px rgba(107,68,35,0.15)",
            }}
            onError={(e) => {
              /* Fallback: hide image, show glyph placeholder */
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Fallback placeholder if image fails */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F5C842 0%, #E89E2A 50%, #C47A1A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: -1,
            }}
          >
            ☉☽
          </div>
        </div>

        {/* Pakṣa pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "999px",
            background: tithi.paksha === "śukla" ? "rgba(232, 158, 42, 0.14)" : "rgba(212, 80, 46, 0.12)",
            border: `1px solid ${tithi.paksha === "śukla" ? "rgba(194, 130, 32, 0.45)" : "rgba(162, 58, 30, 0.40)"}`,
            transition: "all 320ms cubic-bezier(0.32, 0.72, 0.24, 1)",
            flexShrink: 0,
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: tithi.paksha === "śukla" ? "#C28220" : "#A23A1E" }} />
          <span style={{ fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.18em", color: tithi.paksha === "śukla" ? "#C28220" : "#A23A1E", fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            {tithi.paksha === "śukla" ? "Śukla Pakṣa" : "Kṛṣṇa Pakṣa"}
          </span>
        </div>

        {/* Tithi number + name */}
        <div>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "4px" }}>
            Current Tithi
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: "22px", color: tithi.paksha === "śukla" ? "#C28220" : "#A23A1E", lineHeight: 1.2, transition: "color 320ms cubic-bezier(0.32, 0.72, 0.24, 1)" }}>
            {tithi.tithiName} <span style={{ fontSize: "16px", color: "var(--gl-ink-muted)" }}>({tithi.displayNumber}/15)</span>
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13.5px", color: "var(--gl-ink-secondary)", marginTop: "2px" }}>
            Deity: <IAST>{tithi.deity}</IAST> · Quality: <IAST>{tithi.quality}</IAST>
          </p>
        </div>

        {/* Live formula context */}
        <div
          style={{
            background: tithi.paksha === "śukla" ? "rgba(232, 158, 42, 0.08)" : "rgba(212, 80, 46, 0.06)",
            border: `1px solid ${tithi.paksha === "śukla" ? "rgba(194, 130, 32, 0.30)" : "rgba(162, 58, 30, 0.25)"}`,
            borderLeft: `3px solid ${tithi.paksha === "śukla" ? "#C28220" : "#A23A1E"}`,
            padding: "12px 14px",
            borderRadius: "0 8px 8px 0",
            transition: "all 320ms cubic-bezier(0.32, 0.72, 0.24, 1)",
          }}
        >
          <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.18em", color: tithi.paksha === "śukla" ? "#C28220" : "#A23A1E", fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "4px" }}>
            Live Formula
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "14.5px", color: "var(--gl-ink-primary)", lineHeight: 1.55 }}>
            Tithi = ⌊{tithi.elongation}° ÷ 12°⌋ + 1 = <strong style={{ color: tithi.paksha === "śukla" ? "#C28220" : "#A23A1E" }}>{tithi.tithiNumber}</strong> · Elapsed: <strong style={{ color: tithi.paksha === "śukla" ? "#C28220" : "#A23A1E" }}>{Math.round(tithi.elapsedFraction * 100)}%</strong>
          </p>
        </div>
      </header>

      {/* ───── MIDDLE — Two-column: Diagram + Data cards ───── */}
      <div
        className="gl-surface-twilight-glass"
        style={{
          padding: "28px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "28px",
          alignItems: "start",
        }}
      >
        {/* LEFT — Orbital diagram */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <OrbitDiagram angle={angle} onAngleChange={setAngle} />

          {/* Controls */}
          <div style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={() => setIsAnimating((v) => !v)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "999px",
                  background: isAnimating ? "rgba(212,80,46,0.12)" : "rgba(232,158,42,0.10)",
                  border: isAnimating ? "1px solid rgba(162,58,30,0.35)" : "1px solid rgba(194,130,32,0.40)",
                  color: isAnimating ? "#A23A1E" : "#9C7A2F",
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 180ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                  whiteSpace: "nowrap",
                }}
              >
                {isAnimating ? "⏹ Stop" : "▶ Animate"}
              </button>
              <input
                type="range"
                min={0}
                max={359}
                value={angle}
                onChange={(e) => { setIsAnimating(false); setAngle(Number(e.target.value)); }}
                style={{ flex: 1, accentColor: tithi.paksha === "śukla" ? "#C28220" : "#A23A1E", cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 84, paddingRight: 4 }}>
              <span style={{ fontSize: "12.5px", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", color: "var(--gl-ink-muted)" }}>0°</span>
              <span style={{ fontSize: "12.5px", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", color: "var(--gl-ink-muted)" }}>180°</span>
              <span style={{ fontSize: "12.5px", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", color: "var(--gl-ink-muted)" }}>360°</span>
            </div>
          </div>

          {/* Presets */}
          <div style={{ width: "100%", maxWidth: 460 }}>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "10px" }}>
              Festival Presets
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {presets.map((p) => {
                const isActive = Math.abs(angle - p.angle) < 6;
                return (
                  <button
                    key={p.label}
                    onClick={() => { setIsAnimating(false); setAngle(p.angle); }}
                    title={p.desc}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      background: isActive ? (p.paksha === "śukla" ? "rgba(232,158,42,0.18)" : "rgba(212,80,46,0.14)") : "rgba(232,158,42,0.05)",
                      border: isActive
                        ? `1.5px solid ${p.paksha === "śukla" ? "#C28220" : "#A23A1E"}`
                        : "1px solid rgba(156,122,47,0.22)",
                      color: isActive ? (p.paksha === "śukla" ? "#8A5E1A" : "#A23A1E") : "#9C7A2F",
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "12px",
                      fontWeight: isActive ? 700 : 600,
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                      transition: "all 180ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Moon image placeholder note */}
          <div
            style={{
              width: "100%",
              maxWidth: 460,
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(156,122,47,0.04)",
              border: "1px dashed rgba(156,122,47,0.18)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "16px" }}>🌙</span>
            <p style={{ fontSize: "12px", color: "var(--gl-ink-muted)", lineHeight: 1.5, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
              <strong>Placeholder:</strong> A dedicated Candra (Moon) glyph image would complete the visual pair.
              The orbiting moon currently uses a stylized SVG circle with the ☽ symbol as fallback.
            </p>
          </div>
        </div>

        {/* RIGHT — Data cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Tithi progress card */}
          <div className="gl-surface-twilight-glass" style={{ padding: "18px 20px", borderLeft: `4px solid ${tithi.paksha === "śukla" ? "#C28220" : "#A23A1E"}` }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
              <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "44px", fontWeight: 600, color: tithi.paksha === "śukla" ? "#C28220" : "#A23A1E", lineHeight: 1 }}>
                {tithi.displayNumber}
              </span>
              <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "18px", color: "var(--gl-ink-muted)" }}>/ 15</span>
            </div>
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "18px", fontWeight: 500, color: "var(--gl-ink-primary)", marginBottom: "4px" }}>
              <IAST>{tithi.tithiName}</IAST>
            </p>
            <p style={{ fontSize: "13px", color: "var(--gl-ink-secondary)", marginBottom: "14px" }}>
              Absolute tithi <strong>{tithi.tithiNumber}</strong> / 30
            </p>
            {/* Progress bar */}
            <div style={{ position: "relative", height: "10px", borderRadius: "999px", overflow: "hidden", background: "rgba(156,122,47,0.10)", marginBottom: "8px" }}>
              <div
                style={{
                  position: "absolute", top: 0, left: 0, height: "100%", borderRadius: "999px",
                  width: `${tithi.elapsedFraction * 100}%`,
                  background: tithi.paksha === "śukla" ? "#C28220" : "#A23A1E",
                  transition: reducedMotion ? "none" : "width 0.15s linear",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: "var(--gl-ink-muted)" }}>
              <span>{Math.round(tithi.elapsedFraction * 100)}% elapsed</span>
              <span>{tithi.remainingPct}% until next (~{tithi.remainingDeg}°)</span>
            </div>
          </div>

          {/* Astronomical data — 2×2 grid */}
          <div className="gl-surface-twilight-glass" style={{ padding: "18px 20px" }}>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "12px" }}>
              Astronomical Data
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(232,158,42,0.05)", border: "1px solid rgba(156,122,47,0.10)" }}>
                <p style={{ fontSize: "11px", color: "var(--gl-ink-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sun-Moon Angle</p>
                <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "22px", fontWeight: 600, color: "var(--gl-ink-primary)" }}>{tithi.elongation}°</p>
              </div>
              <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(232,158,42,0.05)", border: "1px solid rgba(156,122,47,0.10)" }}>
                <p style={{ fontSize: "11px", color: "var(--gl-ink-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>12° Segments</p>
                <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "22px", fontWeight: 600, color: "var(--gl-ink-primary)" }}>{Math.floor(tithi.elongation / 12)}</p>
              </div>
              <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(232,158,42,0.05)", border: "1px solid rgba(156,122,47,0.10)" }}>
                <p style={{ fontSize: "11px", color: "var(--gl-ink-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Quality</p>
                <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: "var(--gl-ink-primary)" }}><IAST>{tithi.quality}</IAST></p>
              </div>
              <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(232,158,42,0.05)", border: "1px solid rgba(156,122,47,0.10)" }}>
                <p style={{ fontSize: "11px", color: "var(--gl-ink-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Ruling Deity</p>
                <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: "var(--gl-ink-primary)" }}><IAST>{tithi.deity}</IAST></p>
              </div>
            </div>
          </div>

          {/* Pañcāṅga reading */}
          <div className="gl-surface-twilight-glass" style={{ padding: "18px 20px" }}>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "12px" }}>
              Pañcāṅga Reading
            </p>
            <div style={{ padding: "12px 14px", borderRadius: "8px", background: "rgba(232,158,42,0.05)", borderLeft: `3px solid ${tithi.paksha === "śukla" ? "#C28220" : "#A23A1E"}`, marginBottom: "10px" }}>
              <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 500, color: "var(--gl-ink-primary)" }}>
                <IAST>{tithi.paksha === "śukla" ? "Śukla" : "Kṛṣṇa"}</IAST> <IAST>{tithi.tithiName}</IAST>
                <span style={{ color: "var(--gl-ink-muted)", fontSize: "14px" }}> ({tithi.displayNumber}/15)</span>
              </p>
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--gl-ink-muted)", lineHeight: 1.6, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
              At sunrise on this day, the pañcāṅga would list this tithi as the primary limb.
              The tithi ends when the Moon advances another {tithi.remainingDeg}° beyond the current {tithi.elongation}° separation.
            </p>
          </div>

          {/* Operational distinction */}
          <div className="gl-surface-twilight-glass" style={{ padding: "18px 20px" }}>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "12px" }}>
              Operational Distinction
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, background: "rgba(232,158,42,0.15)", color: "#9C7A2F", fontFamily: "var(--font-sans), sans-serif" }}>P</span>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--gl-ink-primary)", marginBottom: "2px" }}>Pañcāṅga-tithi</p>
                  <p style={{ fontSize: "12px", color: "var(--gl-ink-muted)", lineHeight: 1.5 }}>
                    Sunrise-anchored. Used for <strong>daily ritual, festival-day determination, vrata observance</strong>.
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, background: "rgba(212,80,46,0.12)", color: "#A23A1E", fontFamily: "var(--font-sans), sans-serif" }}>I</span>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--gl-ink-primary)", marginBottom: "2px" }}>Instantaneous-tithi</p>
                  <p style={{ fontSize: "12px", color: "var(--gl-ink-muted)", lineHeight: 1.5 }}>
                    At this precise clock-moment. Used for <strong>natal-chart recording, muhūrta-election</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── BOTTOM — Instruction text ───── */}
      {!reducedMotion && (
        <p
          className="text-xs italic text-center"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-muted)",
          }}
        >
          Click the orbit ring or drag the slider to set Moon position. Use ← → arrow keys to step between tithis.
          Hover over any segment to preview its tithi. Tap a festival preset to jump to a canonical tithi.
        </p>
      )}
    </div>
  );
}
