"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";
import { Info, HelpCircle, ArrowRight, ArrowLeft, RotateCw } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.65))";
const GREEN = "#2F7D55";
const RED = "#A8412B";
const PURPLE = "#8b5cf6";

// Daily-motion speed order (fastest → slowest) + dīptāṁśa orb.
const PLANETS = [
  { name: "Moon",    short: "Mo", iast: "Candra",  glyph: "☽", deepta: 12, color: "#475569" },
  { name: "Mercury", short: "Me", iast: "Budha",   glyph: "☿", deepta: 7,  color: "#0D9488" },
  { name: "Venus",   short: "Ve", iast: "Śukra",   glyph: "♀", deepta: 7,  color: "#D946EF" },
  { name: "Sun",     short: "Su", iast: "Sūrya",   glyph: "☉", deepta: 15, color: "#EA580C" },
  { name: "Mars",    short: "Ma", iast: "Maṅgala", glyph: "♂", deepta: 8,  color: "#DC2626" },
  { name: "Jupiter", short: "Ju", iast: "Guru",    glyph: "♃", deepta: 9,  color: "#B45309" },
  { name: "Saturn",  short: "Sa", iast: "Śani",    glyph: "♄", deepta: 9,  color: "#1E293B" },
];

const PRESETS = [
  { label: "Moon applying (Itthaśāla)", a: 0, b: 6, offset: -8, retro: false },
  { label: "Mars separating (Īsarāpha)", a: 4, b: 6, offset: 10, retro: false },
  { label: "Retrograde applying", a: 1, b: 6, offset: 6, retro: true },
  { label: "Exact Peak Union", a: 0, b: 6, offset: 0, retro: false },
];

