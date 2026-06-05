"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, Layers, RotateCcw, SlidersHorizontal, TriangleAlert } from "lucide-react";

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

const SCENARIOS: Record<ScenarioKey, { label: string; planet: string; whole: string; placidus: string; note: string }> = {
  boundary: {
    label: "Boundary contrast",
    planet: "Mars near a cusp",
    whole: "10th house",
    placidus: "11th cusp",
    note: "Both statements can be valid once the house system is named.",
  },
  kp: {
    label: "KP convention",
    planet: "Venus on a KP cusp",
    whole: "7th house",
    placidus: "8th cusp",
    note: "KP does not stop at the cusp; it reads the cusp sub-lord chain.",
  },
  polar: {
    label: "Extreme latitude",
    planet: "Moon at 69 deg N",
    whole: "4th house",
    placidus: "Undefined",
    note: "At polar latitudes, do not force Placidus. Use whole-sign or equal-house.",
  },
};

export function PlacidusKpConvention() {
  const [scenario, setScenario] = useState<ScenarioKey>("boundary");
  const [latitude, setLatitude] = useState(28);
  const [showSubLord, setShowSubLord] = useState(true);
  const [nameSystem, setNameSystem] = useState(true);

  const active = SCENARIOS[scenario];
  const polarStress = latitude >= 66 || scenario === "polar";
  const latitudeLabel = latitude >= 66 ? "Extreme latitude" : latitude >= 55 ? "High latitude caution" : "Ordinary latitude";

  const synthesis = useMemo(() => {
    if (polarStress) {
      return "Placidus is distorted or undefined here. A KP-style Placidus chart should not be forced; fall back to whole-sign or equal-house and state that choice.";
    }
    if (!nameSystem) {
      return "The same planet can be reported in two houses. Without the system label, the learner cannot know whether this is whole-sign, Bhava Chalita, or KP Placidus.";
    }
    if (showSubLord) {
      return "KP mandates Placidus cusps and then adds the sub-lord layer. The cusp is the house framework; the sub-lord chain is the predictive engine.";
    }
    return "Placidus alone only gives a cusp-based house assignment. KP practice becomes KP when the sub-lord layer is added and interpreted.";
  }, [nameSystem, polarStress, showSubLord]);

  return (
    <div data-interactive="placidus-kp-convention" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Placidus and KP convention</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Time-based cusps, stream-specific rules
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Compare whole-sign language with KP Placidus cusps, then add the KP sub-lord layer and test the polar-latitude limit.
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
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(330px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Cusp model</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>{active.label}</h3>
            </div>
            <strong style={{ color: polarStress ? VERMILION : GREEN }}>{latitudeLabel}</strong>
          </div>

          <PlacidusSvg scenario={scenario} polarStress={polarStress} showSubLord={showSubLord} nameSystem={nameSystem} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
            <ResultCard title={nameSystem ? "Whole-sign" : "Unlabeled"} value={active.whole} color={BLUE} note="Tier-1 default sign-block assignment" />
            <ResultCard title={nameSystem ? "KP Placidus" : "Unlabeled"} value={polarStress ? "Fallback needed" : active.placidus} color={polarStress ? VERMILION : GREEN} note="Time-cusp convention used by KP" />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Scenario" icon={<GitCompare size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setScenario(key)} style={buttonStyle(scenario === key, BLUE)}>
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{active.planet}: {active.note}</p>
          </Panel>

          <Panel title="Latitude stress test" icon={<SlidersHorizontal size={18} />} color={polarStress ? VERMILION : GOLD}>
            <label style={labelStyle}>
              Birth latitude: {latitude} deg
              <input type="range" min={0} max={75} value={latitude} onChange={(event) => setLatitude(Number(event.target.value))} style={{ accentColor: polarStress ? VERMILION : GOLD }} />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.65rem", alignItems: "center" }}>
              <span style={{ height: 8, borderRadius: 999, background: `linear-gradient(90deg, ${GREEN} 0 72%, ${VERMILION} 72% 100%)` }} />
              <strong style={{ color: polarStress ? VERMILION : GREEN }}>~66 deg limit</strong>
            </div>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <Panel title="KP layer" icon={<Layers size={18} />} color={showSubLord ? GREEN : GOLD}>
          <button type="button" aria-pressed={showSubLord} onClick={() => setShowSubLord((value) => !value)} style={buttonStyle(showSubLord, GREEN)}>
            {showSubLord ? "Sub-lord layer on" : "Cusps only"}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {showSubLord ? "KP reads the Placidus cusp through the sub-lord chain." : "This shows Placidus as a house system, before the KP predictive layer is added."}
          </p>
        </Panel>

        <Panel title="Naming discipline" icon={<BadgeCheck size={18} />} color={nameSystem ? GREEN : VERMILION}>
          <button type="button" aria-pressed={nameSystem} onClick={() => setNameSystem((value) => !value)} style={buttonStyle(nameSystem, nameSystem ? GREEN : VERMILION)}>
            {nameSystem ? "System labels on" : "System labels off"}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {nameSystem ? "Clean comparison: each house statement declares its convention." : "Ambiguous comparison: two house statements look contradictory without context."}
          </p>
        </Panel>

        <section style={{ border: `1px solid ${(polarStress || !nameSystem) ? VERMILION : GOLD}66`, borderRadius: 8, background: `${(polarStress || !nameSystem) ? VERMILION : GOLD}12`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: (polarStress || !nameSystem) ? VERMILION : GOLD, fontWeight: 950 }}>
            <TriangleAlert size={18} />
            Lesson verdict
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

function PlacidusSvg({ scenario, polarStress, showSubLord, nameSystem }: { scenario: ScenarioKey; polarStress: boolean; showSubLord: boolean; nameSystem: boolean }) {
  const kpX = scenario === "kp" ? 326 : scenario === "polar" ? 390 : 348;
  const planetX = scenario === "kp" ? 332 : scenario === "polar" ? 382 : 342;
  return (
    <svg viewBox="0 0 620 330" role="img" aria-label="Whole-sign blocks compared with KP Placidus cusps and sub-lord layer" style={{ width: "100%", maxHeight: 380, margin: "0.6rem auto 0.9rem", display: "block" }}>
      <rect x="34" y="48" width="552" height="78" rx="8" fill={`${BLUE}10`} stroke={`${BLUE}44`} />
      <rect x="34" y="48" width="184" height="78" rx="8" fill={`${GOLD}16`} />
      <rect x="218" y="48" width="184" height="78" fill={`${GOLD}0D`} />
      <rect x="402" y="48" width="184" height="78" rx="8" fill={`${GOLD}16`} />
      <text x="126" y="77" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900">{nameSystem ? "Whole-sign 9H" : "House 9"}</text>
      <text x="310" y="77" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900">{nameSystem ? "Whole-sign 10H" : "House 10"}</text>
      <text x="494" y="77" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900">{nameSystem ? "Whole-sign 11H" : "House 11"}</text>
      <text x="310" y="107" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="800">Sign blocks stay clean and equal</text>

      <path d={polarStress ? "M54 188 C130 145, 206 222, 282 168 S434 222, 566 154" : "M54 184 C152 150, 244 154, 338 184 S482 222, 566 178"} fill="none" stroke={polarStress ? VERMILION : GREEN} strokeWidth="4" strokeDasharray={polarStress ? "8 7" : "0"} />
      {[100, 214, kpX, 450, 536].map((x, index) => (
        <g key={`${x}-${index}`}>
          <line x1={x} y1="146" x2={x} y2="236" stroke={polarStress && index > 1 ? VERMILION : GREEN} strokeWidth="2" strokeDasharray={index > 1 ? "5 5" : "0"} />
          <circle cx={x} cy={184 + (index % 2 === 0 ? -10 : 14)} r="7" fill={polarStress && index > 1 ? VERMILION : GREEN} />
        </g>
      ))}
      <text x="54" y="160" fill={INK_MUTED} fontSize="12" fontWeight="900">{nameSystem ? "Placidus time cusps" : "Cusp line"}</text>
      <text x="566" y="258" textAnchor="end" fill={polarStress ? VERMILION : GREEN} fontSize="12" fontWeight="900">
        {polarStress ? "distorted or undefined beyond ~66 deg" : "time-trisection, computed by software"}
      </text>

      <circle cx={planetX} cy="184" r="18" fill={VERMILION} />
      <text x={planetX} y="189" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="950">P</text>

      {showSubLord ? (
        <g>
          <line x1={planetX} y1="205" x2="310" y2="276" stroke={GOLD} strokeWidth="2" />
          <rect x="200" y="272" width="220" height="36" rx="8" fill={`${GOLD}18`} stroke={`${GOLD}66`} />
          <text x="310" y="295" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="950">KP cusp sub-lord chain</text>
        </g>
      ) : (
        <text x="310" y="294" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="900">Sub-lord layer hidden</text>
      )}
    </svg>
  );
}

function ResultCard({ title, value, color, note }: { title: string; value: string; color: string; note: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.75rem" }}>
      <div style={{ color, fontWeight: 950 }}>{title}</div>
      <strong style={{ display: "block", marginTop: "0.45rem", color: INK_PRIMARY }}>{value}</strong>
      <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, lineHeight: 1.4 }}>{note}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

const labelStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  color: INK_MUTED,
  fontWeight: 900,
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
