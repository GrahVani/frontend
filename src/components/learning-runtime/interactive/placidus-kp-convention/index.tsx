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
    <div data-interactive="placidus-kp-convention" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      {/* Header Panel */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", boxShadow: "0 4px 20px -2px rgba(184, 132, 33, 0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD, fontWeight: 900, background: `${GOLD}15`, padding: "2px 8px", borderRadius: "4px" }}>Lesson 1 Interactive</span>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE, fontWeight: 900, background: `${BLUE}15`, padding: "2px 8px", borderRadius: "4px" }}>VIX Refined</span>
            </div>
            <h2 style={{ margin: "0.4rem 0 0.2rem", color: GOLD, fontSize: "1.45rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
              Placidus & KP House Conventions
            </h2>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "13px", lineHeight: 1.55, maxWidth: 850 }}>
              Investigate the divergence between sign-house identity (Parāśarī) and time-trisected house cusps (KP Placidus). Test the limits of polar geometry and toggle sub-lord layers.
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
              <RotateCcw size={14} aria-hidden="true" />
              Reset
            </button>
        </div>
      </section>

      {/* Main Interactive Sandbox */}
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "1.25rem", alignItems: "start" }}>
        
        {/* Visual Cusp Canvas */}
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem" }}>
            <div>
              <p style={eyebrowStyle}>{active.role}</p>
              <h3 style={{ margin: "0.1rem 0 0", color: GOLD, fontSize: "1.2rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>{active.label}</h3>
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: polarStress ? VERMILION : GREEN,
                background: polarStress ? `${VERMILION}15` : `${GREEN}15`,
                padding: "4px 10px",
                borderRadius: "999px",
                border: `1.5px solid ${polarStress ? VERMILION : GREEN}33`
              }}
            >
              {latitudeLabel}
            </span>
          </div>

          <div style={{ background: "rgba(252,248,236,0.3)", borderRadius: "8px", border: `1px solid ${HAIRLINE}33`, padding: "0.5rem" }}>
            <PlacidusSvg scenario={scenario} polarStress={polarStress} showSubLord={showSubLord} nameSystem={nameSystem} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
            <ResultCard title={nameSystem ? "Whole-Sign Cusp" : "Unlabeled House Placement"} value={active.whole} color={BLUE} note="Traditional equal 30° divisions based entirely on Lagna sign." />
            <ResultCard title={nameSystem ? "KP Placidus Cusp" : "Unlabeled Cusp Placement"} value={polarStress ? "Singularity Breakdown" : active.placidus} color={polarStress ? VERMILION : GREEN} note={polarStress ? "Placidus math fails here." : "Time-based unequal trisection."} />
          </div>
        </section>

        {/* Sidebar Controls */}
        <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {/* Scenario Picker */}
          <Panel title="Practitioner Scenarios" icon={<GitCompare size={16} />} color={BLUE}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "0.25rem" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setScenario(key)}
                  style={{
                    ...buttonStyle(scenario === key, BLUE),
                    padding: "0.4rem 0.75rem",
                    fontSize: "12px"
                  }}
                >
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
            <div style={{ background: "rgba(53,108,171,0.04)", borderLeft: `3px solid ${BLUE}`, padding: "8px 12px", borderRadius: "0 6px 6px 0" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: 900, color: BLUE, display: "block", marginBottom: "2px" }}>Active Scenario Details</span>
              <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "12px", lineHeight: 1.5 }}>
                <strong>{active.planet}</strong>: {active.note}
              </p>
            </div>
            <div style={{ background: "rgba(184,132,33,0.04)", borderLeft: `3px solid ${GOLD}`, padding: "8px 12px", borderRadius: "0 6px 6px 0", fontSize: "11px" }}>
              <strong>Challenge:</strong> {active.challenge}
            </div>
          </Panel>

          {/* Latitude Stress Test Slider */}
          <Panel title="Latitude Geometry Stress Test" icon={<SlidersHorizontal size={16} />} color={polarStress ? VERMILION : GOLD}>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: INK_SECONDARY }}>Birth Latitude:</span>
                <span style={{ fontSize: "14px", fontWeight: 900, color: polarStress ? VERMILION : GOLD, fontFamily: "monospace" }}>{latitude}° N</span>
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
                style={{ accentColor: polarStress ? VERMILION : GOLD, cursor: "pointer", width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: INK_MUTED }}>
                <span>Equator (0°)</span>
                <span>Polar Circle (66.5° N)</span>
                <span>High Lat (75°)</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.65rem", alignItems: "center", marginTop: "0.25rem" }}>
                <span style={{ height: 8, borderRadius: 999, background: `linear-gradient(90deg, ${GREEN} 0% 72%, ${VERMILION} 88% 100%)` }} />
                <strong style={{ fontSize: "11px", color: polarStress ? VERMILION : GREEN }}>
                  {polarStress ? "Singularity Breakdown Triggered" : "Geometry Safe Zone"}
                </strong>
              </div>
            </div>
          </Panel>

          {/* Controls Panel */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Panel title="KP Sub-Lord" icon={<Layers size={15} />} color={showSubLord ? GREEN : GOLD}>
              <button
                type="button"
                aria-pressed={showSubLord}
                onClick={() => setShowSubLord((val) => !val)}
                style={{ ...buttonStyle(showSubLord, GREEN), width: "100%", justifyContent: "center" }}
              >
                {showSubLord ? "Active" : "Disabled"}
              </button>
              <span style={{ fontSize: "10px", color: INK_MUTED, textAlign: "center", display: "block" }}>
                Links cusp to sub-lord divisions.
              </span>
            </Panel>
            <Panel title="Naming Discipline" icon={<BadgeCheck size={15} />} color={nameSystem ? GREEN : VERMILION}>
              <button
                type="button"
                aria-pressed={nameSystem}
                onClick={() => setNameSystem((val) => !val)}
                style={{ ...buttonStyle(nameSystem, nameSystem ? GREEN : VERMILION), width: "100%", justifyContent: "center" }}
              >
                {nameSystem ? "Labels On" : "Labels Off"}
              </button>
              <span style={{ fontSize: "10px", color: INK_MUTED, textAlign: "center", display: "block" }}>
                Avoids framework contradictions.
              </span>
            </Panel>
          </div>
        </section>
      </div>


      {/* Synthesis / Verdict Panel */}
      <section
        style={{
          border: `1.5px solid ${(polarStress || !nameSystem) ? VERMILION : GOLD}44`,
          borderRadius: 12,
          background: `${(polarStress || !nameSystem) ? VERMILION : GOLD}08`,
          padding: "1.25rem",
          display: "flex",
          gap: "12px",
          alignItems: "start"
        }}
      >
        <TriangleAlert size={20} style={{ color: (polarStress || !nameSystem) ? VERMILION : GOLD, flexShrink: 0, marginTop: "2px" }} />
        <div>
          <h4 style={{ margin: "0 0 0.25rem", color: (polarStress || !nameSystem) ? VERMILION : GOLD, fontSize: "14px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Pedagogical Verdict
          </h4>
          <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {synthesis}
          </p>
        </div>
      </section>
    </div>
  );
}

function PlacidusSvg({ scenario, polarStress, showSubLord, nameSystem }: { scenario: ScenarioKey; polarStress: boolean; showSubLord: boolean; nameSystem: boolean }) {
  const kpX = scenario === "kp" ? 326 : scenario === "polar" ? 390 : 348;
  const planetX = scenario === "kp" ? 332 : scenario === "polar" ? 382 : 342;
  return (
    <svg viewBox="0 0 620 330" role="img" aria-label="Whole-sign blocks compared with KP Placidus cusps and sub-lord layer" style={{ width: "100%", maxHeight: 380, display: "block" }}>
      <rect x="34" y="48" width="552" height="78" rx="8" fill={`${BLUE}08`} stroke={`${BLUE}33`} strokeWidth="1.5" />
      <rect x="34" y="48" width="184" height="78" rx="8" fill={`${GOLD}12`} />
      <rect x="218" y="48" width="184" height="78" fill={`${GOLD}05`} />
      <rect x="402" y="48" width="184" height="78" rx="8" fill={`${GOLD}12`} />
      <text x="126" y="77" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900" fontFamily="monospace">{nameSystem ? "Whole-Sign 9H" : "House 9"}</text>
      <text x="310" y="77" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900" fontFamily="monospace">{nameSystem ? "Whole-Sign 10H" : "House 10"}</text>
      <text x="494" y="77" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900" fontFamily="monospace">{nameSystem ? "Whole-Sign 11H" : "House 11"}</text>
      <text x="310" y="107" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="800">Fixed Equal 30° Sign Blocks</text>

      <path d={polarStress ? "M54 188 C130 145, 206 222, 282 168 S434 222, 566 154" : "M54 184 C152 150, 244 154, 338 184 S482 222, 566 178"} fill="none" stroke={polarStress ? VERMILION : GREEN} strokeWidth="4" strokeDasharray={polarStress ? "8 7" : "0"} />
      {[100, 214, kpX, 450, 536].map((x, index) => (
        <g key={`${x}-${index}`}>
          <line x1={x} y1="146" x2={x} y2="236" stroke={polarStress && index > 1 ? VERMILION : GREEN} strokeWidth="2" strokeDasharray={index > 1 ? "5 5" : "0"} />
          <circle cx={x} cy={184 + (index % 2 === 0 ? -10 : 14)} r="7" fill={polarStress && index > 1 ? VERMILION : GREEN} />
        </g>
      ))}
      <text x="54" y="160" fill={INK_MUTED} fontSize="11" fontWeight="900">{nameSystem ? "Placidus Cusp Lines" : "Cusp Line"}</text>
      <text x="566" y="258" textAnchor="end" fill={polarStress ? VERMILION : GREEN} fontSize="11" fontWeight="900">
        {polarStress ? "Placidus curve breaks down at polar latitude" : "Oblique time-trisection curves"}
      </text>

      <circle cx={planetX} cy="184" r="18" fill={VERMILION} stroke="#fff" strokeWidth="2" style={{ filter: "drop-shadow(0px 2px 5px rgba(0,0,0,0.2))" }} />
      <text x={planetX} y="188" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="950">Mars</text>

      {showSubLord ? (
        <g>
          <line x1={planetX} y1="202" x2="310" y2="274" stroke={GOLD} strokeWidth="2" strokeDasharray="3 3" />
          <rect x="200" y="272" width="220" height="34" rx="6" fill="#FFF" stroke={`${GOLD}AA`} strokeWidth="1.5" />
          <text x="310" y="293" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="950">KP Cusp Sub-Lord Chain</text>
        </g>
      ) : (
        <text x="310" y="294" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900">Sub-Lord Layer Disabled</text>
      )}
    </svg>
  );
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

