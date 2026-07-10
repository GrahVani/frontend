"use client";

import { useState, useMemo } from "react";
import { Orbit, Calculator, BookOpen, ChevronRight, RotateCcw } from "lucide-react";

/* ─── Epoch data ─── */
interface Epoch {
  year: number;
  label: string;
  poleStar: string;
  ayanamsha: string;
  note?: string;
}

const EPOCHS: Epoch[] = [
  { year: -3000, label: "3000 BCE", poleStar: "Thuban (α Draconis)", ayanamsha: "≈ −46°", note: "Pyramid-era pole star" },
  { year: -1000, label: "1000 BCE", poleStar: "Kochab (β UMi)", ayanamsha: "≈ −18°", note: "Vedic-period sky" },
  { year: 0, label: "0 CE", poleStar: "Between Thuban and Polaris", ayanamsha: "≈ −4°", note: "Start of common era" },
  { year: 285, label: "285 CE", poleStar: "Approaching Polaris", ayanamsha: "≈ 0°", note: "Lahiri alignment epoch" },
  { year: 575, label: "575 CE", poleStar: "Approaching Polaris", ayanamsha: "≈ 4°", note: "Varāhamihira's lifetime" },
  { year: 1000, label: "1000 CE", poleStar: "Approaching Polaris", ayanamsha: "≈ 10°", note: "Medieval period" },
  { year: 1900, label: "1900 CE", poleStar: "Polaris", ayanamsha: "22°26′", note: "Industrial era" },
  { year: 2026, label: "2026 CE", poleStar: "Polaris", ayanamsha: "24°11′", note: "Present day" },
  { year: 12000, label: "12000 CE", poleStar: "Vega (α Lyrae)", ayanamsha: "—", note: "Future pole star" },
];

/* ─── Hotspot data ─── */
interface Hotspot {
  id: string;
  cx: number;
  cy: number;
  r: number;
  label: string;
  color: string;
  content: React.ReactNode;
}

