"use client";
import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, Layers, RotateCcw, SlidersHorizontal, TriangleAlert, Terminal, Eye, Sparkles } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";

type ScenarioKey = "boundary" | "kp" | "polar";

interface ScenarioDetails {
  label: string;
  role: string;
  planet: string;
  whole: string;
  placidus: string;
  note: string;
  challenge: string;
}

const SCENARIOS: Record<ScenarioKey, ScenarioDetails> = {
  boundary: {
    label: "Boundary Contrast Case",
    role: "Natal Astrologer Scenario",
    planet: "Mars near 9H/10H border",
    whole: "10th House (Aries)",
    placidus: "11th Cusp (Cancer)",
    note: "A planet sits near the sign border. Under Whole-Sign it's in the 10th house; under Placidus, unequal division places it in the 11th.",
    challenge: "Verify the astronomical reason why unequal division displaces the cusp compared to equal 30° divisions.",
  },
  kp: {
    label: "KP Sub-Lord Integration",
    role: "KP Horary Practitioner Scenario",
    planet: "Venus on cusp line",
    whole: "7th House (Libra)",
    placidus: "8th Cusp (Scorpio)",
    note: "KP practitioners check both the Placidus cusp degree and the precise sub-lord. The sub-lord chain yields the definitive prediction.",
    challenge: "Toggle the Sub-Lord layer to visualize how the cusp coordinates link to the Vimshottari fractional division.",
  },
  polar: {
    label: "Extreme Polar Latitude Check",
    role: "High-Latitude Practitioner Scenario",
    planet: "Moon in Tromsø (69° N)",
    whole: "4th House (Pisces)",
    placidus: "Undefined Cusp",
    note: "At polar latitudes (above 66°33′), the ecliptic path does not rise/set regularly. Placidus math experiences a singularity division by zero.",
    challenge: "Use the latitude slider to cross the polar circle boundary and observe the resulting mathematical breakdown warning.",
  },
};

