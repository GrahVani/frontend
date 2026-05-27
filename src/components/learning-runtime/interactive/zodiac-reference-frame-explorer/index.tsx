"use client";

import { useState } from "react";
import { Eye, EyeOff, RotateCcw } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_MUTED = "var(--gl-ink-muted)";

const SIGNS = [
  { name: "Aries", symbol: "♈", start: 0, element: "fire" },
  { name: "Taurus", symbol: "♉", start: 30, element: "earth" },
  { name: "Gemini", symbol: "♊", start: 60, element: "air" },
  { name: "Cancer", symbol: "♋", start: 90, element: "water" },
  { name: "Leo", symbol: "♌", start: 120, element: "fire" },
  { name: "Virgo", symbol: "♍", start: 150, element: "earth" },
  { name: "Libra", symbol: "♎", start: 180, element: "air" },
  { name: "Scorpio", symbol: "♏", start: 210, element: "water" },
  { name: "Sagittarius", symbol: "♐", start: 240, element: "fire" },
  { name: "Capricorn", symbol: "♑", start: 270, element: "earth" },
  { name: "Aquarius", symbol: "♒", start: 300, element: "air" },
  { name: "Pisces", symbol: "♓", start: 330, element: "water" },
];

const AYANAMSHA = 24.18;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const p1 = polar(cx, cy, r, startDeg);
  const p2 = polar(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
}

function arcRingPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const p1 = polar(cx, cy, r, startDeg);
  const p2 = polar(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y}`;
}

/** Which tropical sign sits in a given sidereal sector centre */
function tropicalSignAt(siderealDeg: number) {
  const t = ((siderealDeg - AYANAMSHA) % 360 + 360) % 360;
  return SIGNS[Math.floor(t / 30) % 12];
}

export function ZodiacReferenceFrameExplorer() {
  const [showSidereal, setShowSidereal] = useState(true);
  const [showTropical, setShowTropical] = useState(true);
  const [showGap, setShowGap] = useState(true);
  const [activeTip, setActiveTip] = useState<string>("gap");
  const [selectedSign, setSelectedSign] = useState<number | null>(null);
  const [hoveredSign, setHoveredSign] = useState<number | null>(null);

  const CX = 260;
  const CY = 260;
  const R_OUTER = 210;
  const R_INNER = 155;
  const R_LABEL = 238;
  const R_TROP_OUTER = 140;
  const R_TROP_INNER = 100;
  const R_ECLIPTIC = 88;

  const tips: Record<string, { title: string; color: string; body: string }> = {
    gap: {
      title: "The Ayanāṁśa Gap",
      color: VERMILION,
      body: "The ~24° angular distance between tropical 0° Aries (Vernal Equinox) and sidereal 0° Aries (fixed-star reference). This gap grows by ~1° every 72 years due to precession.",
    },
    sidereal: {
      title: "Sidereal 0° Aries",
      color: GOLD,
      body: "Anchored to fixed stars. In the Lahiri system, this point is near Revatī (ζ Piscium). The sidereal zodiac does not drift — it remains fixed against the stellar background.",
    },
    tropical: {
      title: "Tropical 0° Aries",
      color: INDIGO,
      body: "Anchored to the Vernal Equinox — the moment when the Sun crosses the celestial equator moving northward. Because Earth's axis precesses, this point drifts westward against the fixed stars.",
    },
    earth: {
      title: "Earth's Axis Tilt",
      color: JADE,
      body: "Earth's rotation axis is tilted ~23.4° from perpendicular to its orbital plane. This tilt creates seasons and is also the cause of precession — the slow ~25,772-year wobble that drives the sidereal-tropical gap.",
    },
  };

  const active = (() => {
    if (selectedSign !== null) {
      const s = SIGNS[selectedSign];
      const t = tropicalSignAt(s.start + 15);
      return {
        title: `${s.symbol} Sidereal ${s.name}`,
        color: GOLD,
        body: `This sidereal sector spans ${s.start}°–${s.start + 30}°. Because of the ${AYANAMSHA}° ayanāṁśa, the tropical zodiac currently overlays ${t.symbol} ${t.name} on this same patch of sky. Click another sign to compare, or use the buttons below for the big picture.`,
      };
    }
    return tips[activeTip];
  })();

  const handleHotspot = (key: string) => {
    setSelectedSign(null);
    setActiveTip(key);
  };

  const handleSignClick = (i: number) => {
    setSelectedSign(i);
  };

  return (
    <div style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      {/* Toggles */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <Toggle active={showSidereal} onClick={() => setShowSidereal((v) => !v)} color={GOLD} label="Sidereal" />
        <Toggle active={showTropical} onClick={() => setShowTropical((v) => !v)} color={INDIGO} label="Tropical" />
        <Toggle active={showGap} onClick={() => setShowGap((v) => !v)} color={VERMILION} label="Ayanāṁśa Gap" />
        <button
          onClick={() => { setShowSidereal(true); setShowTropical(true); setShowGap(true); setSelectedSign(null); setActiveTip("gap"); }}
          style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "4px", padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.2)", background: "transparent", color: "#9C7A2F", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* SVG */}
        <div style={{ flex: "1 1 420px", minWidth: 0 }}>
          <svg viewBox="0 0 520 520" style={{ width: "100%", height: "auto", display: "block" }}>
            <defs>
              <radialGradient id="earthGrad" cx="35%" cy="35%">
                <stop offset="0%" stopColor="#4A9683" />
                <stop offset="60%" stopColor="#2A6E80" />
                <stop offset="100%" stopColor="#1A4A55" />
              </radialGradient>
            </defs>

            {/* Outer faint boundary */}
            <circle cx={CX} cy={CY} r={R_OUTER + 22} fill="none" stroke="rgba(90,74,50,0.12)" strokeWidth="1.5" />

            {/* ===== SIDEREAL OUTER RING (clickable pie sectors) ===== */}
            {showSidereal && SIGNS.map((s, i) => {
              const start = s.start;
              const end = s.start + 30;
              const mid = s.start + 15;
              const isHover = hoveredSign === i;
              const isSelected = selectedSign === i;
              const fills: Record<string, string> = {
                fire: isSelected ? "#FFEDD5" : isHover ? "#FFF0E0" : "#FFF8F0",
                earth: isSelected ? "#DCF5DC" : isHover ? "#E8F5E8" : "#F4FAF4",
                air: isSelected ? "#FFF5CC" : isHover ? "#FFF8D9" : "#FFFDF5",
                water: isSelected ? "#DDE8FF" : isHover ? "#E8EFFF" : "#F5F8FF",
              };
              const strokeColors: Record<string, string> = {
                fire: "#D4A574",
                earth: "#7DB87D",
                air: "#C4B56E",
                water: "#7A9BCF",
              };
              const symPos = polar(CX, CY, (R_INNER + R_OUTER) / 2 + 4, mid);
              const namePos = polar(CX, CY, R_LABEL, mid);
              return (
                <g
                  key={`s-${i}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSignClick(i)}
                  onMouseEnter={() => setHoveredSign(i)}
                  onMouseLeave={() => setHoveredSign(null)}
                >
                  {/* Sector wedge */}
                  <path
                    d={arcPath(CX, CY, R_OUTER, start, end)}
                    fill={fills[s.element]}
                    stroke={isSelected ? GOLD : strokeColors[s.element]}
                    strokeWidth={isSelected ? 2.5 : 1}
                  />
                  {/* Inner radial line */}
                  <line
                    x1={polar(CX, CY, R_INNER, start).x}
                    y1={polar(CX, CY, R_INNER, start).y}
                    x2={polar(CX, CY, R_OUTER, start).x}
                    y2={polar(CX, CY, R_OUTER, start).y}
                    stroke={isSelected ? GOLD : strokeColors[s.element]}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  {/* Symbol */}
                  <text
                    x={symPos.x}
                    y={symPos.y + 5}
                    textAnchor="middle"
                    fontSize="14"
                    fill={isSelected ? GOLD : "#6B5B3D"}
                    fontWeight={700}
                    fontFamily="var(--font-sans), sans-serif"
                    style={{ pointerEvents: "none" }}
                  >
                    {s.symbol}
                  </text>
                  {/* Name label outside */}
                  <text
                    x={namePos.x}
                    y={namePos.y + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fill={isSelected ? GOLD : "#5A4A32"}
                    fontWeight={600}
                    fontFamily="var(--font-sans), sans-serif"
                    style={{ pointerEvents: "none" }}
                  >
                    {s.name}
                  </text>
                </g>
              );
            })}

            {/* Inner circle border for sidereal ring */}
            {showSidereal && (
              <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="#C28220" strokeWidth="1.5" />
            )}

            {/* ===== TROPICAL INNER RING (pie sectors) ===== */}
            {showTropical && SIGNS.map((s, i) => {
              const start = s.start - AYANAMSHA;
              const end = s.start + 30 - AYANAMSHA;
              const mid = s.start + 15 - AYANAMSHA;
              const symPos = polar(CX, CY, (R_TROP_INNER + R_TROP_OUTER) / 2 + 2, mid);
              return (
                <g key={`t-${i}`}>
                  <path
                    d={arcPath(CX, CY, R_TROP_OUTER, start, end)}
                    fill={`${INDIGO}08`}
                    stroke={INDIGO}
                    strokeWidth="1"
                    strokeDasharray="3 2"
                  />
                  <line
                    x1={polar(CX, CY, R_TROP_INNER, start).x}
                    y1={polar(CX, CY, R_TROP_INNER, start).y}
                    x2={polar(CX, CY, R_TROP_OUTER, start).x}
                    y2={polar(CX, CY, R_TROP_OUTER, start).y}
                    stroke={INDIGO}
                    strokeWidth="0.8"
                    strokeDasharray="3 2"
                  />
                  <text
                    x={symPos.x}
                    y={symPos.y + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fill={INDIGO}
                    fontWeight={700}
                    fontFamily="var(--font-sans), sans-serif"
                    style={{ pointerEvents: "none" }}
                  >
                    {s.symbol}
                  </text>
                </g>
              );
            })}

            {showTropical && (
              <>
                <circle cx={CX} cy={CY} r={R_TROP_OUTER} fill="none" stroke={INDIGO} strokeWidth="1.2" strokeDasharray="5 4" />
                <circle cx={CX} cy={CY} r={R_TROP_INNER} fill="none" stroke={INDIGO} strokeWidth="1.2" strokeDasharray="5 4" />
              </>
            )}

            {/* ===== ECLIPTIC ===== */}
            <circle cx={CX} cy={CY} r={R_ECLIPTIC} fill="none" stroke="#4A6FA5" strokeWidth="1.5" strokeDasharray="8 5" />
            <text x={CX + R_ECLIPTIC + 10} y={CY + 5} fontSize="11" fill="#3D5A80" fontWeight={600} fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>Ecliptic</text>

            {/* ===== EARTH & AXIS ===== */}
            <circle cx={CX} cy={CY} r="20" fill="url(#earthGrad)" stroke="#2A6E80" strokeWidth="2" />
            <line x1={CX} y1={CY + 28} x2={CX} y2={CY - 28} stroke="#C28220" strokeWidth="3" strokeLinecap="round" />
            <polygon points={`${CX - 4},${CY - 28} ${CX + 4},${CY - 28} ${CX},${CY - 36}`} fill="#C28220" />
            <text x={CX + 10} y={CY - 32} fontSize="10" fill="#C28220" fontWeight={800} fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>N</text>

            {/* ===== GAP WEDGE ===== */}
            {showGap && showSidereal && showTropical && (
              <g style={{ cursor: "pointer" }} onClick={() => handleHotspot("gap")}>
                {/* Wedge fill */}
                <path
                  d={arcPath(CX, CY, R_OUTER + 2, -AYANAMSHA, 0)}
                  fill={`${VERMILION}18`}
                  stroke={VERMILION}
                  strokeWidth={activeTip === "gap" && selectedSign === null ? 2.5 : 1.5}
                  strokeDasharray="5 3"
                />
                {/* Radial boundary lines */}
                <line
                  x1={CX} y1={CY}
                  x2={polar(CX, CY, R_OUTER + 2, 0).x}
                  y2={polar(CX, CY, R_OUTER + 2, 0).y}
                  stroke={VERMILION}
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                />
                <line
                  x1={CX} y1={CY}
                  x2={polar(CX, CY, R_OUTER + 2, -AYANAMSHA).x}
                  y2={polar(CX, CY, R_OUTER + 2, -AYANAMSHA).y}
                  stroke={VERMILION}
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                />
                {/* Gap label inside the wedge, not floating above */}
                <text
                  x={polar(CX, CY, (R_OUTER + R_INNER) / 2, -AYANAMSHA / 2).x}
                  y={polar(CX, CY, (R_OUTER + R_INNER) / 2, -AYANAMSHA / 2).y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fill={VERMILION}
                  fontWeight={800}
                  fontFamily="var(--font-sans), sans-serif"
                  style={{ pointerEvents: "none" }}
                >
                  ~24°
                </text>
              </g>
            )}

            {/* ===== HOTSPOT CIRCLES + LABELS (spread to avoid overlap) ===== */}
            {/* Sidereal zero — label placed to the right */}
            {showSidereal && (() => {
              const pos = polar(CX, CY, R_OUTER + 14, 0);
              const lblPos = polar(CX, CY, R_OUTER + 36, 18); /* shift to 18° so it sits in Aries sector, clear of Pisces */
              return (
                <g style={{ cursor: "pointer" }} onClick={() => handleHotspot("sidereal")}>
                  <circle cx={pos.x} cy={pos.y} r={11} fill={`${GOLD}20`} stroke={GOLD} strokeWidth={activeTip === "sidereal" && selectedSign === null ? 3 : 2} />
                  <text
                    x={lblPos.x}
                    y={lblPos.y}
                    textAnchor="middle"
                    fontSize="11"
                    fill={GOLD}
                    fontWeight={700}
                    fontFamily="var(--font-sans), sans-serif"
                    style={{ pointerEvents: "none" }}
                  >
                    Sidereal 0° ♈
                  </text>
                </g>
              );
            })()}

            {/* Tropical zero — label placed to the left */}
            {showTropical && (() => {
              const pos = polar(CX, CY, R_OUTER + 14, -AYANAMSHA);
              const lblPos = polar(CX, CY, R_OUTER + 36, -AYANAMSHA - 18); /* shift further left into Aquarius/Pisces border area */
              return (
                <g style={{ cursor: "pointer" }} onClick={() => handleHotspot("tropical")}>
                  <circle cx={pos.x} cy={pos.y} r={11} fill={`${INDIGO}18`} stroke={INDIGO} strokeWidth={activeTip === "tropical" && selectedSign === null ? 3 : 2} />
                  <text
                    x={lblPos.x}
                    y={lblPos.y}
                    textAnchor="middle"
                    fontSize="11"
                    fill={INDIGO}
                    fontWeight={700}
                    fontFamily="var(--font-sans), sans-serif"
                    style={{ pointerEvents: "none" }}
                  >
                    Tropical 0° ♈
                  </text>
                </g>
              );
            })()}

            {/* Earth / Axis tilt hotspot */}
            <g style={{ cursor: "pointer" }} onClick={() => handleHotspot("earth")}>
              <circle cx={CX + 32} cy={CY - 8} r={14} fill={`${JADE}15`} stroke={JADE} strokeWidth={2} />
              <text x={CX + 32} y={CY - 4} textAnchor="middle" fontSize="10" fill={JADE} fontWeight={800} fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>23°</text>
            </g>
          </svg>
        </div>

        {/* Info panel */}
        <div style={{ flex: "1 1 260px", minWidth: 0 }}>
          <div
            style={{
              padding: "18px",
              borderRadius: "14px",
              background: `${active.color}06`,
              border: `1px solid ${active.color}20`,
            }}
          >
            <h4 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "18px", fontWeight: 600, color: active.color, marginBottom: "10px" }}>
              {active.title}
            </h4>
            <p style={{ fontSize: "13px", color: INK_PRIMARY, lineHeight: 1.65 }}>{active.body}</p>
          </div>

          {/* Quick-nav */}
          <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {Object.entries(tips).map(([key, t]) => (
              <button
                key={key}
                onClick={() => handleHotspot(key)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "8px",
                  border: `1.5px solid ${activeTip === key && selectedSign === null ? t.color : "rgba(156,122,47,0.12)"}`,
                  background: activeTip === key && selectedSign === null ? `${t.color}10` : "transparent",
                  color: activeTip === key && selectedSign === null ? t.color : INK_MUTED,
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ active, onClick, color, label }: { active: boolean; onClick: () => void; color: string; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "6px 12px",
        borderRadius: "8px",
        border: `1.5px solid ${active ? color : "rgba(156,122,47,0.15)"}`,
        background: active ? `${color}12` : "transparent",
        color: active ? color : INK_MUTED,
        fontSize: "12px",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {active ? <Eye size={13} /> : <EyeOff size={13} />}
      {label}
    </button>
  );
}