/* ─── Helpers ─── */
function toDMS(decimalDeg: number): string {
  const d = Math.floor(decimalDeg);
  const mFull = (decimalDeg - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return `${d}°${m}′${s}″`;
}

export function PrecessionVisualizer() {
  const [epochIdx, setEpochIdx] = useState(7); // 2026 CE
  const [activeHotspot, setActiveHotspot] = useState<string | null>("axis");
  const [calcYear, setCalcYear] = useState<string>("2026");
  const [calcSteps, setCalcSteps] = useState<{ year: number; elapsed: number; div: number; dms: string } | null>(null);
  const [tab, setTab] = useState<"visual" | "calculator" | "classical">("visual");

  const epoch = EPOCHS[epochIdx];

  // Precession angle for visualization (0 at 285 CE, grows linearly)
  const precessionAngle = useMemo(() => {
    const elapsed = epoch.year - 285;
    return (elapsed / 72) * 6; // scaled for visual rotation (6° per degree of precession)
  }, [epoch.year]);

  const handleCalc = () => {
    const y = parseInt(calcYear, 10);
    if (Number.isNaN(y)) return;
    const elapsed = y - 285;
    const div = elapsed / 72;
    setCalcSteps({ year: y, elapsed, div, dms: toDMS(div) });
  };

  const hotspots: Hotspot[] = useMemo(
    () => [
      {
        id: "axis",
        cx: 245,
        cy: 145,
        r: 16,
        label: "Earth's Axis",
        color: "#C28220",
        content: (
          <div>
            <p className="text-sm mb-2" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.6 }}>
              <strong>Earth's rotation axis</strong> is tilted ~23.4° from perpendicular to its orbital plane. This tilt is what creates seasons. But the axis itself slowly wobbles — tracing a cone in space over ~25,772 years.
            </p>
            <p className="text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.6 }}>
              <em>Current epoch ({epoch.label}):</em> The axis points near <strong>{epoch.poleStar}</strong>.
            </p>
          </div>
        ),
      },
      {
        id: "cone",
        cx: 165,
        cy: 55,
        r: 15,
        label: "Precession Cone",
        color: "#4A6FA5",
        content: (
          <div>
            <p className="text-sm mb-2" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.6 }}>
              The <strong>precession cone</strong> is the path traced by Earth's axis over ~25,772 years. Think of a spinning top slowly wobbling — the spin axis traces a cone as gravity pulls on it.
            </p>
            <p className="text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.6 }}>
              Full cycle: <strong>~25,772 years</strong> · Rate: <strong>~50.29 arc-sec/year</strong> (~1° per 71.6 years)
            </p>
          </div>
        ),
      },
      {
        id: "bulge",
        cx: 280,
        cy: 295,
        r: 15,
        label: "Equatorial Bulge",
        color: "#2F8C5A",
        content: (
          <div>
            <p className="text-sm mb-2" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.6 }}>
              Earth is not a perfect sphere — it <strong>bulges at the equator</strong> by ~21 km. This extra mass is what the Sun and Moon's gravity pulls on, creating the torque that causes precession.
            </p>
            <p className="text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.6 }}>
              No equatorial bulge = no gravitational torque = no precession. The bulge is essential.
            </p>
          </div>
        ),
      },
      {
        id: "equinox",
        cx: 310,
        cy: 375,
        r: 15,
        label: "Equinox Point",
        color: "#A23A1E",
        content: (
          <div>
            <p className="text-sm mb-2" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.6 }}>
              The <strong>equinox points</strong> are where the celestial equator crosses the ecliptic. As Earth's axis precesses, the celestial equator rotates — so these intersection points <strong>drift westward</strong> against the fixed stars.
            </p>
            <p className="text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.6 }}>
              This drift is why the tropical zodiac (anchored to equinoxes) slowly separates from the sidereal zodiac (anchored to fixed stars).
            </p>
          </div>
        ),
      },
      {
        id: "sun",
        cx: 665,
        cy: 120,
        r: 16,
        label: "Sun's Gravity",
        color: "#CC9028",
        content: (
          <div>
            <p className="text-sm mb-2" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.6 }}>
              The <strong>Sun</strong> provides the primary gravitational torque on Earth's equatorial bulge. Its pull tries to align Earth's equator with the orbital plane — but Earth's spin angular momentum resists.
            </p>
            <p className="text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.6 }}>
              The Sun alone would cause precession — but the Moon contributes about <strong>2/3 of the total torque</strong> because it is much closer to Earth.
            </p>
          </div>
        ),
      },
      {
        id: "moon",
        cx: 475,
        cy: 80,
        r: 13,
        label: "Moon's Gravity",
        color: "#6F4FA8",
        content: (
          <div>
            <p className="text-sm mb-2" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.6 }}>
              The <strong>Moon</strong> contributes about two-thirds of the gravitational torque that causes precession — despite being much less massive than the Sun, it is ~390× closer to Earth.
            </p>
            <p className="text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.6 }}>
              Without the Moon, Earth's precession would be much slower (~49,000 years per cycle instead of ~25,772).
            </p>
          </div>
        ),
      },
    ],
    [epoch]
  );

  const activeContent = hotspots.find((h) => h.id === activeHotspot)?.content ?? null;

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        borderRadius: "18px",
        padding: "28px",
        maxWidth: "960px",
        margin: "0 auto",
        border: "1px solid rgba(156, 122, 47, 0.18)",
        boxShadow: "0 14px 40px rgba(62, 42, 31, 0.10)",
      }}
    >
      {/* ── Tab bar ── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { key: "visual" as const, label: "Precession Visual", icon: <Orbit size={15} /> },
          { key: "calculator" as const, label: "By-Hand Calculator", icon: <Calculator size={15} /> },
          { key: "classical" as const, label: "Classical vs Modern", icon: <BookOpen size={15} /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              letterSpacing: "0.04em",
              transition: "all 180ms ease",
              background: tab === t.key ? "#C28220" : "rgba(156, 122, 47, 0.10)",
              color: tab === t.key ? "#FFF" : "#9C7A2F",
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TAB 1 — Precession Visual (interactive SVG)
         ═══════════════════════════════════════════════════════════ */}
      {tab === "visual" && (
        <div>
          {/* Epoch slider */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--gl-ink-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Epoch
              </span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#C28220", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                {epoch.label} · {epoch.poleStar}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={EPOCHS.length - 1}
              step={1}
              value={epochIdx}
              onChange={(e) => setEpochIdx(parseInt(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#C28220",
                cursor: "pointer",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ fontSize: "10px", color: "var(--gl-ink-muted)" }}>3000 BCE</span>
              <span style={{ fontSize: "10px", color: "var(--gl-ink-muted)" }}>12000 CE</span>
            </div>
          </div>

          {/* SVG diagram */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 460px", minWidth: 0 }}>
              <svg viewBox="0 0 720 420" style={{ width: "100%", height: "auto", display: "block" }}>
                <defs>
                  <radialGradient id="earthGrad" cx="35%" cy="35%">
                    <stop offset="0%" stopColor="#4A9683" />
                    <stop offset="60%" stopColor="#2A6E80" />
                    <stop offset="100%" stopColor="#1A4A55" />
                  </radialGradient>
                  <radialGradient id="sunGrad">
                    <stop offset="0%" stopColor="#FFE4A1" />
                    <stop offset="40%" stopColor="#CC9028" />
                    <stop offset="100%" stopColor="#8B5A2B" />
                  </radialGradient>
                  <marker id="arrowGold" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8" fill="#CC9028" />
                  </marker>
                  <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8" fill="#6F4FA8" />
                  </marker>
                </defs>

                {/* Background */}
                <rect width="720" height="420" fill="transparent" rx="12" />

                {/* Stars (fixed background) */}
                <g opacity="0.5">
                  {[...Array(30)].map((_, i) => (
                    <circle key={i} cx={50 + (i * 23) % 640} cy={30 + (i * 17) % 360} r={0.8 + (i % 3) * 0.4} fill="#C4B49A" />
                  ))}
                </g>

                {/* ═══════ INFO BADGE — drawn early so lines/text paint ON TOP ═══════ */}
                <g transform="translate(20, 16)">
                  <rect x="0" y="0" width="248" height="82" rx="10" fill="rgba(252, 245, 224, 0.92)" stroke="rgba(156, 122, 47, 0.22)" strokeWidth="1" />
                  <text x="14" y="22" fontSize="11" fill="#9C7A2F" fontWeight="700" fontFamily="var(--font-sans), sans-serif" letterSpacing="0.06em">CURRENT EPOCH</text>
                  <text x="14" y="44" fontSize="15" fill="#5A4A32" fontWeight="600" fontFamily="var(--font-sans), sans-serif">{epoch.label}</text>
                  <text x="14" y="62" fontSize="11" fill="#7A6A52" fontFamily="var(--font-sans), sans-serif">Pole: {epoch.poleStar}</text>
                  <text x="14" y="78" fontSize="12" fill="#C28220" fontWeight="700" fontFamily="var(--font-sans), sans-serif">Ayanāṁśa: {epoch.ayanamsha}</text>
                </g>

                {/* ═══════ ECLIPTIC (bottom horizontal reference) ═══════ */}
                <line x1="60" y1="340" x2="580" y2="340" stroke="#C4B49A" strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
                <text x="60" y="358" fontSize="12" fill="#8A7A60" fontWeight="600" fontFamily="var(--font-sans), sans-serif">Ecliptic plane</text>

                {/* ═══════ CELESTIAL EQUATOR (rotates with precession) ═══════ */}
                <g transform={`rotate(${-precessionAngle * 0.3}, 200, 250)`}>
                  <line x1="80" y1="250" x2="340" y2="250" stroke="#4A6FA5" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
                  {/* Label placed LEFT of the line so it never swings into Earth */}
                  <text x="12" y="254" fontSize="12" fill="#3D5A80" fontWeight="600" fontFamily="var(--font-sans), sans-serif" opacity="0.95">Celestial equator</text>
                </g>

                {/* ═══════ PRECESSION CONE (dashed arc) ═══════ */}
                <path
                  d="M 200,250 L 200,60 A 120,40 0 0,1 200,140 A 120,40 0 0,0 200,60"
                  fill="none"
                  stroke="#4A6FA5"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0.5"
                />
                <text x="258" y="50" fontSize="12" fill="#3D5A80" fontWeight="600" fontFamily="var(--font-sans), sans-serif" opacity="0.95">Precession cone</text>

                {/* ═══════ EARTH ═══════ */}
                <circle cx="200" cy="250" r="45" fill="url(#earthGrad)" stroke="#2A6E80" strokeWidth="2" />

                {/* Equatorial bulge indicator */}
                <ellipse cx="200" cy="250" rx="48" ry="8" fill="none" stroke="#2F8C5A" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.7" />

                {/* ═══════ EARTH'S AXIS (rotates with precession) ═══════ */}
                <line
                  x1="200"
                  y1="250"
                  x2={200 + Math.sin((precessionAngle * Math.PI) / 180) * 80}
                  y2={160 - Math.abs(Math.cos((precessionAngle * Math.PI) / 180)) * 20}
                  stroke="#C28220"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Axis arrow tip */}
                <circle
                  cx={200 + Math.sin((precessionAngle * Math.PI) / 180) * 80}
                  cy={160 - Math.abs(Math.cos((precessionAngle * Math.PI) / 180)) * 20}
                  r="4"
                  fill="#C28220"
                />
                {/* North label — offset diagonally so it never overlaps axis or hotspot */}
                <text
                  x={200 + Math.sin((precessionAngle * Math.PI) / 180) * 106}
                  y={158 - Math.abs(Math.cos((precessionAngle * Math.PI) / 180)) * 20}
                  fontSize="14"
                  fill="#C28220"
                  fontWeight="800"
                  fontFamily="var(--font-sans), sans-serif"
                  style={{ pointerEvents: "none" }}
                >
                  N
                </text>

                {/* ═══════ SUN (top right) ═══════ */}
                <circle cx="620" cy="120" r="28" fill="url(#sunGrad)" />
                {/* Label well above sun */}
                <text x="596" y="74" fontSize="14" fill="#B07820" fontWeight="700" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>Sun</text>

                {/* ═══════ MOON (above sun, left) ═══════ */}
                <circle cx="520" cy="80" r="12" fill="#D4C4E0" stroke="#6F4FA8" strokeWidth="1.5" />
                {/* Label well above moon */}
                <text x="500" y="54" fontSize="12" fill="#5A3D8A" fontWeight="700" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>Moon</text>

                {/* ═══════ GRAVITATIONAL TORQUE ARROWS ═══════ */}
                <path d="M 565,105 Q 580,130 590,150" fill="none" stroke="#CC9028" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5" markerEnd="url(#arrowGold)" />
                <path d="M 490,95 Q 460,120 440,160" fill="none" stroke="#6F4FA8" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5" markerEnd="url(#arrowPurple)" />

                {/* ═══════ EQUINOX MARKER (static, small) ═══════ */}
                <circle cx="340" cy="340" r="5" fill="#A23A1E" stroke="#FFF" strokeWidth="1.5" />
                {/* Static label offset below-right so hotspot label won't collide */}
                <text x="354" y="358" fontSize="12" fill="#A23A1E" fontWeight="700" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>♈ Equinox</text>

                {/* ═══════ HOTSPOTS (clickable, offset from shapes & labels) ═══════ */}
                {hotspots.map((h) => {
                  const isActive = activeHotspot === h.id;
                  return (
                    <g key={h.id} style={{ cursor: "pointer" }} onClick={() => setActiveHotspot(h.id)}>
                      <circle
                        cx={h.cx}
                        cy={h.cy}
                        r={h.r}
                        fill={isActive ? `${h.color}40` : `${h.color}18`}
                        stroke={h.color}
                        strokeWidth={isActive ? 2.5 : 1.5}
                      >
                        <animate attributeName="r" values={`${h.r};${h.r + 3};${h.r}`} dur="2s" repeatCount="indefinite" />
                      </circle>
                      {/* Label with small background pill for readability */}
                      <g transform={`translate(${h.cx}, ${h.cy + h.r + 18})`}>
                        <rect
                          x={-((h.label.length * 6.8) + 12) / 2}
                          y={-12}
                          width={(h.label.length * 6.8) + 12}
                          height="20"
                          rx="10"
                          fill="rgba(255, 253, 245, 0.95)"
                          stroke={h.color}
                          strokeWidth="0.8"
                          opacity={0.95}
                        />
                        <text
                          textAnchor="middle"
                          fontSize="11"
                          fill={h.color}
                          fontWeight={isActive ? 700 : 600}
                          fontFamily="var(--font-sans), sans-serif"
                          dy="1"
                          style={{ pointerEvents: "none" }}
                        >
                          {h.label}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Info panel */}
            <div style={{ flex: "1 1 280px", minWidth: 0 }}>
              <div
                style={{
                  background: "rgba(156, 122, 47, 0.06)",
                  borderRadius: "14px",
                  padding: "18px",
                  border: "1px solid rgba(156, 122, 47, 0.12)",
                }}
              >
                <h4
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "var(--gl-ink-primary)",
                    marginBottom: "12px",
                  }}
                >
                  {hotspots.find((h) => h.id === activeHotspot)?.label ?? "Select a point"}
                </h4>
                <div style={{ fontSize: "13px", lineHeight: 1.6 }}>{activeContent}</div>
              </div>

              {/* Quick facts */}
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Precession period", value: "~25,772 years" },
                  { label: "Rate", value: "~50.29″ / year" },
                  { label: "By-hand rate", value: "~1° / 72 years" },
                  { label: "Years per sign", value: "~2,148 years" },
                ].map((f) => (
                  <div
                    key={f.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: "rgba(74, 111, 165, 0.06)",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "var(--gl-ink-muted)", fontWeight: 500 }}>{f.label}</span>
                    <span style={{ fontSize: "12px", color: "#4A6FA5", fontWeight: 700 }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 2 — By-Hand Calculator
         ═══════════════════════════════════════════════════════════ */}
      {tab === "calculator" && (
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h4
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "22px",
                fontWeight: 600,
                color: "var(--gl-ink-primary)",
                marginBottom: "6px",
              }}
            >
              By-Hand Precession Calculator
            </h4>
            <p style={{ fontSize: "13px", color: "var(--gl-ink-secondary)", lineHeight: 1.5 }}>
              Formula: <code style={{ color: "#C28220", fontWeight: 700 }}>(Year − 285) ÷ 72</code> = approximate ayanāṁśa in degrees
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "28px",
            }}
          >
            <input
              type="number"
              value={calcYear}
              onChange={(e) => setCalcYear(e.target.value)}
              placeholder="Enter year (e.g. 2026)"
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(156, 122, 47, 0.3)",
                background: "rgba(252, 245, 224, 0.5)",
                color: "var(--gl-ink-primary)",
                fontSize: "15px",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                width: "160px",
                textAlign: "center",
                outline: "none",
              }}
            />
            <button
              onClick={handleCalc}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#C28220",
                color: "#FFF",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              <ChevronRight size={15} />
              Calculate
            </button>
            <button
              onClick={() => {
                setCalcYear("2026");
                setCalcSteps(null);
              }}
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(156, 122, 47, 0.25)",
                background: "transparent",
                color: "#9C7A2F",
                cursor: "pointer",
              }}
              title="Reset"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {calcSteps && (
            <div
              style={{
                background: "rgba(194, 130, 32, 0.06)",
                borderRadius: "14px",
                padding: "22px",
                border: "1px solid rgba(194, 130, 32, 0.15)",
              }}
            >
              <h5
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#C28220",
                  marginBottom: "16px",
                }}
              >
                Step-by-step for Year {calcSteps.year}
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { step: 1, text: `Subtract alignment epoch`, math: `${calcSteps.year} − 285 = ${calcSteps.elapsed} years elapsed` },
                  { step: 2, text: `Divide by 72 (1°/72-year rate)`, math: `${calcSteps.elapsed} ÷ 72 = ${calcSteps.div.toFixed(4)}°` },
                  { step: 3, text: `Convert to degrees-minutes-seconds`, math: calcSteps.dms },
                ].map((s) => (
                  <div key={s.step} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "26px",
                        height: "26px",
                        borderRadius: "999px",
                        background: "#C28220",
                        color: "#FFF",
                        fontSize: "12px",
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      {s.step}
                    </span>
                    <div>
                      <p style={{ fontSize: "13px", color: "var(--gl-ink-primary)", fontWeight: 600, marginBottom: "2px" }}>{s.text}</p>
                      <p style={{ fontSize: "14px", color: "#C28220", fontWeight: 700, fontFamily: "monospace" }}>{s.math}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: "18px",
                  padding: "14px",
                  background: "rgba(255, 255, 255, 0.6)",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "11px", color: "var(--gl-ink-muted)", marginBottom: "4px" }}>Approximate Lahiri-style ayanāṁśa</p>
                <p style={{ fontSize: "24px", fontWeight: 700, color: "#C28220", fontFamily: "var(--font-cormorant), serif" }}>
                  {calcSteps.dms}
                </p>
                <p style={{ fontSize: "11px", color: "var(--gl-ink-muted)", marginTop: "4px" }}>
                  ({calcSteps.div.toFixed(4)}° decimal)
                </p>
              </div>
            </div>
          )}

          {/* Reference table */}
          <div style={{ marginTop: "28px" }}>
            <h5
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--gl-ink-primary)",
                marginBottom: "12px",
              }}
            >
              Reference values
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { year: 285, dms: "0°00′", note: "Alignment epoch" },
                { year: 575, dms: "4°02′", note: "Varāhamihira" },
                { year: 1900, dms: "22°26′", note: "—" },
                { year: 1985, dms: "23°37′", note: "Common birth year" },
                { year: 2026, dms: "24°11′", note: "Present" },
                { year: 2050, dms: "24°31′", note: "Near future" },
              ].map((r) => (
                <div
                  key={r.year}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: r.year === 2026 ? "rgba(194, 130, 32, 0.08)" : "transparent",
                    border: r.year === 2026 ? "1px solid rgba(194, 130, 32, 0.2)" : "1px solid transparent",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "var(--gl-ink-primary)", fontWeight: 500, width: "60px" }}>{r.year} CE</span>
                  <span style={{ fontSize: "13px", color: "#C28220", fontWeight: 700, fontFamily: "monospace", flex: 1, textAlign: "center" }}>{r.dms}</span>
                  <span style={{ fontSize: "11px", color: "var(--gl-ink-muted)", fontStyle: "italic", width: "140px", textAlign: "right" }}>{r.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 3 — Classical vs Modern
         ═══════════════════════════════════════════════════════════ */}
      {tab === "classical" && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h4
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "22px",
                fontWeight: 600,
                color: "var(--gl-ink-primary)",
                marginBottom: "6px",
              }}
            >
              Two Models, Both Honoured
            </h4>
            <p style={{ fontSize: "13px", color: "var(--gl-ink-secondary)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.5 }}>
              Classical Indian astronomy (Sūrya Siddhānta) described precession via <em>trepidation</em> — back-and-forth oscillation.
              Modern astronomy uses <em>continuous precession</em> — a full 360° rotation. Both layers are honoured.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {/* Classical card */}
            <div
              style={{
                background: "rgba(74, 111, 165, 0.06)",
                borderRadius: "14px",
                padding: "22px",
                border: "1px solid rgba(74, 111, 165, 0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "#4A6FA5",
                    color: "#FFF",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  SS
                </span>
                <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "18px", fontWeight: 600, color: "#4A6FA5" }}>
                  Sūrya Siddhānta — Trepidation
                </h5>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--gl-ink-primary)", lineHeight: 1.6 }}>
                <p>
                  <strong>Model:</strong> The equinox point oscillates <em>back and forth</em> through a 27° arc — not a full rotation.
                </p>
                <p>
                  <strong>Period:</strong> ~7,200 years for one full oscillation cycle.
                </p>
                <p>
                  <strong>Source:</strong> Spaṣṭādhyāya 3.9-10 —{" "}
                  <em>"ayanaṁ gacchati prācyaṁ pratīcyaṁ cā-ayanaṁ bhavet"</em>{" "}
                  (the ayana moves east AND west).
                </p>
                <p style={{ color: "var(--gl-ink-secondary)" }}>
                  <strong>Status:</strong> Historically appropriate pre-Newton model. Real classical Indian astronomical material, empirically attempted with available data.
                </p>
              </div>
            </div>

            {/* Modern card */}
            <div
              style={{
                background: "rgba(47, 140, 90, 0.06)",
                borderRadius: "14px",
                padding: "22px",
                border: "1px solid rgba(47, 140, 90, 0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "#2F8C5A",
                    color: "#FFF",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  IAU
                </span>
                <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "18px", fontWeight: 600, color: "#2F8C5A" }}>
                  Modern — Continuous Precession
                </h5>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--gl-ink-primary)", lineHeight: 1.6 }}>
                <p>
                  <strong>Model:</strong> Earth's axis traces a <em>full circular cone</em> through 360° — continuous unidirectional rotation.
                </p>
                <p>
                  <strong>Period:</strong> ~25,772 years for one full 360° cycle.
                </p>
                <p>
                  <strong>Source:</strong> IAU 2006 Precession (P03) model + Newtonian gravitational theory + relativistic corrections.
                </p>
                <p style={{ color: "var(--gl-ink-secondary)" }}>
                  <strong>Status:</strong> Established post-Newton consensus. Empirically verified by centuries of astrometric observation. Used by all modern Vedic-astrology software.
                </p>
              </div>
            </div>
          </div>

          {/* Honest framing banner */}
          <div
            style={{
              marginTop: "20px",
              padding: "16px 20px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(194, 130, 32, 0.08), rgba(156, 122, 47, 0.04))",
              border: "1px solid rgba(194, 130, 32, 0.15)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "14px", color: "var(--gl-ink-primary)", fontWeight: 500, lineHeight: 1.6 }}>
              <strong>Both layers honoured:</strong> Sūrya Siddhānta's trepidation as{" "}
              <em>historical Indian astronomical contribution</em> · Modern continuous-precession as{" "}
              <em>current operational consensus</em>. The curriculum operates on the modern model for calculative work and acknowledges the classical model for historical context.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