export function PlacidusKpConvention() {
  const [scenario, setScenario] = useState<ScenarioKey>("boundary");
  const [latitude, setLatitude] = useState(28);
  const [showSubLord, setShowSubLord] = useState(true);
  const [nameSystem, setNameSystem] = useState(true);

  const active = SCENARIOS[scenario];
  const polarStress = latitude >= 66 || scenario === "polar";
  const latitudeLabel = latitude >= 66 ? "Polar Singularity" : latitude >= 55 ? "High Latitude Caution" : "Standard Latitude";

  const synthesis = useMemo(() => {
    if (polarStress) {
      return "Placidus is mathematically distorted or undefined at polar coordinates. The time-division curves fail because segments of the ecliptic never cross the horizon. Fall back to Whole-Sign or Equal House and document this system choice.";
    }
    if (!nameSystem) {
      return "Without clear system labels, reporting a planet in two different houses looks like a logical contradiction to the learner. Specifying 'Whole-Sign' vs 'KP Placidus' resolves the conflict.";
    }
    if (showSubLord) {
      return "KP customizes Placidus by reading the cusp coordinates through the sub-lord subdivisions. The cusp defines the house boundary; the sub-lord acts as the dynamic outcome filter.";
    }
    return "Showing Placidus alone displays unequal houses. The true Krishnamurti Paddhati methodology requires adding the fractional sub-lord layer on top of these coordinates.";
  }, [nameSystem, polarStress, showSubLord]);


  return (
    <div data-interactive="placidus-kp-convention" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      {/* Header Panel */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem", boxShadow: "0 4px 20px -2px rgba(184, 132, 33, 0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD, fontWeight: 900, background: `${GOLD}15`, padding: "2px 8px", borderRadius: "4px" }}>Lesson 1 Interactive</span>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE, fontWeight: 900, background: `${BLUE}15`, padding: "2px 8px", borderRadius: "4px" }}>VIX Refined</span>
            </div>
            <h2 style={{ margin: "0.3rem 0 0.1rem", color: GOLD, fontSize: "1.35rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
              Placidus &amp; KP House Conventions
            </h2>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "12.5px", lineHeight: 1.5 }}>
              Investigate the divergence between sign-house identity (Parāśarī) and time-trisected house cusps (KP Placidus). Test polar limits and sub-lord layers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScenario("boundary");
              setLatitude(28);
              setShowSubLord(true);
              setNameSystem(true);
            }}
            style={buttonStyle(false, BLUE)}
          >
            <RotateCcw size={13} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Main Interactive Sandbox Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1rem", alignItems: "start" }}>
        
        {/* Left Column: Visual Cusp Canvas Card */}
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.4rem" }}>
            <div>
              <p style={eyebrowStyle}>{active.role}</p>
              <h3 style={{ margin: "0.1rem 0 0", color: GOLD, fontSize: "1.1rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>{active.label}</h3>
            </div>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 800,
                color: polarStress ? VERMILION : GREEN,
                background: polarStress ? `${VERMILION}15` : `${GREEN}15`,
                padding: "3px 8px",
                borderRadius: "999px",
                border: `1px solid ${polarStress ? VERMILION : GREEN}33`
              }}
            >
              {latitudeLabel}
            </span>
          </div>

          <div style={{ background: "rgba(252,248,236,0.3)", borderRadius: "8px", border: `1px solid ${HAIRLINE}33`, padding: "0.4rem" }}>
            <PlacidusSvg scenario={scenario} polarStress={polarStress} showSubLord={showSubLord} nameSystem={nameSystem} latitude={latitude} />
          </div>
        </section>

        {/* Right Column: Compact Unified Control Dashboard Card */}
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.85rem", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <h3 style={{ margin: 0, fontSize: "12px", fontWeight: 900, color: GOLD, borderBottom: `1px solid ${HAIRLINE}55`, paddingBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Control Dashboard
          </h3>
          
          {/* Scenario Selector */}
          <div>
            <label style={{ display: "block", fontSize: "10.5px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", marginBottom: "4px" }}>Select Case Scenario</label>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setScenario(key)}
                  style={{
                    ...buttonStyle(scenario === key, BLUE),
                    padding: "0.35rem 0.65rem",
                    fontSize: "11px"
                  }}
                >
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Active Scenario Text */}
          <div style={{ background: "rgba(53,108,171,0.03)", borderLeft: `3px solid ${BLUE}`, padding: "6px 10px", borderRadius: "0 6px 6px 0" }}>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "11.5px", lineHeight: 1.45 }}>
              <strong>{active.planet}</strong>: {active.note}
            </p>
          </div>

          {/* Latitude Slider */}
          <div style={{ borderTop: `1px solid ${HAIRLINE}55`, paddingTop: "0.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <span style={{ fontSize: "10.5px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>Birth Latitude:</span>
              <span style={{ fontSize: "13px", fontWeight: 900, color: polarStress ? VERMILION : GOLD, fontFamily: "monospace" }}>{latitude}° N</span>
            </div>
            <input
              type="range"
              min={0}
              max={75}
              value={latitude}
              onChange={(event) => {
                setLatitude(Number(event.target.value));
                if (Number(event.target.value) >= 66) {
                  setScenario("polar");
                }
              }}
              style={{ accentColor: polarStress ? VERMILION : GOLD, cursor: "pointer", width: "100%", height: "4px" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED, marginTop: "2px" }}>
              <span>Equator (0°)</span>
              <span>Polar Circle (66.5° N)</span>
              <span>High Lat (75°)</span>
            </div>
          </div>

          {/* Control Toggles Row */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${HAIRLINE}55`, paddingTop: "0.65rem" }}>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>KP Sub-Lord:</span>
              <button
                type="button"
                onClick={() => setShowSubLord(!showSubLord)}
                style={{ padding: "3px 6px", fontSize: "10.5px", borderRadius: 4, border: `1.5px solid ${showSubLord ? GREEN : HAIRLINE}`, background: showSubLord ? `${GREEN}15` : "transparent", color: showSubLord ? GREEN : INK_SECONDARY, fontWeight: 700, cursor: "pointer" }}
              >
                {showSubLord ? "Active" : "Disabled"}
              </button>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>Labels:</span>
              <button
                type="button"
                onClick={() => setNameSystem(!nameSystem)}
                style={{ padding: "3px 6px", fontSize: "10.5px", borderRadius: 4, border: `1.5px solid ${nameSystem ? GREEN : HAIRLINE}`, background: nameSystem ? `${GREEN}15` : "transparent", color: nameSystem ? GREEN : INK_SECONDARY, fontWeight: 700, cursor: "pointer" }}
              >
                {nameSystem ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Synthesis / Verdict Panel */}
      <section
        style={{
          border: `1.5px solid ${(polarStress || !nameSystem) ? VERMILION : GOLD}44`,
          borderRadius: 12,
          background: `${(polarStress || !nameSystem) ? VERMILION : GOLD}08`,
          padding: "1rem",
          display: "flex",
          gap: "10px",
          alignItems: "start"
        }}
      >
        <TriangleAlert size={18} style={{ color: (polarStress || !nameSystem) ? VERMILION : GOLD, flexShrink: 0, marginTop: "2px" }} />
        <div>
          <h4 style={{ margin: "0 0 0.15rem", color: (polarStress || !nameSystem) ? VERMILION : GOLD, fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Pedagogical Verdict
          </h4>
          <p style={{ margin: 0, fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.5 }}>
            {synthesis}
          </p>
        </div>
      </section>
    </div>
  );
}

function PlacidusSvg({ scenario, polarStress, showSubLord, nameSystem, latitude }: { scenario: ScenarioKey; polarStress: boolean; showSubLord: boolean; nameSystem: boolean; latitude: number }) {
  const active = SCENARIOS[scenario];
  const angleRad = (latitude * Math.PI) / 180;
  const cX = 310;
  const cY = 175;
  const R = 115;
  
  // NCP (North Celestial Pole)
  const ncpX = cX + R * Math.cos(-angleRad);
  const ncpY = cY + R * Math.sin(-angleRad);
  
  // SCP (South Celestial Pole)
  const scpX = cX - R * Math.cos(-angleRad);
  const scpY = cY - R * Math.sin(-angleRad);

  const perpX = Math.cos(-angleRad + Math.PI/2);
  const perpY = Math.sin(-angleRad + Math.PI/2);

  // Oblique Ecliptic Path tilt relative to Celestial Equator
  const ecSlope = Math.PI / 6; // 30°
  const ecX1 = cX + R * Math.cos(-angleRad + Math.PI/2 + ecSlope);
  const ecY1 = cY + R * Math.sin(-angleRad + Math.PI/2 + ecSlope);
  const ecX2 = cX - R * Math.cos(-angleRad + Math.PI/2 + ecSlope);
  const ecY2 = cY - R * Math.sin(-angleRad + Math.PI/2 + ecSlope);

  // Planet placement based on scenario (scaled proportionally)
  let planetX = cX;
  let planetY = cY;
  let planetName = "Mars";

  if (scenario === "boundary") {
    planetX = cX + perpX * 45 + Math.cos(-angleRad) * 18;
    planetY = cY + perpY * 45 + Math.sin(-angleRad) * 18;
    planetName = "Mars";
  } else if (scenario === "kp") {
    planetX = cX + perpX * -55 - Math.cos(-angleRad) * 22;
    planetY = cY + perpY * -55 - Math.sin(-angleRad) * 22;
    planetName = "Venus";
  } else {
    planetX = cX + perpX * 80 + Math.cos(-angleRad) * 40;
    planetY = cY + perpY * 80 + Math.sin(-angleRad) * 40;
    planetName = "Moon";
  }

  const curveFactors = [-1.3, -0.65, 0, 0.65, 1.3];

  return (
    <svg viewBox="0 0 620 330" role="img" aria-label="Ecliptic house intersection sandbox" style={{ width: "100%", maxHeight: 420, display: "block" }}>
      <defs>
        {/* Clip path to keep all curves and lines inside the celestial sphere circle */}
        <clipPath id="sphere-clip">
          <circle cx={cX} cy={cY} r={R} />
        </clipPath>
      </defs>

      {/* Sign blocks at top */}
      <rect x="50" y="14" width="520" height="38" rx="6" fill={`${BLUE}08`} stroke={`${BLUE}33`} strokeWidth="1.2" />
      <line x1="223" y1="14" x2="223" y2="52" stroke={`${BLUE}33`} strokeWidth="1.2" />
      <line x1="396" y1="14" x2="396" y2="52" stroke={`${BLUE}33`} strokeWidth="1.2" />
      <text x="136" y="36" textAnchor="middle" fill={INK_PRIMARY} fontSize="11.5" fontWeight="800">{nameSystem ? "Whole-Sign 9H" : "House 9"}</text>
      <text x="310" y="36" textAnchor="middle" fill={INK_PRIMARY} fontSize="11.5" fontWeight="800">{nameSystem ? "Whole-Sign 10H" : "House 10"}</text>
      <text x="483" y="36" textAnchor="middle" fill={INK_PRIMARY} fontSize="11.5" fontWeight="800">{nameSystem ? "Whole-Sign 11H" : "House 11"}</text>

      {/* LEFT COLUMN: Dynamic Calculated Cusp Card */}
      <g transform="translate(15, 60)">
        <rect x="0" y="0" width="150" height="150" rx="8" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.2" style={{ filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.04))" }} />
        
        <text x="12" y="20" fontSize="10.5" fontWeight="800" fill={INK_PRIMARY} style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Calculated Cusp</text>
        <text x="12" y="40" fontSize="10" fontWeight="700" fill={INK_MUTED}>Whole-Sign Cusp:</text>
        <text x="12" y="56" fontSize="12.5" fontWeight="800" fill={BLUE} style={{ fontFamily: "var(--font-cormorant), serif" }}>{active.whole}</text>
        
        <line x1="12" y1="68" x2="138" y2="68" stroke={HAIRLINE} strokeWidth="1" strokeDasharray="2 2" />
        
        <text x="12" y="84" fontSize="10" fontWeight="700" fill={INK_MUTED}>KP Placidus Cusp:</text>
        <text x="12" y="100" fontSize="12.5" fontWeight="800" fill={polarStress ? VERMILION : GREEN} style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {polarStress ? "Singularity" : active.placidus}
        </text>
        
        <line x1="12" y1="112" x2="138" y2="112" stroke={HAIRLINE} strokeWidth="1" strokeDasharray="2 2" />

        <text x="12" y="128" fontSize="10" fontWeight="800" fill={INK_PRIMARY} style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Cusp Sub-Lord</text>
        <text x="12" y="142" fontSize="9.5" fontWeight="700" fill={GOLD}>
          {polarStress ? "Undefined" : showSubLord ? currentSubLordName(scenario) : "Sub-Lord Layer Off"}
        </text>
      </g>

      {/* RIGHT COLUMN: Diagram Legend Card */}
      <g transform="translate(455, 60)">
        <rect x="0" y="0" width="150" height="150" rx="8" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.2" style={{ filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.04))" }} />
        <text x="12" y="20" fontSize="10.5" fontWeight="800" fill={INK_PRIMARY} style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Diagram Legend</text>
        
        {/* Item 1: Horizon / Meridian */}
        <line x1="12" y1="42" x2="32" y2="42" stroke="#7c6d5b" strokeWidth="2.5" />
        <text x="40" y="45" fontSize="10" fontWeight="700" fill={INK_SECONDARY}>Horizon / Meridian</text>
        
        {/* Item 2: Celestial Equator */}
        <line x1="12" y1="68" x2="32" y2="68" stroke={BLUE} strokeWidth="2" />
        <text x="40" y="71" fontSize="10" fontWeight="700" fill={INK_SECONDARY}>Celestial Equator</text>
        
        {/* Item 3: Ecliptic Path */}
        <line x1="12" y1="94" x2="32" y2="94" stroke={GOLD} strokeWidth="3" />
        <text x="40" y="97" fontSize="10" fontWeight="700" fill={INK_SECONDARY}>Ecliptic Path</text>
        
        {/* Item 4: Placidus House Cusp */}
        <line x1="12" y1="120" x2="32" y2="120" stroke={polarStress ? VERMILION : GREEN} strokeWidth="2.5" strokeDasharray="3 2" />
        <text x="40" y="123" fontSize="10" fontWeight="700" fill={INK_SECONDARY}>Placidus House Cusp</text>
      </g>

      {/* Group wrapped in clip-path to keep lines/curves inside the celestial sphere */}
      <g clipPath="url(#sphere-clip)">
        {/* Celestial Sphere Inner Background */}
        <circle cx={cX} cy={cY} r={R} fill="rgba(53, 108, 171, 0.01)" />
        
        {/* Horizon Line (Ground Plane) */}
        <line x1={cX - R} y1={cY} x2={cX + R} y2={cY} stroke="#7c6d5b" strokeWidth="2" />
        <path d={`M ${cX - R} ${cY} A ${R} ${R} 0 0 0 ${cX + R} ${cY} Z`} fill="rgba(124, 109, 91, 0.04)" />

        {/* Meridian (Vertical Line) */}
        <line x1={cX} y1={cY - R} x2={cX} y2={cY + R} stroke="#7c6d5b" strokeWidth="1.2" strokeDasharray="4 4" />

        {/* Axis of Poles */}
        <line x1={scpX} y1={scpY} x2={ncpX} y2={ncpY} stroke={GOLD} strokeWidth="1.5" strokeDasharray="5 4" />

        {/* Celestial Equator (Perpendicular to pole axis) */}
        <line 
          x1={cX + R * Math.cos(-angleRad + Math.PI/2)} 
          y1={cY + R * Math.sin(-angleRad + Math.PI/2)} 
          x2={cX - R * Math.cos(-angleRad + Math.PI/2)} 
          y2={cY - R * Math.sin(-angleRad + Math.PI/2)} 
          stroke={BLUE} 
          strokeWidth="1.2" 
        />

        {/* Ecliptic Path */}
        <line x1={ecX1} y1={ecY1} x2={ecX2} y2={ecY2} stroke={GOLD} strokeWidth="2.5" />

        {/* Placidus House Curves */}
        {curveFactors.map((factor, idx) => {
          const ctrlX = cX + perpX * factor * 58;
          const ctrlY = cY + perpY * factor * 58;
          const strokeColor = polarStress ? VERMILION : GREEN;
          const dashArray = polarStress ? "3 3" : idx === 2 ? "0" : "2 2";
          
          return (
            <path 
              key={idx}
              d={`M ${ncpX} ${ncpY} Q ${ctrlX} ${ctrlY} ${scpX} ${scpY}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={idx === 2 ? "2" : "1.2"}
              strokeDasharray={dashArray}
            />
          );
        })}
      </g>

      {/* Labels placed outside the clip-path so they render fully, but with coordinates that keep them cleanly positioned */}
      <circle cx={cX} cy={cY} r={R} fill="none" stroke={HAIRLINE} strokeWidth="1.5" />
      <circle cx={cX} cy={cY} r={R} fill="none" stroke="rgba(124, 109, 91, 0.2)" strokeWidth="1" strokeDasharray="3 3" />

      {/* Internal coordinate labels in non-overlapping positions inside the circle */}
      <text x={cX - 65} y={cY - 6} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800">HORIZON</text>
      <text x={cX + 6} y={cY - R + 18} textAnchor="start" fill={INK_MUTED} fontSize="9" fontWeight="800">MERIDIAN</text>
      <text x={cX - 65 * Math.cos(-angleRad + Math.PI/2)} y={cY - 65 * Math.sin(-angleRad + Math.PI/2) - 6} textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="800">EQUATOR</text>
      <text x={cX + 65 * Math.cos(-angleRad + Math.PI/2 + ecSlope)} y={cY + 65 * Math.sin(-angleRad + Math.PI/2 + ecSlope) - 6} textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="900">ECLIPTIC PATH</text>

      {/* Pole axis label placed cleanly outside the circle */}
      <text x={ncpX + 8} y={ncpY - 6} textAnchor="start" fill={GOLD} fontSize="9" fontWeight="900">NCP (Pole)</text>

      {/* Warning on Polar Singularity */}
      {polarStress && (
        <g>
          <rect x={cX - 105} y={cY - 22} width="210" height="44" rx="6" fill="#FFF" stroke={VERMILION} strokeWidth="1.5" />
          <text x={cX} y={cY - 6} textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight="900">POLAR SINGULARITY</text>
          <text x={cX} y={cY + 10} textAnchor="middle" fill={INK_SECONDARY} fontSize="9.5" fontWeight="700">Curves fail to intersect ecliptic</text>
        </g>
      )}

      {/* Planet node */}
      <g>
        <circle cx={planetX} cy={planetY} r="15" fill={polarStress ? INK_MUTED : VERMILION} stroke="#fff" strokeWidth="2" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" }} />
        <text x={planetX} y={planetY + 3.5} textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="950">{planetName}</text>
      </g>
    </svg>
  );
}