function polar(cx: number, cy: number, r: number, deg: number) {
  // Rotate by -90 so 0 degrees is facing straight UP (standard zodiac view anchor)
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const sweep = endDeg >= startDeg ? endDeg - startDeg : endDeg + 360 - startDeg;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

export function TajikaApplyingSeparating() {
  const [aIdx, setAIdx] = useState(0); // Moon (faster)
  const [bIdx, setBIdx] = useState(6); // Saturn (slower)
  const [offset, setOffset] = useState(-8);
  const [retro, setRetro] = useState(false);

  const fasterIdx = Math.min(aIdx, bIdx);
  const slowerIdx = Math.max(aIdx, bIdx);
  const faster = PLANETS[fasterIdx];
  const slower = PLANETS[slowerIdx];
  
  // Combined orb (average of the two diptamshas)
  const orb = (PLANETS[aIdx].deepta + PLANETS[bIdx].deepta) / 2;
  const inOrb = Math.abs(offset) <= orb;
  const exact = offset === 0;
  
  // Applying aspect condition:
  // If moving direct (retro=false): offset < 0 means it is behind (applying).
  // If moving retrograde (retro=true): offset > 0 means it is ahead but backing up towards exact (applying).
  const applying = !exact && ((offset < 0) !== retro);
  const yoga = !inOrb ? "out" : exact ? "exact" : applying ? "Itthaśāla" : "Īsarāpha";
  const samePlanet = aIdx === bIdx;

  const setPreset = (p: typeof PRESETS[number]) => {
    setAIdx(p.a);
    setBIdx(p.b);
    setOffset(p.offset);
    setRetro(p.retro);
  };

  // Full circular dial geometry (Expanded for readability)
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  
  // Outer boundaries
  const rOuterBound = 160;
  
  // Radial Separation: Places slower planet inside, faster planet outside.
  // This completely prevents overlaps even when offset is 0 degrees.
  const rSlower = 100;
  const rFaster = 142;
  
  // Coordinates
  const pExact = polar(cx, cy, rSlower, 0); // Slower is always anchored at 0°
  const pFaster = polar(cx, cy, rFaster, offset); // Faster orbits around it at offset

  // Direction of motion calculation (Curved along orbit or tangent arrow)
  const radFaster = ((offset - 90) * Math.PI) / 180;
  // Standard motion is clockwise (tangent points clockwise: dx = -sin, dy = cos)
  const baseDx = -Math.sin(radFaster);
  const baseDy = Math.cos(radFaster);
  
  // If retrograde, motion is counter-clockwise (reverse the tangent)
  const motionDir = retro ? -1 : 1;
  const arrowLength = 26;
  const arrowX = pFaster.x + motionDir * arrowLength * baseDx;
  const arrowY = pFaster.y + motionDir * arrowLength * baseDy;
  const arrowColor = applying ? GREEN : RED;

  const verdictColor = yoga === "Itthaśāla" ? GREEN : yoga === "Īsarāpha" ? RED : yoga === "exact" ? GOLD : INK_MUTED;

  return (
    <div 
      className="gl-surface-twilight-glass"
      style={{ 
        padding: "24px", 
        borderRadius: "14px", 
        background: "rgba(255, 253, 246, 0.85)", 
        border: "1px solid rgba(156, 122, 47, 0.2)", 
        boxShadow: "0 10px 40px rgba(156, 122, 47, 0.08)", 
        fontFamily: "'Inter', sans-serif", 
        color: INK_PRIMARY, 
        maxWidth: "960px", 
        margin: "0 auto", 
        display: "flex", 
        flexDirection: "column", 
        gap: "16px" 
      }}
      data-interactive="tajika-applying-separating"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 2 — Lesson 1
        </span>
        <h3 style={{ margin: "4px 0 0", fontSize: "22px", fontWeight: 800, color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          <IAST>Itthaśāla</IAST> vs <IAST>Īsarāpha</IAST> Aspect Modulations
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
          Differentiate applying configurations (<IAST>Itthaśāla</IAST>) from separating ones (<IAST>Īsarāpha</IAST>) based on relative planetary speeds and retrograde motion within coordinate limits.
        </p>
      </div>

      {/* Controls Dashboard */}
      <div 
        style={{ 
          background: "#ffffff", 
          padding: "16px", 
          borderRadius: "8px", 
          border: "1px solid rgba(156,122,47,0.15)", 
          display: "flex", 
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <span style={{ display: "inline-flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Graha A (Target)</span>
              <select 
                value={aIdx} 
                onChange={e => setAIdx(Number(e.target.value))} 
                style={{ border: "1px solid rgba(156,122,47,0.25)", borderRadius: "6px", background: "#ffffff", color: INK_PRIMARY, padding: "6px 8px", fontSize: "13px", fontWeight: 700 }}
              >
                {PLANETS.map((p, i) => (
                  <option key={p.name} value={i}>{p.glyph} {p.name} (orb {p.deepta}°)</option>
                ))}
              </select>
            </span>

            <span style={{ display: "inline-flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Graha B (Target)</span>
              <select 
                value={bIdx} 
                onChange={e => setBIdx(Number(e.target.value))} 
                style={{ border: "1px solid rgba(156,122,47,0.25)", borderRadius: "6px", background: "#ffffff", color: INK_PRIMARY, padding: "6px 8px", fontSize: "13px", fontWeight: 700 }}
              >
                {PLANETS.map((p, i) => (
                  <option key={p.name} value={i}>{p.glyph} {p.name} (orb {p.deepta}°)</option>
                ))}
              </select>
            </span>
          </div>

          {!samePlanet && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "240px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>
                  Speed-Ranked Position Offset ({faster.name} relative to {slower.name})
                </span>
                <input 
                  type="range" 
                  min={-30} 
                  max={30} 
                  step={1} 
                  value={offset} 
                  onChange={e => setOffset(Number(e.target.value))} 
                  style={{ width: "100%", accentColor: GOLD }} 
                  aria-label="degrees offset from exact aspect" 
                />
              </div>
              <span style={{ fontSize: "16px", fontWeight: 900, color: GOLD, minWidth: "50px", textAlign: "right" }}>
                {offset > 0 ? `+${offset}` : offset}°
              </span>
            </div>
          )}

          {!samePlanet && (
            <button 
              type="button" 
              aria-pressed={retro} 
              onClick={() => setRetro(r => !r)} 
              style={{ 
                border: `1.5px solid ${retro ? PURPLE : "rgba(156,122,47,0.25)"}`, 
                borderRadius: "6px", 
                background: retro ? "rgba(139, 92, 246, 0.1)" : "rgba(156,122,47,0.06)", 
                color: retro ? PURPLE : GOLD_DEEP, 
                padding: "8px 12px", 
                fontSize: "12px", 
                fontWeight: 700, 
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <RotateCw size={12} /> {retro ? "Retrograde (R) ON" : "Direct Motion"}
            </button>
          )}
        </div>

        {/* Presets Row */}
        <div style={{ borderTop: "1px dashed rgba(156, 122, 47, 0.15)", paddingTop: "10px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Quick Scenarios:</span>
          {PRESETS.map(p => (
            <button 
              key={p.label} 
              onClick={() => setPreset(p)} 
              style={{ 
                fontSize: "11px", 
                fontWeight: 700, 
                padding: "5px 10px", 
                borderRadius: "5px", 
                border: "1px solid rgba(156,122,47,0.2)", 
                background: "rgba(156,122,47,0.06)", 
                color: GOLD_DEEP, 
                cursor: "pointer",
                transition: "all 150ms ease"
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {samePlanet ? (
        <div style={{ background: "rgba(168, 65, 43, 0.05)", border: `1px solid ${RED}`, borderRadius: "8px", padding: "16px", color: RED, fontSize: "13.5px", fontWeight: 700 }}>
          Please select two different grahas to model the aspect parameters. (Tāzik rules depend on relative planetary speed order).
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "20px", alignItems: "start" }}>
          
          {/* Circular Map Simulator */}
          <div 
            style={{ 
              background: "#ffffff", 
              padding: "16px", 
              borderRadius: "10px", 
              border: "1px solid rgba(156,122,47,0.15)", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center" 
            }}
          >
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              Coordinate Orbit Alignment Map
            </span>
            
            <svg 
              width="100%" 
              viewBox={`0 0 ${size} ${size}`}
              style={{ backgroundColor: "rgba(255, 253, 246, 0.4)", borderRadius: "50%", maxWidth: "340px" }}
            >
              <defs>
                <marker id="motionArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill={arrowColor} />
                </marker>
              </defs>

              {/* Shaded Orb slice (Sector) in the outer faster planet orbit */}
              {/* Draws a slice of allowed degrees around 0 (exactness) */}
              <path 
                d={arcPath(cx, cy, rFaster + 12, -orb, orb)} 
                fill={inOrb ? "rgba(47, 125, 85, 0.08)" : "rgba(156, 122, 47, 0.02)"} 
                stroke={inOrb ? "rgba(47, 125, 85, 0.25)" : "rgba(156, 122, 47, 0.1)"} 
                strokeWidth="1" 
              />
              
              {/* Concentric Orbits */}
              <circle cx={cx} cy={cy} r={rSlower} fill="none" stroke="rgba(156,122,47,0.12)" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx={cx} cy={cy} r={rFaster} fill="none" stroke="rgba(156,122,47,0.12)" strokeWidth="1.5" />

              {/* Exact aspect alignment projection axis */}
              <line x1={cx} y1={cy} x2={polar(cx, cy, rFaster + 18, 0).x} y2={polar(cx, cy, rFaster + 18, 0).y} stroke={GOLD} strokeWidth="2" strokeDasharray="4,4" />
              <text x={polar(cx, cy, rFaster + 24, 0).x} y={polar(cx, cy, rFaster + 24, 0).y + 3} fontSize="9" fontWeight="800" fill={GOLD_DEEP} textAnchor="middle">0° EXACT</text>

              {/* Radial line from center through faster planet */}
              <line x1={cx} y1={cy} x2={polar(cx, cy, rFaster + 5, offset).x} y2={polar(cx, cy, rFaster + 5, offset).y} stroke="rgba(139, 92, 246, 0.25)" strokeWidth="1" />

              {/* Allowed Orb limit ticks */}
              <line 
                x1={polar(cx, cy, rFaster - 6, -orb).x} y1={polar(cx, cy, rFaster - 6, -orb).y} 
                x2={polar(cx, cy, rFaster + 6, -orb).x} y2={polar(cx, cy, rFaster + 6, -orb).y} 
                stroke={GREEN} strokeWidth="2" 
              />
              <line 
                x1={polar(cx, cy, rFaster - 6, orb).x} y1={polar(cx, cy, rFaster - 6, orb).y} 
                x2={polar(cx, cy, rFaster + 6, orb).x} y2={polar(cx, cy, rFaster + 6, orb).y} 
                stroke={GREEN} strokeWidth="2" 
              />
              <text x={polar(cx, cy, rFaster + 16, -orb).x} y={polar(cx, cy, rFaster + 16, -orb).y + 3} fontSize="8.5" fontWeight="700" fill={GREEN} textAnchor="middle">-{orb}°</text>
              <text x={polar(cx, cy, rFaster + 16, orb).x} y={polar(cx, cy, rFaster + 16, orb).y + 3} fontSize="8.5" fontWeight="700" fill={GREEN} textAnchor="middle">+{orb}°</text>

              {/* Slower (Target Anchor) Planet - Inner Orbit */}
              <g>
                <circle cx={pExact.x} cy={pExact.y} r="18" fill="#ffffff" stroke={slower.color} strokeWidth="3.5" />
                <text x={pExact.x} y={pExact.y + 2} textAnchor="middle" dominantBaseline="middle" fontSize="16" fill={slower.color}>{slower.glyph}</text>
                <text x={pExact.x} y={pExact.y + 30} textAnchor="middle" fontSize="9" fontWeight="800" fill={slower.color}>{slower.short} (Slower)</text>
              </g>

              {/* Faster (Moving Actor) Planet - Outer Orbit */}
              <g>
                <circle cx={pFaster.x} cy={pFaster.y} r="18" fill="#ffffff" stroke={faster.color} strokeWidth="3.5" />
                <text x={pFaster.x} y={pFaster.y + 2} textAnchor="middle" dominantBaseline="middle" fontSize="16" fill={faster.color}>{faster.glyph}</text>
                <text x={pFaster.x} y={pFaster.y + 30} textAnchor="middle" fontSize="9" fontWeight="800" fill={faster.color}>{faster.short} (Faster)</text>
                {retro && (
                  <rect x={pFaster.x + 8} y={pFaster.y - 24} width="12" height="12" rx="2" fill={PURPLE} />
                )}
                {retro && (
                  <text x={pFaster.x + 14} y={pFaster.y - 15} fill="#ffffff" fontSize="8" fontWeight="950" textAnchor="middle">R</text>
                )}
              </g>

              {/* Motion Direction Arrow along orbit */}
              {!exact && inOrb && (
                <line 
                  x1={pFaster.x} y1={pFaster.y} 
                  x2={arrowX} y2={arrowY} 
                  stroke={arrowColor} strokeWidth="3" 
                  markerEnd="url(#motionArrow)" 
                />
              )}

              {/* Center Hub */}
              <circle cx={cx} cy={cy} r="28" fill="#ffffff" stroke="rgba(156,122,47,0.25)" strokeWidth="1.5" />
              <text x={cx} y={cy - 4} textAnchor="middle" fontSize="8" fontWeight="800" fill={INK_MUTED}>OFFSET</text>
              <text x={cx} y={cy + 10} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK_PRIMARY}>
                {offset > 0 ? `+${offset}` : offset}°
              </text>
            </svg>

            <div style={{ fontSize: "11px", color: INK_MUTED, textAlign: "center", marginTop: "12px", lineHeight: "1.4" }}>
              Radially separated orbits prevent icon overlapping. {faster.name} (outer) is compared to {slower.name} (inner, anchored at 0° exact aspect). Shaded arc = Aspect Orb boundary.
            </div>
          </div>

          {/* Readout Column (Educational verdicts) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            
            {/* Aspect Verdict Block */}
            <div 
              style={{ 
                background: `${verdictColor}06`, 
                border: `1.5px solid ${verdictColor}`, 
                borderRadius: "8px", 
                padding: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.01)" 
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                {yoga === "Itthaśāla" && <ArrowRight size={18} color={GREEN} />}
                {yoga === "Īsarāpha" && <ArrowLeft size={18} color={RED} />}
                {yoga === "exact" && <span style={{ fontSize: "16px", color: GOLD }}>◎</span>}
                {yoga === "out" && <span style={{ fontSize: "16px", color: INK_MUTED }}>✗</span>}
                
                <span style={{ fontSize: "14.5px", fontWeight: 800, color: verdictColor }}>
                  {yoga === "Itthaśāla" && <><IAST>Itthaśāla Yoga</IAST> — Applying</>}
                  {yoga === "Īsarāpha" && <><IAST>Īsarāpha Yoga</IAST> — Separating</>}
                  {yoga === "exact" && "Exact Aspect — Peak Union"}
                  {yoga === "out" && "Out of Orb — No Aspect"}
                </span>
              </div>
              
              <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY }}>
                {yoga === "Itthaśāla" && `The faster planet (${faster.name}) is moving towards exact mathematical alignment. The aspect is building up, representing pending / upcoming annual events in the Varṣaphala.`}
                {yoga === "Īsarāpha" && `The faster planet (${faster.name}) has already crossed the exact degree alignment and is moving away. The aspect is dissipating, representing past / completed events in the year return.`}
                {yoga === "exact" && `The planets are perfectly aligned at the same coordinate. The yoga is at peak mathematical resonance. Neither applying nor separating.`}
                {yoga === "out" && `The coordinate offset (${Math.abs(offset)}°) exceeds the combined allowed orb limit of ${orb}°. The planets cannot exchange aspect forces.`}
              </p>
            </div>

            {/* Calculations Readout Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              <div style={{ background: "#ffffff", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "6px", padding: "10px", textAlign: "center" }}>
                <span style={{ fontSize: "9px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Faster Actor</span>
                <strong style={{ fontSize: "15px", color: faster.color, display: "block", marginTop: "2px" }}>{faster.glyph} {faster.short}</strong>
                <span style={{ fontSize: "9.5px", color: INK_MUTED }}>Speed Rank {fasterIdx + 1}</span>
              </div>
              <div style={{ background: "#ffffff", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "6px", padding: "10px", textAlign: "center" }}>
                <span style={{ fontSize: "9px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Allowed Orb</span>
                <strong style={{ fontSize: "16px", color: GOLD_DEEP, display: "block", marginTop: "2px" }}>{orb}°</strong>
                <span style={{ fontSize: "9.5px", color: INK_MUTED }}>Average limit</span>
              </div>
              <div style={{ background: "#ffffff", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "6px", padding: "10px", textAlign: "center" }}>
                <span style={{ fontSize: "9px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Current Gap</span>
                <strong style={{ fontSize: "16px", color: inOrb ? GREEN : RED, display: "block", marginTop: "2px" }}>{offset}°</strong>
                <span style={{ fontSize: "9.5px", color: INK_MUTED }}>{inOrb ? "Within Orb" : "Outside"}</span>
              </div>
            </div>

            {/* Practical Interpretation Guidelines */}
            <div style={{ background: "#ffffff", padding: "14px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.15)" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                Interpretive Time Calibration
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ flex: 1, padding: "8px", borderRadius: "5px", background: "rgba(47, 125, 85, 0.04)", border: `1px solid ${GREEN}`, fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                  <strong style={{ color: GREEN, display: "block", marginBottom: "2px" }}><IAST>Itthaśāla</IAST> (Applying)</strong>
                  Fulfillment of inquiry / success in coming months / future events.
                </div>
                <div style={{ flex: 1, padding: "8px", borderRadius: "5px", background: "rgba(168, 65, 43, 0.03)", border: `1px solid ${RED}`, fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                  <strong style={{ color: RED, display: "block", marginBottom: "2px" }}><IAST>Īsarāpha</IAST> (Separating)</strong>
                  Resolution already passed / cancellation / past conditions.
                </div>
              </div>
            </div>

            {/* Historical Text Context */}
            <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "10px", fontSize: "11px", color: INK_MUTED, lineHeight: "1.45" }}>
              <strong>Nīlakaṇṭhī Parameter:</strong> Both states require the planets to sit within their shared dīptāṁśas (orbs of influence). Standard sign-to-sign aspect visibility is not sufficient in Tājika; exact degree coordinates and speed ranks must be calculated to authenticate any yoga.
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