// Helper to determine active sub-lord for visualization purposes
function currentSubLordName(scenario: ScenarioKey): string {
  if (scenario === "boundary") return "Mercury (10th Cusp Lord)";
  if (scenario === "kp") return "Venus (8th Cusp Lord)";
  return "Ketu";
}

function ResultCard({ title, value, color, note }: { title: string; value: string; color: string; note: string }) {
  return (
    <div style={{ border: `1px solid ${color}33`, borderRadius: 8, background: `${color}06`, padding: "0.85rem", transition: "all 200ms ease" }}>
      <div style={{ color, fontWeight: 900, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</div>
      <strong style={{ display: "block", marginTop: "0.4rem", color: INK_PRIMARY, fontSize: "18px", fontFamily: "var(--font-cormorant), serif" }}>{value}</strong>
      <p style={{ margin: "0.2rem 0 0", color: INK_MUTED, fontSize: "11px", lineHeight: 1.4 }}>{note}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 900, fontSize: "13px", borderBottom: `1px solid ${HAIRLINE}55`, paddingBottom: "0.4rem", marginBottom: "0.8rem" }}>
        {icon}
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1.5px solid ${active ? color : HAIRLINE}`,
    borderRadius: "6px",
    background: active ? color : "transparent",
    color: active ? "#FFF" : INK_SECONDARY,
    padding: "0.45rem 0.85rem",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 150ms ease",
    outline: "none"
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};

